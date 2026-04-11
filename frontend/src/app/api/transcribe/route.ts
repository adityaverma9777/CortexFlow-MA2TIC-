import { type NextRequest, NextResponse } from "next/server";
const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";
const GROQ_TRANSCRIBE_MODEL = process.env.GROQ_TRANSCRIBE_MODEL ?? "whisper-large-v3-turbo";
const MAX_AUDIO_BYTES = 25 * 1024 * 1024;

const ROMAN_HINDI_MARKERS = new Set([
  "hai", "hain", "tha", "thi", "the", "main", "mein", "mera", "meri", "mere", "hum", "tum", "aap", "ye", "yeh",
  "wo", "woh", "ko", "se", "ka", "ki", "ke", "par", "aur", "lekin", "magar", "kyunki", "kyonki", "agar", "jab",
  "tab", "tak", "ya", "nahi", "nahin", "haan", "accha", "achha", "matlab", "yaar", "jaldi", "turant", "shayad",
  "pata", "samjho", "dekho", "bahut", "thoda", "zyada", "abhi", "kal", "kar", "karna", "kiya", "karo", "raha", "rahi",
]);

export const runtime = "nodejs";
export const maxDuration = 60;

function extractPauseMap(wordTimestamps: Array<{ word: string; start: number; end: number }>): number[] {
  const pauses: number[] = [];
  for (let i = 0; i < wordTimestamps.length - 1; i++) {
    const gap = wordTimestamps[i + 1].start - wordTimestamps[i].end;
    if (gap > 0.1) {
      pauses.push(gap);
    }
  }
  return pauses;
}

function detectLanguageProfile(transcript: string, hintedLanguage?: string) {
  const latinTokens = (transcript.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) ?? []).map((tok) => tok.toLowerCase());
  const devanagariTokens = transcript.match(/[\u0900-\u097F]+/gu) ?? [];

  const romanHindiHits = latinTokens.reduce(
    (count, token) => count + (ROMAN_HINDI_MARKERS.has(token) ? 1 : 0),
    0,
  );

  const hindiTokens = devanagariTokens.length + romanHindiHits;
  const englishTokens = Math.max(0, latinTokens.length - romanHindiHits);
  const total = Math.max(1, hindiTokens + englishTokens);

  const hindiRatio = hindiTokens / total;
  const englishRatio = englishTokens / total;
  const devanagariRatio = devanagariTokens.length / total;

  let label: "hinglish" | "hindi" | "english" | "multilingual" = "multilingual";
  if (hindiRatio >= 0.25 && englishRatio >= 0.25) {
    label = "hinglish";
  } else if (hindiRatio >= 0.6) {
    label = "hindi";
  } else if (englishRatio >= 0.6) {
    label = "english";
  }

  const hint = (hintedLanguage ?? "").trim().toLowerCase();
  if (label === "multilingual" && (hint === "hi" || hint === "hindi")) {
    label = "hindi";
  } else if (label === "multilingual" && (hint === "en" || hint === "english")) {
    label = "english";
  }

  return {
    label,
    englishRatio: Number(englishRatio.toFixed(4)),
    hindiRatio: Number(hindiRatio.toFixed(4)),
    devanagariRatio: Number(devanagariRatio.toFixed(4)),
  };
}

export async function POST(req: NextRequest) {
  try {
    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "Missing GROQ_API_KEY" }, { status: 500 });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    if (audioFile.size <= 0) {
      return NextResponse.json({ error: "Uploaded file is empty" }, { status: 400 });
    }

    if (audioFile.size > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        { error: "Audio file is too large. Please upload a file under 25MB." },
        { status: 413 }
      );
    }

    const whisperFormData = new FormData();
    whisperFormData.append("file", audioFile);
    whisperFormData.append("model", GROQ_TRANSCRIBE_MODEL);
    whisperFormData.append("response_format", "verbose_json");
    whisperFormData.append("timestamp_granularities[]", "word");

    const whisperRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: whisperFormData,
      signal: AbortSignal.timeout(60_000),
    });
    if (!whisperRes.ok) {
      const error = await whisperRes.text();
      return NextResponse.json({ error: `Whisper API error: ${error}` }, { status: whisperRes.status });
    }

    const whisperData = await whisperRes.json();
    const transcript = whisperData.text || "";
    const wordTimestamps = whisperData.words || [];
    const providerLanguage = typeof whisperData.language === "string" ? whisperData.language.toLowerCase() : undefined;
    const languageProfile = detectLanguageProfile(transcript, providerLanguage);

    const pauseMap = extractPauseMap(wordTimestamps);

    return NextResponse.json({
      transcript,
      pauseMap,
      wordTimestamps,
      duration: whisperData.duration,
      detectedLanguage: providerLanguage ?? languageProfile.label,
      languageProfile,
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
