# SummaMind AI - Multimodal AI Summarization SaaS Platform

SummaMind AI is a production-ready, scalable AI SaaS web application that summarizes and chats with multiple types of content using state-of-the-art LLMs and vector-based Retrieval-Augmented Generation (RAG).

![SummaMind SaaS](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200)

---

## 🌟 Key Features

### 1. Multimodal Content Support
- **PDF Documents**: Scanned & digital PDFs with OCR extraction for tables, formulas, and definitions.
- **Images**: Vision models & OCR for handwritten notes, flowcharts, diagrams, receipts, and invoices.
- **Videos**: MP4 files, YouTube, and Vimeo URLs with automatic Whisper speech-to-text transcript extraction.
- **Audio Files**: MP3, WAV, M4A audio transcription and meeting notes synthesis.
- **Web URLs**: Automatic web crawling, script/ad removal, and main article extraction.
- **Plain Text**: Direct raw text ingestion.

### 2. Multi-LLM Provider Engine
Dynamically route requests across leading AI models with real-time metrics:
- **OpenAI**: GPT-5.5 Next-Gen, GPT-4.1 Turbo, GPT-4o
- **Google Gemini**: Gemini 2.5 Flash, Gemini 1.5 Pro
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Opus
- **DeepSeek**: DeepSeek R1 Reasoning
- **Grok**: Grok 2 xAI
- **Mistral**: Mistral Large 2
- **Cohere**: Command R+
- **Local Ollama**: 100% free local execution (Llama 3, Mistral)
- **OpenRouter**: Unified API routing

> **Every response displays**: Model Name • Provider • Token Usage • Response Time (ms) • Estimated Cost ($ USD).

### 3. Complete RAG Pipeline (`pgvector` + Supabase)
Documents are cleaned, split into 800-character overlapping chunks, embedded into 1536-dimensional vector space, and stored in Supabase `pgvector`. Search queries retrieve top-k matching chunks to generate zero-hallucination summaries and chat responses.

### 4. Comprehensive Output Summaries
- **Short Summary** (2–3 lines)
- **Medium Summary** (2 paragraphs)
- **Detailed Summary** (In-depth analysis)
- **Bullet Point Summary**
- **Key Takeaways & Action Items**
- **Important Facts & Statistics**
- **Generated FAQs**
- **Timeline & Chapter-wise Breakdown**
- **Multiple Choice Questions (MCQs) & Quiz**
- **Formulae & Definitions**
- **Structured JSON Export**

### 5. Conversational RAG Chat
Chat directly with uploaded files. Answers include exact **Page Numbers** (PDFs) and **Timestamps** (Video/Audio transcripts) as clickable citations.

### 6. Enterprise-Grade Security
- **Authentication**: Clerk authentication (`@clerk/clerk-react` + FastAPI JWT Middleware).
- **HTTPS & TLS 1.3**: Nginx reverse proxy configured with SSL termination, HTTP->HTTPS redirects, and HSTS.
- **Security Headers**: Content-Security-Policy (CSP), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

---

## 🏗️ Project Architecture

```
ai-summarizer/
├── frontend/                 # React 19 + TypeScript + Vite + Tailwind CSS v4
│   ├── src/
│   │   ├── components/       # Header, Sidebar, UploadModal, SummaryViewer, ChatInterface
│   │   ├── types/            # TypeScript schemas & interfaces
│   │   ├── App.tsx           # Main workspace application
│   │   └── index.css         # Glassmorphism design system
│   └── package.json
│
├── backend/                  # FastAPI + Python + SQLAlchemy + RAG Engine
│   ├── app/
│   │   ├── api/              # Auth, Files, RAG, Summarize, Chat, Models, Usage
│   │   ├── services/         # Multi-LLM provider, RAG pipeline, OCR, Speech, Web crawler
│   │   ├── config/           # Pydantic settings & secrets
│   │   └── main.py           # FastAPI entrypoint
│   └── requirements.txt
│
├── nginx/
│   └── nginx.conf            # Hardened Nginx TLS 1.3 reverse proxy & security headers
├── .env.example
└── README.md
```

---

## ⚡ Quick Start Guide

### Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend Setup (React 19 + Vite)
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Access Application: [http://localhost:5173](http://localhost:5173)

---

## 🔒 Security Compliance
- **TLS 1.3 / HSTS**: Enforced via Nginx reverse proxy.
- **CORS Hardening**: Strict origin whitelist.
- **Token Sanitization**: API keys are restricted to backend environment variables.
