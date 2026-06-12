# ⚡ REQUIX — PS21 · AgniBytes

> Commudle × Google for Developers HackDays · June 12, 2026

## What It Does
Multi-modal AI agent that converts fragmented business data (transcripts, whiteboard images, legacy docs, **voice input**) into structured, explainable BRDs in under 60 seconds.

## Sarvam AI Integration (Unique Differentiator)
| Feature | API | Purpose |
|---------|-----|---------|
| **Saarika v2.5 STT** | `api.sarvam.ai/speech-to-text` | Hindi/English voice capture |
| **Bulbul v1 TTS** | `api.sarvam.ai/text-to-speech` | BRD section narration |

No other competing team ships multilingual voice input + AI narration.

## Tech Stack
- **LLM:** Google Gemini 1.5 Pro (multi-modal)
- **Orchestration:** Vertex AI
- **Data Warehouse:** BigQuery
- **Storage:** Google Cloud Storage
- **Voice:** Sarvam AI (Saarika v2.5 + Bulbul v1)
- **Backend:** FastAPI + Python 3.11
- **Frontend:** React 18 + Vite + Three.js + Framer Motion
- **Version Control:** GitHub (auto-push)

## Quick Start

### Frontend
```bash
cd frontend
cp .env.example .env          # Add VITE_SARVAM_API_KEY
npm install
npm run dev                   # http://localhost:3000
```

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env          # Add GOOGLE_API_KEY + SARVAM_API_KEY
uvicorn main:app --reload --port 8000
# Docs: http://localhost:8000/docs
```

## Repo
https://github.com/hardik-gexcode/brd-agent-hack-days-
