# apps/web

Premium UI-only SaaS dashboard for **AI Business Assistant**.

## Run

```bash
cd apps/web
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) → redirects to `/app/dashboard`.

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · shadcn-style UI · Lucide · Framer Motion · Recharts

## Notes

- **UI only** — dummy data, no backend / Firebase / OpenAI / auth logic
- Theme + language toggles are presentation-only chrome state
- Design: emerald primary, `rounded-2xl`, soft shadows, dark mode ready, RTL-ready

See `docs/design/` for the full design system.
