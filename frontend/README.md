# Frontend (Next.js)

This frontend powers the CortexFlow user workspace and interaction layer.

JOINT COLLABORATION REPO BY THE MA2TIC GROUP.

This repository is private and not open source. Usage is governed by the root license file.



## Stack



- Next.js App Router

- React + TypeScript

- Tailwind CSS v4

- Recharts + Three.js

- Groq OpenAI-compatible transcription API



## Local Setup



1. Install dependencies:



```bash

npm ci

```



2. Create local env file:



```bash

cp .env.example .env.local

```



3. Fill env vars in `.env.local`:



```env

GROQ_API_KEY=your_groq_key

GROQ_TRANSCRIBE_MODEL=whisper-large-v3-turbo

BACKEND_URL=http://localhost:8000

```



4. Start dev server:



```bash

npm run dev

```



## API Routes



- `POST /api/transcribe`: uploads audio and calls Groq transcription.

- `POST /api/analyze`: proxies analysis payload to backend (`BACKEND_URL`).



## Deployment



### Vercel (frontend)



Set these environment variables in Vercel project settings:



- `GROQ_API_KEY`

- `GROQ_TRANSCRIBE_MODEL` (optional, default is `whisper-large-v3-turbo`)

- `BACKEND_URL` (public URL of the backend hosted on Render)

### Render (backend)



Deploy backend separately on Render and copy the Render service URL into Vercel as `BACKEND_URL`.



## Notes



- Keep API secrets only in environment variables.

- Preserve reusable panel architecture and shared visual tokens when making UI changes.

- Refer to the repository license in [../LICENSE](../LICENSE) before sharing or reusing this code.

