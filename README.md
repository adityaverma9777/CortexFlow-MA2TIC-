# CortexFlow

CortexFlow is a cognitive-signature analysis platform that combines voice/text intake, deterministic linguistic biomarker extraction, and AI-assisted interpretation in a workspace-style experience.

Joint collaboration repository by the MA2TIC group.

## Platform Scope

- Voice-first and text-first input workflows
- Groq-backed transcription pipeline
- Deterministic scoring for language and cognitive markers
- AI-assisted narrative synthesis for clinician-friendly, non-diagnostic reporting
- Interactive multi-panel UI for trend and domain-level analysis

## Monorepo Structure

- `frontend/`: Next.js application for interface, interaction flow, and API routes
- `backend/`: FastAPI service for deterministic scoring and report orchestration

## Deployment Profile

- Frontend host: Vercel (`frontend` root directory)
- Backend host: Hugging Face Spaces (Docker)
- Warm-start behavior: frontend sends a background wake request to backend health endpoint during initial load

## Licensing and Ownership

This repository is private and not open source.

Usage, copying, modification, redistribution, and publication are restricted except where explicitly authorized in writing by the rights holder.

License terms: [LICENSE](LICENSE)
