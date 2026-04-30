# Stoke AI Website — Spark 2.0 Handoff

Copied into this workspace from Spark 1.0 extracted archive:
`/Users/jeffstoker/.openclaw/workspace/saios/extracted-from-1.0/.openclaw-old/workspace/stoke-ai-website`

## Stack
- Next.js app router
- React 19
- TypeScript
- Tailwind CSS v4
- ElevenLabs packages present for chat/voice widget

## Key files
- `src/app/page.tsx` — active homepage
- `src/app/page-saios.tsx` — alternate SAIOS-focused page
- `src/app/page-backup-old.tsx` — older homepage backup
- `src/components/ChatWidget.tsx` — site chat / voice widget
- `content/blog/*.md` — blog posts
- `public/` — logos, images, icons, audio
- `public/quickbooks/` — privacy policy + terms
- `.env.local` — copied locally but do not paste secrets into chat
- `.vercel/project.json` — Vercel project metadata
- `railway.json` — Railway deployment config

## How to work on it
```bash
cd /Users/jeffstoker/.openclaw/workspace/stoke-ai-website
npm install
npm run dev
npm run build
```

## Notes
This is the editable source copy for Spark 2.0. The `.next/` build output was intentionally not copied; rebuild it locally when needed.
