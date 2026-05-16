# Peblo Notes — Collaborative AI Notes Workspace

A full-stack, AI-powered notes workspace built for the Peblo Full Stack Developer Challenge.

🔗 **Live Demo:** https://peblo-notes-sooty.vercel.app

---

## What I Built

A lightweight collaborative notes app where users can create and manage notes, generate AI summaries and action items, share notes publicly via unique URLs, and track productivity insights — all in a clean, fast interface.

---

## Screenshots

> Add screenshots here after recording demo video

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, Vite |
| Backend | Node.js, Express.js |
| Database | PostgreSQL via Supabase |
| AI | Groq API (Llama 3) |
| Auth | JWT + bcrypt |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Features

- ✅ Secure signup/login with JWT authentication
- ✅ Create, edit, archive, and delete notes
- ✅ Auto-save note changes (1 second debounce)
- ✅ Tags and categories for organisation
- ✅ AI-generated summaries, action items, and suggested titles
- ✅ Keyword search and tag filtering
- ✅ Public share links (no login required)
- ✅ Productivity insights dashboard
- ✅ Graceful AI fallback on API failure

---

## Architecture

```
Frontend (React + Vite)
        ↓ HTTP / REST
Backend (Node.js + Express)
        ↓
Supabase (PostgreSQL)
        ↓
Groq API (Llama 3 — AI summaries)
```

### API Endpoints

```
POST   /auth/signup              — Create account
POST   /auth/login               — Login
GET    /notes                    — Get all notes (search, filter)
POST   /notes                    — Create note
PATCH  /notes/:id                — Update note (auto-save)
DELETE /notes/:id                — Delete note
POST   /notes/:id/generate-summary — Generate AI insights
GET    /shared/:shareId          — Public note (no auth)
GET    /insights                 — Productivity dashboard data
```

---

## Database Schema

```sql
users (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,  -- bcrypt hashed
  created_at TIMESTAMP
)

notes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT,
  content TEXT,
  tags TEXT[],
  category TEXT,
  archived BOOLEAN,
  is_public BOOLEAN,
  share_id TEXT UNIQUE,
  ai_summary TEXT,
  ai_action_items JSONB,
  ai_suggested_title TEXT,
  ai_used BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- A Supabase account (free)
- A Groq API key (free at console.groq.com)

### 1. Clone the repo
```bash
git clone https://github.com/ramanydv795/peblo-notes.git
cd peblo-notes
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend setup
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 4. Database setup

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled',
  content TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'general',
  archived BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  share_id TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  ai_summary TEXT,
  ai_action_items JSONB DEFAULT '[]',
  ai_suggested_title TEXT,
  ai_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Environment Variables

### Backend `.env`
```
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000
```

---

## AI Integration

AI features use the **Groq API** with the `llama3-8b-8192` model.

For each note, the AI generates:
- A 2-3 sentence summary
- Extracted action items
- A suggested title if the current one is weak

The system prompts the model to return strict JSON, with a graceful fallback to a templated response if the API fails or returns malformed output.

---

## Key Decisions

1. **Groq over OpenAI** — Groq is free, fast (low latency), and sufficient for note summarisation tasks
2. **JWT over Supabase Auth** — More control over token handling and user table structure
3. **Debounced auto-save** — 1 second delay prevents excessive API calls while still feeling instant
4. **Hardcoded share_id** — Generated at note creation so sharing works instantly without extra DB calls
5. **Service role key on backend** — Bypasses Supabase RLS for reliable server-side queries

---

## Author

**Raman Yadav**
- GitHub: github.com/ramanydv795
- Email: ramanydv795@gmail.com