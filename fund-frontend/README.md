# Fund Management System — Frontend

Next.js (Pages Router, JavaScript) + Tailwind CSS frontend for the FastAPI Fund
Management backend. Mobile-first, banking-style UI, zero business logic —
every financial value shown is exactly what the backend returned.

## 1. Project Setup

```bash
# 1. Install dependencies
cd fund-frontend
npm install

# 2. Configure the backend URL
cp .env.local.example .env.local
# edit .env.local:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# 3. Run the backend (separately, from your FastAPI project)
#    uvicorn app.main:app --reload --port 8000

# 4. Run the frontend
npm run dev
# open http://localhost:3000
```

Production build:
```bash
npm run build
npm start
```

## 2. How requests reach the backend (and why CORS isn't an issue)

The backend has **no CORS middleware configured**. Rather than requiring a
backend change, the frontend calls a relative path, `/api/*`, which
`next.config.js` rewrites *server-side* to `NEXT_PUBLIC_API_BASE_URL`. The
browser only ever talks to the Next.js server, so no CORS headers are needed.
If you deploy frontend and backend separately (e.g. Vercel + Render), just set
`NEXT_PUBLIC_API_BASE_URL` to the backend's public URL — the rewrite still
works because it happens on the Next.js server, not in the browser.

If you'd rather call the FastAPI backend directly from the browser instead,
add `fastapi.middleware.cors.CORSMiddleware` to the backend and change
`lib/api.js`'s `API_PREFIX` to the full backend URL.

## 3. Folder Structure

```
fund-frontend/
├── pages/
│   ├── login.js, register.js
│   ├── funds/
│   │   ├── index.js                    # select / create fund
│   │   └── [fundId]/
│   │       ├── dashboard.js            # admin+ only
│   │       ├── ledger.js               # everyone
│   │       ├── members.js              # super admin only
│   │       ├── members/[memberId].js   # member profile
│   │       ├── loans.js, loans/[loanId].js
│   │       ├── payments.js
│   │       ├── fines.js
│   │       ├── expenses.js
│   │       ├── activity-logs.js
│   │       └── reports.js
├── components/
│   ├── layout/     # AppShell, Sidebar, BottomNav, Topbar, FloatingQuickActions
│   ├── ui/          # Card, Button, Input, Modal, ConfirmDialog, Table, Badge, EmptyState, Skeleton
│   └── forms/       # one form per financial mutation
├── services/        # one file per backend router — the ONLY place fetch() is used indirectly
├── lib/api.js        # centralized fetch wrapper, JWT attachment, error normalization
├── lib/formatters.js  # currency/date display helpers (no calculation)
├── contexts/         # AuthContext, FundContext
└── styles/globals.css
```

Every service function has the exact backend route and payload shape in a
comment above it — check `services/*.js` first when wiring up a new page.

## 4. Design

Banking/ledger aesthetic: navy (`ledger-navy`) as the primary action color,
neutral slate/grey surfaces, monospace (`IBM Plex Mono`) for all money
figures, `Sora` for headings, `Inter` for body text. No emojis, no bright
gradients, no decorative animation.

## 5. Known gaps in the existing backend

These were found while wiring the frontend to the real API contract. Per the
handshake rules, the frontend does **not** invent logic to paper over them —
each is either worked around visibly or left as a TODO for the backend team.

1. **No "who am I in this fund" endpoint.** `GET /funds/{fund_id}/members`
   (the only endpoint that returns roles) is Super-Admin-only, so a plain
   Member or Admin has no API to learn their own role after opening a fund.
   **Workaround implemented:** `contexts/FundContext.js` probes
   `GET /funds/{fund_id}/members` then `GET /funds/{fund_id}/dashboard` and
   infers the role from which one succeeds (200) vs is refused (403). This
   works, but costs 1–2 extra requests per fund switch.
   **Recommended fix:** add `GET /funds/{fund_id}/members/me` returning the
   caller's own `FundMemberResponse`.

2. **Member records don't include name/phone.** `FundMemberResponse` only
   has `user_id`, `role`, `contribution_paid`, `status` — no name or phone.
   Admin-facing screens (Create Loan's member picker, Members table, Member
   Profile) currently display the raw `user_id`. The Public Ledger is fine
   because `PublicLedgerService` separately joins in `member_name` /
   `phone_number`.
   **Recommended fix:** either embed `name`/`phone` in `FundMemberResponse`,
   or add a small `GET /users/{user_id}` lookup endpoint.

3. **"Contribution Received?" toggle from the spec isn't wired to the API.**
   The spec's Add Member flow asks *Contribution Received? Yes/No* and, if
   Yes, should create a contribution transaction. The implemented
   `AddMemberRequest` only accepts `user_id` — `contribution_paid` is
   hardcoded to `False` in the route, so there's no request field to pass
   "yes, contribution received." The Add Member form currently always adds
   without a contribution transaction, matching what the backend actually
   does.
   **Recommended fix:** add a `contribution_received: bool` field to
   `AddMemberRequest` and use it to conditionally create the contribution
   transaction server-side.

4. **Member self-service (spec section "Member can View Own Loan / Payments
   / Fines") has no backend route.** `loans`, `payments`, `fines`, and
   `members` routers are all gated with `require_admin`/`require_super_admin`.
   A plain Member's only accessible fund-scoped data today is the Public
   Ledger and the fund's balance — both already wired up. No "My Loan" / "My
   Payments" / "My Fines" pages were built because there is nothing for them
   to call.
   **Recommended fix:** add member-scoped read endpoints (e.g.
   `GET /funds/{fund_id}/loans/me`) that resolve the loan/payments/fines for
   `current_user["id"]` without requiring admin rights.

None of these block using the app as an Admin/Super Admin — they only affect
how much a plain Member can see about themselves, and how member names are
displayed.
