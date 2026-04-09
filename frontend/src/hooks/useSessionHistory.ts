"use client";
import { useState, useEffect, useCallback } from "react";
import type { CognitiveReport } from "@/components/cognition-report-panel";
import type { WordTimestamp } from "@/components/input-command-panel";
/*============================================================
  MA2TIC ORG — Proprietary Software
  © 2026 MA2TIC. All Rights Reserved.

  Licensed to: MA2TIC Organisation
  Owners: Archana Thakur | Tanisha Bhardwaj |
          Manika Kutiyal | Aditya Verma

  NOTICE: This software is proprietary and confidential.
  Unauthorized copying, fragmentation, redistribution,
  or publication of this code, in whole or in part,
  is strictly prohibited without prior written permission
  from the MA2TIC development team.

  For permissions and licensing inquiries, contact MA2TIC.
  ============================================================*/
export type HistoryEntry = {
  id: string;
  timestamp: number;
  inputType: "text" | "transcript";
  inputSnippet: string;
  scores: Record<string, number>;
  report: CognitiveReport;
  sessionId: string;
  wordTimestamps?: WordTimestamp[];
  audioDuration?: number;
};
/*============================================================
  MA2TIC ORG — Proprietary Software
  © 2026 MA2TIC. All Rights Reserved.

  Licensed to: MA2TIC Organisation
  Owners: Archana Thakur | Tanisha Bhardwaj |
          Manika Kutiyal | Aditya Verma

  NOTICE: This software is proprietary and confidential.
  Unauthorized copying, fragmentation, redistribution,
  or publication of this code, in whole or in part,
  is strictly prohibited without prior written permission
  from the MA2TIC development team.

  For permissions and licensing inquiries, contact MA2TIC.
  ============================================================*/
const MAX_ENTRIES = 100;

type ApiReportRow = {
  id: string;
  created_at: string;
  input_type: "text" | "transcript";
  input_snippet: string;
  scores: Record<string, number>;
  report: CognitiveReport;
  session_id: string;
  word_timestamps?: WordTimestamp[];
  audio_duration?: number;
};

function toHistoryEntry(row: ApiReportRow): HistoryEntry {
  return {
    id: row.id,
    timestamp: new Date(row.created_at).getTime(),
    inputType: row.input_type,
    inputSnippet: row.input_snippet,
    scores: row.scores,
    report: row.report,
    sessionId: row.session_id,
    wordTimestamps: row.word_timestamps,
    audioDuration: row.audio_duration,
  };
}

function authHeaders(idToken: string | null): HeadersInit {
  return idToken
    ? { Authorization: `Bearer ${idToken}` }
    : {};
}

export function useSessionHistory(idToken: string | null, isAuthenticated: boolean) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadEntries = useCallback(async () => {
    if (!isAuthenticated) {
      setEntries([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/reports", {
        method: "GET",
        cache: "no-store",
        headers: authHeaders(idToken),
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json() as { reports?: ApiReportRow[] };
      const mapped = (data.reports ?? []).map(toHistoryEntry);
      setEntries(mapped.slice(0, MAX_ENTRIES));
    } catch {
      // Ignore transient API failures and keep current state.
    } finally {
      setIsLoading(false);
    }
  }, [idToken, isAuthenticated]);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  const addEntry = useCallback(async (entry: Omit<HistoryEntry, "id" | "timestamp">) => {
    if (!isAuthenticated) return;

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(idToken),
        },
        body: JSON.stringify(entry),
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json() as { report?: ApiReportRow };
      if (!data.report) {
        return;
      }

      const created = toHistoryEntry(data.report);
      setEntries((prev) => [created, ...prev].slice(0, MAX_ENTRIES));
    } catch {
      // Ignore transient API failures.
    }
  }, [idToken, isAuthenticated]);

  const removeEntry = useCallback(async (id: string) => {
    if (!isAuthenticated) return;

    const previous = entries;
    setEntries((prev) => prev.filter((entry) => entry.id !== id));

    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: "DELETE",
        headers: authHeaders(idToken),
      });

      if (!res.ok) {
        setEntries(previous);
      }
    } catch {
      setEntries(previous);
    }
  }, [entries, idToken, isAuthenticated]);
/*============================================================
  MA2TIC ORG — Proprietary Software
  © 2026 MA2TIC. All Rights Reserved.

  Licensed to: MA2TIC Organisation
  Owners: Archana Thakur | Tanisha Bhardwaj |
          Manika Kutiyal | Aditya Verma

  NOTICE: This software is proprietary and confidential.
  Unauthorized copying, fragmentation, redistribution,
  or publication of this code, in whole or in part,
  is strictly prohibited without prior written permission
  from the MA2TIC development team.

  For permissions and licensing inquiries, contact MA2TIC.
  ============================================================*/
  const clearAll = useCallback(async () => {
    if (!isAuthenticated) return;

    const previous = entries;
    setEntries([]);

    try {
      const res = await fetch("/api/reports/clear", {
        method: "DELETE",
        headers: authHeaders(idToken),
      });

      if (!res.ok) {
        setEntries(previous);
      }
    } catch {
      setEntries(previous);
    }
  }, [entries, idToken, isAuthenticated]);

  return { entries, isLoading, addEntry, removeEntry, clearAll, reload: loadEntries };
}
