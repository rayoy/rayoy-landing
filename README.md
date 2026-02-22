This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## SaaS Setup & Configuration

This project has been transformed into a full SaaS platform on the `feature/saas-loop` branch. To run the commercial loop, you must configure the following:

### 1. Environment Variables
Create a `.env.local` file with:
- **Clerk**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`
- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Stripe**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- **AI**: `GOOGLE_GENERATIVE_AI_API_KEY` (Gemini API)

### 2. Database Schema
Ensure your Supabase project has a `users` table with:
- `id` (text, matches Clerk ID)
- `email` (text)
- `plan` (text: free/premium/plus/pro/ultra)
- `credits` (int)
- `birth_date`, `birth_time`, `birth_location`

### 3. Webhooks
- Configure **Clerk Webhook** to point to `/api/webhook/clerk`
- Configure **Stripe Webhook** to point to `/api/webhook/stripe`

Check out the [walkthrough.md](file:///Users/raywang/.gemini/antigravity/brain/6141e8e8-a3a9-497a-9aa8-a61eda19347e/walkthrough.md) for more details.
