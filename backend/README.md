# Backend

FastAPI backend service for CortexFlow.

Joint collaboration repository by the MA2TIC group.

Private codebase. Licensing context is defined in [../LICENSE](../LICENSE).

## Design Profile

- Deterministic feature extraction from transcript and pause signals
- Confidence and quality notes for low-evidence samples
- Non-diagnostic safety framing in generated output
- Groq model usage limited to narrative/safety language, not synthetic metric creation

## API Endpoints

- `GET /health`
- `GET /models/recommended`
- `POST /analyze`

`POST /analyze` payload shape:

```json
{
  "input_value": "optional text input",
  "transcript": "optional transcript input",
  "pause_map": [0.32, 0.45],
  "audio_duration": 24.8,
  "session_id": "optional"
}
```

Response format: streamed NDJSON with step and final events.

## Hugging Face Spaces (Docker)

Hosting target: Docker Space.

Deployment profile:

- Repository root in Space contains backend files (`main.py`, `requirements.txt`, `Dockerfile`, supporting modules)
- Required secret: `GROQ_API_KEY`
- Container runtime binds to `${PORT}` (default fallback configured in Dockerfile)
- Health probe endpoint: `GET /health`

## Local Development Reference

```bash
cd backend
python -m venv .venv
. .venv/Scripts/Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload --port 8000
```

