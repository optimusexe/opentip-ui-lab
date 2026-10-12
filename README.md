# Opentip UI lab

A clickable mock of [Opentip](https://opentip.tech) with the Ledger interface. It is a standalone Next.js app. It does not talk to the production app, a wallet, or a network.

Page title: **Opentip | Funding for open source.**

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. No environment variables are required. `npm run build` produces a Vercel-ready build.

## What is fake

All repos, balances, funding, claims, and accounts live in the browser under the localStorage key `opentip-ledger-v2`. Older demo data under `opentip-ledger-v1` is ignored, so the seeded totals load again. Transactions wait about a second, then write a fake hash. ETH is priced at $3,200 so the $1 minimum can be checked. USDC is $1. Any `owner/repo` path opens a funding page, including ones that are not in the seed.

## Personas

Open **Demo** in the header.

| Persona | Who you are | What to try |
|---|---|---|
| Signed-out funder | No account. Wallet starts disconnected. | Connect a wallet on `/vercel/next.js` and fund. Try an amount under $1. |
| Maintainer with a balance | Signed in as `vercel`. | Open `/vercel/next.js` and claim the pending ETH and USDC. `/vercel/turborepo` is not registered yet. |
| Unregistered repo | Signed in as `kofi`, wallet linked. | Open `/kofi/signal-desk`, verify ownership, and register. |
| New user | Signed in as Nova. Onboarding is unfinished. | Walk `/onboarding`. Before a wallet exists, `/nova/starter` asks you to link one. |

Email sign-in also works for `maintainers@vercel.com`, `kofi@dev.example`, and `nova@example.com`. Any password except `wrong` is accepted. Creating an account drops you into the new-user flow. The email code accepts any 6 digits.

## Demo panel

- **Wrong network** makes funding, claiming, registering, and sending ask you to switch to Base.
- **Reject next transaction** fails the next fund, claim, register, send, or wallet creation.
- **Reset demo** restores the seed and clears the persona back to the signed-out funder.

Press `⌘K` (or `Ctrl+K`) to search. The bar strikes through `github.com` and rewrites it as `opentip.tech`.

## Routes

Public: `/`, `/[owner]/[repo]`, `/repos`, `/leaderboard`, `/activity`, `/dev/[login]`, `/signin`, `/forgot-password`, `/reset-password`, `/verify-email`, `/onboarding`, `/dashboard`, `/dashboard/repos`, `/dashboard/github-repos`, `/dashboard/wallets`, `/dashboard/notifications`, `/notifications`, `/wallet`, `/wallet/security`, `/install`, `/docs` and the ten doc pages, `/legal/terms`, `/legal/privacy`, `/receipt/[id]`, `/explorer/[hash]`, and the 404 page.

Admin, read-only: `/admin`, `/admin/contract`, `/admin/registrar`, `/admin/repos`, `/admin/sponsorship`, `/admin/tokens`, `/admin/users`, `/admin/admins`, `/admin/migrate`, `/admin/activity`.
