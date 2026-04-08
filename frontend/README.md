# Frontend (Next.js)

This package contains the CortexFlow interaction layer and visualization workspace.

Joint collaboration repository by the MA2TIC group.

Private codebase. Licensing context is defined in [../LICENSE](../LICENSE).

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS v4
- Recharts + Three.js
- Groq OpenAI-compatible transcription API

## Environment Variables

`.env.local` fields:

```env
GROQ_API_KEY=
GROQ_TRANSCRIBE_MODEL=whisper-large-v3-turbo
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_WAKE_ENABLED=true
```

`env.local.example` includes the same template.

## API Surface

- `POST /api/transcribe`: audio upload and Groq transcription
- `POST /api/analyze`: proxy to backend analysis endpoint at `BACKEND_URL`
- `POST /api/wake-backend`: best-effort health ping to reduce cold-start delay

## Hosting Profile

- Frontend platform: Vercel
- Vercel root directory: `frontend`
- Backend target: Hugging Face Spaces (Docker)

Typical Vercel variables:

- `GROQ_API_KEY`
- `GROQ_TRANSCRIBE_MODEL`
- `BACKEND_URL`
- `NEXT_PUBLIC_BACKEND_WAKE_ENABLED`

## Local Development Reference

```bash
npm ci
cp env.local.example .env.local
npm run dev
```

