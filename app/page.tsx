"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { NumberTicker } from "@/components/number-ticker";
import { SplitBar } from "@/components/split-bar";
import { UrlSwap } from "@/components/url-swap";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CONTRACT_ADDRESS } from "@/lib/constants";
import { formatAmount, formatUsd, relTime, repoTitle, shortAddr } from "@/lib/format";
import { useDemo } from "@/lib/mock/store";

const steps = [
  ["01", "Swap one word in the URL.", "Replace github.com with opentip.tech on any repo link to open its funding page."],
  ["02", "Fund it in a supported token.", "Connect a wallet, choose an amount in ETH or USDC, and confirm. No account required. OAR is coming soon."],
  ["03", "Maintainers claim on their schedule.", "Funds are held by the contract and belong to the maintainer the moment they land. They withdraw whenever they choose."],
];

const trust = [
  ["01", "Non-custodial by design.", "Funds go to a public smart contract, never to an Opentip account. Only the registered payout wallet can withdraw a maintainer’s balance."],
  ["02", "ETH and USDC today.", "Accept ETH or USDC with no extra setup. OAR is coming soon."],
  ["03", "Fully verifiable.", "Every contribution, claim, and fee is recorded on Base and can be opened in this demo’s explorer."],
  ["04", "Transparent pricing.", "A flat 5% platform fee, capped at 10%. Maintainers receive 95% of every contribution."],
];

const faqs = [
  ["Do I need an account to fund a repo?", "No. Connect a wallet, choose ETH or USDC, and confirm. Funding does not require an Opentip account."],
  ["If I send ETH, does the maintainer receive ETH?", "Yes. A contribution stays in the token you send. ETH is claimable as ETH, and USDC as USDC."],
  ["What chain does this run on?", "Base. Contributions, claims, and fees are on Base and visible on the public record."],
  ["Can anyone claim any repo’s funds?", "No. Claiming requires the payout wallet registered for that repo. Registration happens after a maintainer signs in with GitHub and Opentip verifies ownership or maintainer access."],
  ["Has the contract been audited?", "The contract is public and verifiable. Read the source and the on-chain record before you send funds."],
  ["What happens if a repo changes owner?", "The payout address does not follow GitHub on its own. The registered wallet can update it, and Opentip can reassign it after the new maintainer verifies access. Funds stay in the contract until they are claimed."],
  ["Isn’t the contract centralized?", "Funds are held by the contract, not by Opentip. An owner key can pause funding, registrations, payout-address updates, and claims; set the fee to any rate up to a hard 10% cap; and reassign a payout address. It cannot withdraw a maintainer’s pending balance — only the current payout address can claim it. The owner can withdraw the separate fee balance. Those actions are public."],
];

export default function HomePage() {
  const repos = useDemo((s) => s.repos);
  const fundings = useDemo((s) => s.fundings);
  const repo = repos.find((item) => item.repoId === "vercel/next.js");
  const rows = useMemo(() => fundings.filter((item) => item.repoId === "vercel/next.js").slice(0, 4), [fundings]);

  return (
    <AppShell>
      <section className="grid min-w-0 items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        <div className="flex min-w-0 flex-col gap-6 pt-2">
          <h1 className="font-display text-[2.7rem] leading-[0.92] text-balance sm:text-6xl lg:text-[4.4rem]">
            Funding for open source, from the <span className="text-brand">open market.</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Turn any GitHub repo into a funding page. Fund maintainers in ETH or USDC, no account needed. Maintainers claim whenever they want.
          </p>
          <UrlSwap />
          <p className="text-sm text-muted-foreground">Swap one word in any repo link. Paste owner/repo or a full GitHub URL.</p>
        </div>
        <aside className="rise rounded-[10px] border border-border bg-card p-4 shadow-[0_18px_50px_-32px_rgba(11,13,12,0.45)] sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{repo ? repoTitle(repo.repoId) : "Next.js"}</p>
            <Badge className="bg-pending/15 text-pending">Demo data</Badge>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">Total funded</p>
          <p className="mt-1 text-4xl tracking-tight">
            <NumberTicker value={repo?.fundedUsd ?? 0} format={(n) => formatUsd(n)} />
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <SplitBar />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>95% maintainers</span>
              <span>5% fee</span>
            </div>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {rows.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="truncate font-mono text-xs text-muted-foreground">
                  {row.displayName ?? shortAddr(row.tipperAddress)}
                </span>
                <span className="font-mono text-xs text-brand tabular-nums">
                  +{formatAmount(row.amount, row.token)}
                </span>
                <span className="w-8 text-right text-xs text-muted-foreground">{relTime(row.timestamp)}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="mt-8 grid overflow-hidden rounded-[10px] border border-border sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["95%", "to maintainers"],
          ["5%", "flat fee, 10% hard cap"],
          ["$1", "minimum per contribution"],
          ["0 accounts", "needed to fund"],
        ].map(([value, label]) => (
          <div key={label} className="border-border px-5 py-5 not-last:border-b sm:not-last:border-b lg:border-b-0 lg:not-last:border-r">
            <p className="font-mono text-2xl tabular-nums">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      <section className="mt-20 grid gap-10 lg:grid-cols-3">
        {steps.map(([n, title, body]) => (
          <article key={n} className="flex flex-col gap-2">
            <p className="font-mono text-sm text-brand">{n}</p>
            <h2 className="text-lg font-medium">{title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
          </article>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl sm:text-4xl">Built for trust</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {trust.map(([n, title, body]) => (
            <article key={n} className="rounded-[10px] border border-border p-4">
              <p className="font-mono text-xs text-muted-foreground">{n}</p>
              <h3 className="mt-2 font-medium">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              {n === "03" ? <p className="mt-3 font-mono text-xs break-all">{CONTRACT_ADDRESS}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 grid items-center gap-6 rounded-[10px] border border-border p-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl">Turn your repo into a funding channel</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Sign in with GitHub, verify ownership or maintainer access, and link a wallet. Setup takes about a minute. Your repo is then fundable at opentip.tech/owner/repo.
          </p>
          <Button className="mt-5 h-10 rounded-full px-4" render={<Link href="/onboarding" />}>
            Register a repo
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
        <aside className="rounded-[10px] bg-muted p-5">
          <p className="font-mono text-sm">
            <span className="text-brand">opentip.tech/</span>owner/repo
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Anyone can fund the page. You claim the balance whenever you choose.</p>
        </aside>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl">FAQ</h2>
        <Accordion defaultValue={["account"]} className="mt-4">
          {faqs.map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className="text-base">{q}</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </AppShell>
  );
}
