# AI Resume Analyzer

Upload your resume and get AI-powered feedback — score, strengths, weaknesses, roast, and missing keywords.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` and add your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. Run locally:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Import repo on Vercel
3. Add `GROQ_API_KEY` in Vercel environment variables
4. Deploy
