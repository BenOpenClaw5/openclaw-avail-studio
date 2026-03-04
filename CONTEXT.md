# AVAIL Studio

## Live URL
https://avail-studio-one.vercel.app

## GitHub
https://github.com/BenOpenClaw5/openclaw-avail-studio

## Stack
Next.js 15, TypeScript strict, Tailwind CSS, Recharts, Supabase, Anthropic SDK

## Env Vars
```
NEXT_PUBLIC_META_APP_ID=2029570947775436
META_APP_SECRET=<Vercel>
NEXT_PUBLIC_META_REDIRECT_URI=https://avail-studio-one.vercel.app/api/auth/callback
NEXT_PUBLIC_SUPABASE_URL=<Vercel>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Vercel>
ANTHROPIC_API_KEY=<Vercel>
USE_MOCK_DATA=true
NEXT_PUBLIC_APP_URL=https://avail-studio-one.vercel.app
```

## Supabase Tables
- users: meta_user_id, access_token, meta_user_name, meta_email, selected_ad_account_id
- user_settings: user_id, default_date_range, currency, timezone

## Pages
- / — Login with Meta OAuth
- /dashboard — 8 KPI cards, 4 charts, auto insights
- /campaigns — Sortable/filterable table
- /creatives — Grid/list view with performance tiers
- /assistant — Claude AI analysis with health score
- /reports — CSV/JSON export, daily breakdown
- /settings — Preferences, reconnect, disconnect
