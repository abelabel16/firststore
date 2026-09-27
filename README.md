# FirstStore

A complete, mobile-first website for a dropshipping education business, built with
**Next.js (App Router) + TypeScript + Tailwind CSS**.

Two products, one honest pitch:

- **The Dropshipping Course** — $19 one-time, self-paced (8 modules, 29 lessons)
- **VIP Mentorship** — $499 one-time, 1-to-1 support, course included

No fake testimonials, no fake income proof, no fake urgency — by design.

## Quick start

```bash
npm install
copy .env.example .env      # then edit .env
npm run dev
```

Open http://localhost:3000.

### Try the full flow locally (no payment keys needed)

1. Go to `/course` → **Get Instant Access** → enter any name + email
2. The **demo gateway** page appears (clearly labeled — no real payments) → simulate success
3. The "email" with your login link is printed to the **terminal running `npm run dev`**
4. Open that link → you land in the student dashboard
5. Buy "VIP" the same way to see the VIP area (`/vip`)

### Admin

Set your email in `.env`:

```
ADMIN_EMAILS=you@example.com
```

Then log in at `/login` with that email (login link prints to the terminal) → you're
redirected to `/admin`.

Two seeded demo accounts exist for exploring the platform (marked **demo** in admin):
`demo-student@example.com` and `demo-vip@example.com`. Delete `data/db.json` to reset.

## Going live checklist

1. **Branding** — name, prices, support email, socials: [src/config/site.ts](src/config/site.ts).
   ⚠️ The crossed-out $199 reference price must be a *genuine* original price; otherwise set
   `referencePrice: null`.
2. **Course content** — lesson titles, descriptions, and `videoUrl`s:
   [src/content/course.ts](src/content/course.ts). FAQ: `src/content/faq.ts`. Resources:
   `src/content/resources.ts`.
3. **Payments** — create a [Chapa](https://chapa.co) merchant account, then in `.env`:
   `PAYMENT_PROVIDER=chapa`, `CHAPA_SECRET_KEY`, `CHAPA_WEBHOOK_SECRET`, `CHAPA_CURRENCY`,
   and the ETB amounts. Point the Chapa webhook to `https://yourdomain/api/payment/webhook`.
   Other gateways: implement `PaymentProvider` in `src/lib/payments/` (one small file).
4. **Email** — create a [Resend](https://resend.com) account, verify your domain, set
   `RESEND_API_KEY` and `EMAIL_FROM`.
5. **Security** — set a long random `AUTH_SECRET` and your real `ADMIN_EMAILS`.
6. **Database** — the JSON-file store (`src/lib/db.ts`) is for development and tiny
   deployments on a persistent server. Before real traffic, swap it for Postgres/SQLite —
   all data access goes through that one file, so nothing else changes. Note: serverless
   hosts (Vercel) have no persistent disk; use a real database there.
7. **Legal pages** — review `/terms`, `/privacy`, `/refund-policy`, `/disclaimer` and adjust
   to your actual policies and jurisdiction.

## Architecture

```
src/
  config/site.ts        ← brand, prices, support email (edit me first)
  content/              ← course curriculum, FAQ, resources (your content)
  lib/
    db.ts               ← data store (swap for a real DB here)
    auth.ts             ← magic-link auth + server-side guards
    payments/           ← provider abstraction: chapa.ts, mock.ts
    email.ts            ← transactional email (Resend or console)
    fulfillment.ts      ← paid order → entitlement + email (idempotent)
  components/           ← ui primitives, site chrome, app shell, admin
  app/
    (marketing)/        ← home, course, mentorship, faq, about, contact, legal
    (checkout)/         ← checkout, demo gateway, success, failed
    (auth)/             ← login, verify-email, forgot-access
    (platform)/         ← student: dashboard, modules, lessons, resources, profile
    (vip)/vip/          ← VIP: dashboard, onboarding, booking, sessions, support…
    admin/              ← overview, orders, customers, course, vip, community…
    api/                ← checkout, payments, auth, progress, vip, contact
```

**Authorization model:** visitor → course customer → VIP customer → admin. Entitlements are
stored server-side and re-checked in every protected layout, page, API route, and server
action (`requireUser` / `requireEntitlement` / `requireAdmin` in `src/lib/auth.ts`). VIP
includes course access. Payment success is only ever trusted after server-side verification
with the gateway — never from a return URL alone.

## Scripts

- `npm run dev` — develop
- `npm run build` — production build
- `npm start` — serve the production build
