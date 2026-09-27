# VibrantStore

A complete, mobile-first website for a dropshipping education business.
**Hosted free on GitHub Pages** (static Next.js export) with **Supabase** as the
backend â€” the same pattern as the Remi web app.

Two products, one honest pitch:

- **The Dropshipping Course** â€” $19 one-time, self-paced (8 modules, 29 lessons)
- **VIP Mentorship** â€” $499 one-time, 1-to-1 support, course included

No fake testimonials, no fake income proof, no fake urgency â€” by design.

## Architecture

```
GitHub Pages (free, static)          Supabase (free tier)
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Next.js static export    â”‚  auth   â”‚ Auth (email magic links)     â”‚
â”‚ marketing + checkout +   â”‚ â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚ Postgres + Row Level Securityâ”‚
â”‚ course/VIP/admin UIs     â”‚  data   â”‚ Edge Functions:              â”‚
â”‚ (out/ via GitHub Actions)â”‚ â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚  create-checkout, chapa-     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜          â”‚  webhook (Chapa payments)    â”‚
                                     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

**Security model:** the static site is public by nature, so nothing secret lives
in it. Access control is enforced by Supabase Row Level Security â€” a visitor
without a `course` entitlement gets no rows back, whatever they do in the
browser. Payments run through Edge Functions (the only place secret keys
exist), and a payment webhook re-verifies every transaction with Chapa before
granting access.

## Setup (one time, ~15 minutes)

### 1. Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. **SQL Editor** â†’ paste the contents of [supabase/schema.sql](supabase/schema.sql) â†’ Run
3. **Authentication â†’ URL Configuration** â†’ set Site URL to
   `https://abelabel16.github.io/firststore` and add
   `https://abelabel16.github.io/firststore/welcome/` to Redirect URLs
   (add `http://localhost:3000/welcome/` too for local dev)
4. Deploy the payment functions (needs the [Supabase CLI](https://supabase.com/docs/guides/cli)):
   ```bash
   supabase login
   supabase link --project-ref <your-project-ref>
   supabase functions deploy create-checkout --no-verify-jwt
   supabase functions deploy chapa-webhook --no-verify-jwt
   supabase secrets set DEMO_PAYMENTS=true SITE_URL=https://abelabel16.github.io/firststore
   ```
   `DEMO_PAYMENTS=true` = test mode (no real money, clearly labeled). For live
   payments, create a [Chapa](https://chapa.co) merchant account and set:
   ```bash
   supabase secrets set DEMO_PAYMENTS=false CHAPA_SECRET_KEY=... CHAPA_WEBHOOK_SECRET=... CHAPA_CURRENCY=ETB CHAPA_AMOUNT_COURSE=... CHAPA_AMOUNT_VIP=...
   ```
   and point the Chapa dashboard webhook to
   `https://<project-ref>.supabase.co/functions/v1/chapa-webhook`.

### 2. GitHub

1. Repo â†’ **Settings â†’ Pages** â†’ Source: **GitHub Actions**
2. Repo â†’ **Settings â†’ Secrets and variables â†’ Actions â†’ Variables** â†’ add:
   - `NEXT_PUBLIC_SUPABASE_URL` â€” from Supabase â†’ Settings â†’ API
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` â€” same page (the anon/public key â€” safe to expose)
3. Push to `main` (or re-run the workflow) â†’ site deploys to
   `https://abelabel16.github.io/firststore`

Until step 2 is done, the site deploys in **showcase mode**: all marketing
pages work, login/checkout politely say the backend isn't connected yet.

### 3. Make yourself admin

Log in once on the site, then in the Supabase SQL Editor:

```sql
update public.profiles set is_admin = true where email = 'you@example.com';
```

### 4. Custom domain (Hostinger)

1. GitHub repo â†’ Settings â†’ Pages â†’ Custom domain â†’ enter your domain
2. Hostinger hPanel â†’ DNS Zone â†’ add:
   - `A` records for `@` â†’ `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` â†’ `abelabel16.github.io`
3. In [.github/workflows/deploy.yml](.github/workflows/deploy.yml) change
   `NEXT_PUBLIC_BASE_PATH` to `""` and `NEXT_PUBLIC_SITE_URL` to your domain,
   update the Supabase auth URLs and the `SITE_URL` secret, then push.

## Local development

```bash
npm install
copy .env.example .env.local     # add your Supabase URL + anon key
npm run dev
```

Without Supabase keys the marketing site runs fine and the customer areas show
a "backend not connected" notice.

## Customizing

- **Brand, prices, support email**: [src/config/site.ts](src/config/site.ts)
  âš ï¸ the crossed-out $199 must be a genuine reference price, else set it to null.
  Prices are also mirrored in `supabase/functions/create-checkout/index.ts`.
- **Course content & video URLs**: [src/content/course.ts](src/content/course.ts)
- **FAQ / resources**: `src/content/faq.ts`, `src/content/resources.ts`
- **Legal pages**: `src/app/(marketing)/{terms,privacy,refund-policy,disclaimer}`

## Scripts

- `npm run dev` â€” develop
- `npm run build` â€” static export into `out/`
