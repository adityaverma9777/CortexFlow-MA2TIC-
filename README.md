# CortexFlow Repository

CortexFlow is a cognitive-signature analysis platform that combines speech/text intake, deterministic linguistic biomarker extraction, and AI-assisted interpretation in a single workspace-style product.

JOINT COLLABORATION REPO BY THE MA2TIC GROUP.

## What This Repository Does

- Captures user input through text and voice-first workflows.
- Transcribes speech through a Groq-backed transcription route.
- Computes structured cognitive and language-related indicators from deterministic feature extraction.
- Produces narrative analysis, safety notes, and risk framing in a clinician-friendly, non-diagnostic format.
- Presents trends and domain-level breakdowns in a premium interactive frontend.

## How It Works

1. Input ingestion:
User enters typed text or records audio from the frontend workspace.
2. Transcription pipeline:
Audio is routed through the transcription API and normalized for downstream analysis.
3. Deterministic scoring:
The backend computes measurable numeric features (for example lexical, semantic, syntax, prosody, affective signals).
4. AI interpretation layer:
Model-assisted reasoning generates concise summaries and context around measured metrics.
5. Unified output:
Results are streamed/rendered as structured dashboard panels, including history and comparative trends.

## Architecture Overview

- frontend/
Next.js application for UI, interaction flow, transcription route integration, and visualization panels.
- backend/
FastAPI service responsible for deterministic scoring, report generation, and API orchestration.

## Product Characteristics

- Multi-panel workspace UX rather than chat-only interaction.
- Deterministic-first scoring with AI augmentation, not AI-only scoring.
- Structured outputs suitable for internal review, demos, and iterative product validation.
- Strong emphasis on design quality, explainability, and stable behavior.

## Repository Guidelines

- Treat this codebase as a private product repository.
- Keep naming, branding, and terminology aligned with CortexFlow/MA2TIC.
- Preserve deterministic analysis behavior when refactoring.
- Validate major frontend/backend changes before release.

## Licensing and Ownership

This repository is not open source.

Use, copying, modification, redistribution, and publication are restricted except where explicitly authorized in writing by the rights holder.

See the license terms in [LICENSE](LICENSE).

## Copyright Registration Certificate

![CortexFlow Copyright Certificate](frontend/public/images/CortexFlow%20-%20Protected%20by%20Copyrighted.com_page-0001.jpg)

- Work title: CortexFlow
- Work type: Digital content
- Registration number: JMfvoCJAaLxUcIDf
- Registration date: April 8, 2026 at 7:54 AM
- Status: Registered

Certificate PDF: [CortexFlow - Protected by Copyrighted.com.pdf](CortexFlow%20-%20Protected%20by%20Copyrighted.com.pdf)
