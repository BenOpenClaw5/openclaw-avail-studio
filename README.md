# AVAIL Studio

**Real-time Meta Ads Intelligence & Strategic Control Platform**

A production-ready SaaS application for managing, analyzing, and optimizing Meta advertising accounts. Connect your Meta ad account and get real-time KPIs, creative performance insights, and AI-powered recommendations.

## 🚀 Features

- **Secure OAuth 2.0 Authentication** - Connect your Meta account safely
- **Real-time Dashboard** - Live KPIs: Spend, Revenue, ROAS, CTR, CPA, and more
- **Campaign Management** - View, analyze, and manage all campaigns
- **Creative Performance** - Identify top performers and underperformers
- **AI Assistant** - Strategic recommendations based on real data
- **Report Generation** - Export analytics as PDF, CSV, or JSON
- **Professional UI** - Dark mode, glass effects, enterprise-grade design

## 📋 Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- Meta Business Account with ad accounts access
- Supabase account

## 🔧 Setup Instructions

### 1. Clone & Install

```bash
git clone <repo-url>
cd avail-studio
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Meta API
NEXT_PUBLIC_META_APP_ID=2029570947775436
META_APP_SECRET=9515b7bd56fc38d79aa7dae622cb5ae5
NEXT_PUBLIC_META_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://gptjogubtnxzdhscqsts.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Session
NEXTAUTH_SECRET=your_secret_key_here
```

### 3. Database Setup

Log into your Supabase dashboard and run the SQL from `database.sql` in the SQL editor:

```sql
-- Copy entire contents of database.sql and paste into Supabase SQL editor
```

### 4. Update Meta OAuth Settings

1. Go to [Meta Developers](https://developers.facebook.com)
2. Find your app and go to Settings > Basic
3. Update OAuth Redirect URIs:
   - **Development:** `http://localhost:3000/api/auth/callback`
   - **Production:** `https://your-vercel-url.vercel.app/api/auth/callback`

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and click "Login with Meta" to test the OAuth flow.

## 📦 Build & Deploy

### Build

```bash
npm run build
```

### Deploy to Vercel

```bash
# Using Vercel CLI
vercel

# Or connect your GitHub repo to Vercel for auto-deployment
```

After deployment, update Meta OAuth redirect URI with your Vercel domain.

## 📁 Project Structure

```
avail-studio/
├── src/
│   ├── app/
│   │   ├── api/               # API routes (OAuth, Meta endpoints)
│   │   ├── dashboard/         # Dashboard layout & pages
│   │   ├── campaigns/         # Campaign analytics
│   │   ├── creatives/         # Creative performance
│   │   ├── assistant/         # AI recommendations
│   │   ├── reports/           # Report generation
│   │   ├── settings/          # Account settings
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   ├── lib/                   # Utilities & helpers
│   └── pages/                 # (If using Pages Router)
├── public/                    # Static assets
├── .env.example              # Environment template
├── .env.local                # Local env variables (git-ignored)
├── database.sql              # Supabase schema
├── next.config.js            # Next.js config
├── tailwind.config.js        # Tailwind CSS config
└── README.md                 # This file
```

## 🔐 Security

- **Token Storage:** Access tokens stored in httpOnly cookies (secure, not exposed to client JS)
- **Server Secrets:** Meta App Secret never exposed to frontend
- **API Validation:** All requests validated before execution
- **CORS:** Restricted to trusted origins only
- **HTTPS:** Always use HTTPS in production

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📊 How It Works

1. **Login** - Click "Login with Meta" on homepage
2. **OAuth Flow** - Redirected to Meta for authorization
3. **Token Exchange** - App securely exchanges code for access token
4. **Dashboard** - View real-time KPIs from your Meta account
5. **Analysis** - Explore campaigns, creatives, and recommendations

## 🤖 AI Assistant

The Assistant page provides strategic recommendations based on real account data:

- **CTR Fatigue Detection** - Alerts when engagement drops
- **Scaling Recommendations** - Scale top-performing creatives
- **Budget Reallocation** - Move budget from underperformers to winners
- **A/B Testing Suggestions** - Recommended tests based on data
- **Audience Insights** - Lookalike and segment recommendations

## 📈 Future Roadmap

- [ ] Multi-account support
- [ ] Automated alerts & notifications
- [ ] Slack/email integration
- [ ] Advanced audience segmentation
- [ ] Predictive analytics
- [ ] Campaign creation from dashboard
- [ ] Mobile app

## 🐛 Troubleshooting

### "No code returned"
- Make sure redirect URI in Meta app settings matches `NEXT_PUBLIC_META_REDIRECT_URI`
- Clear browser cookies and try again

### "Token exchange failed"
- Verify `META_APP_SECRET` is correct
- Check that your Meta app has ad account access permissions

### "CORS error"
- Ensure you're making requests from allowed origin
- Check Supabase CORS settings

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Meta API documentation: https://developers.facebook.com/docs/marketing-api
3. Check Supabase documentation: https://supabase.com/docs

## 📄 License

ISC - See LICENSE file for details

---

**Built with:** Next.js · React · TypeScript · Tailwind · Supabase · Recharts

**Status:** Production-Ready ✅
