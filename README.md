# WordForge — Creative Brainstorming Toolkit

A beautifully designed word brainstorming app powered by the [Wordnik API](https://developer.wordnik.com/).

## Features

### 🔍 Word Explorer
Deep-dive into any word: definitions, usage examples, synonyms, antonyms, hypernyms, hyponyms, and more. Click any related word to explore it instantly.

### ⚡ Spark Studio
Three creative ideation modes:
- **Word Mashup** — Get random nouns, verbs, and adjectives to combine into unexpected concepts
- **Idea Chain** — Start from a seed word and map outward through synonym/antonym/hypernym space
- **Contrast Pair** — Pit two random words against each other to generate tension and ideas

### ◈ Random Canvas
Shuffle words onto a pinnable canvas. Filter by part of speech, word length, and count. Pin the ones that spark something, reshuffle the rest.

### ✦ Word of the Day
A daily editorial-style card for Wordnik's curated word of the day, with a reveal mechanic and creative writing challenge.

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Wordnik REST API v4**
- Zero external UI dependencies — pure CSS design system

## Local Development

1. Clone the repo
2. Copy `.env.example` to `.env.local`
3. Get a free Wordnik API key at [developer.wordnik.com](https://developer.wordnik.com/)
4. Add your key: `WORDNIK_API_KEY=your_key_here`
5. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. In **Environment Variables**, add:
   - `WORDNIK_API_KEY` = your Wordnik API key
4. Click **Deploy**

Vercel auto-detects Next.js — no extra configuration needed.

---

## API Routes

| Route | Description |
|-------|-------------|
| `GET /api/word?word=X` | Definitions, related words, examples for word X |
| `GET /api/random?count=9&pos=noun` | Random words with optional POS filter |
| `GET /api/wotd` | Wordnik's word of the day |
| `GET /api/spark?mode=mashup` | Creative spark (modes: mashup, chain, contrast) |
| `GET /api/wordweb?word=X` | Semantic graph nodes and edges for word X |

---

## Design

Vintage editorial aesthetic: Instrument Serif headlines, DM Mono interface text, cream paper background with grain texture, rust-red accents. Built to feel like a beautifully typeset brainstorming journal.
