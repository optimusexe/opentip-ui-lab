"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { CONTRACT_ADDRESS } from "@/lib/constants";
import { formatAmount, formatUsd, relTime, repoTitle, shortAddr } from "@/lib/format";
import { useDemo } from "@/lib/mock/store";
import { cn } from "cn";

const links = [
  ["Overview", "/admin"],
  ["Contract", "/admin/contract"],
  ["Registrar", "/admin/registrar"],
  ["Repos", "/admin/repos"],
  ["Sponsorship", "/admin/sponsorship"],
  ["Tokens", "/admin/tokens"],
  ["Users", "/admin/users"],
  ["Admins", "/admin/admins"],
  ["Migrate", "/admin/migrate"],
  ["Activity", "/admin/activity"],
];

export function AdminFrame({ section }: { section: string }) {
  const pathname = usePathname();
  const repos = useDemo((s) => s.repos);
  const fundings = useDemo((s) => s.fundings);
  const users = useDemo((s) => s.users);
  const txs = useDemo((s) => s.walletTxs);

  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-end">
        <Badge variant="outline">Demo</Badge>
      </div>
      <div className="grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)]">
        <nav className="flex flex-col gap-1" aria-label="Admin">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className={cn("rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted", pathname === href && "bg-muted text-foreground")}>
              {label}
            </Link>
          ))}
        </nav>
        <div>
          {section === "overview" ? <Overview repos={repos.length} fundings={fundings.length} users={users.length} volume={repos.reduce((s, r) => s + r.fundedUsd, 0)} /> : null}
          {section === "contract" ? <Block title="Contract" rows={[["Address", CONTRACT_ADDRESS], ["Fee", "5%"], ["Cap", "10%"], ["Network", "Base"], ["Pause", "Not paused"]]} /> : null}
          {section === "registrar" ? <Block title="Registrar" rows={[["Mode", "GitHub ownership"], ["Reassign", "After verification"], ["Auto-follow GitHub", "No"]]} /> : null}
          {section === "repos" ? (
            <List title="Repos" rows={repos.map((repo) => [repoTitle(repo.repoId), repo.registered ? "Registered" : "Unclaimed", formatUsd(repo.fundedUsd)])} />
          ) : null}
          {section === "sponsorship" ? <Block title="Gas sponsorship" rows={[["Paymaster", "Demo"], ["Sponsored sends today", String(txs.filter((tx) => tx.gasSponsored).length)], ["Status", "Active"]]} /> : null}
          {section === "tokens" ? <Block title="Tokens" rows={[["ETH", "Live"], ["USDC", "Live"], ["OAR", "Coming soon"]]} /> : null}
          {section === "users" ? <List title="Users" rows={users.map((user) => [user.email, user.login ?? "no github", user.onboardingComplete ? "Ready" : "Onboarding"])} /> : null}
          {section === "admins" ? <Block title="Admins" rows={[["vercel", "owner"], ["Added", "Seed"]]} /> : null}
          {section === "migrate" ? <Block title="Migrate" rows={[["Deadline", "Not set"], ["Status", "Idle"], ["Note", "Read-only in this demo"]]} /> : null}
          {section === "activity" ? (
            <List title="Recent funding" rows={fundings.slice(0, 8).map((row) => [repoTitle(row.repoId), formatAmount(row.amount, row.token), relTime(row.timestamp), shortAddr(row.txHash)])} />
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}

function Overview({ repos, fundings, users, volume }: { repos: number; fundings: number; users: number; volume: number }) {
  const cards = [
    ["Funding events", String(fundings)],
    ["Registered + unclaimed", String(repos)],
    ["Users", String(users)],
    ["Volume", formatUsd(volume)],
  ];
  return (
    <div>
      <h1 className="font-display text-3xl">Overview</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-[10px] border border-border p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 font-mono text-2xl tabular-nums">{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Figures include unclaimed repos. USD uses the demo ETH price.</p>
    </div>
  );
}

function Block({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div>
      <h1 className="font-display text-3xl">{title}</h1>
      <dl className="mt-4 flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.join()} className="flex justify-between gap-4 rounded-[10px] border border-border px-4 py-3 text-sm">
            <dt className="text-muted-foreground">{row[0]}</dt>
            <dd className="text-right font-mono text-xs break-all">{row.slice(1).join(" · ")}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function List({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div>
      <h1 className="font-display text-3xl">{title}</h1>
      <ul className="mt-4 flex flex-col gap-2">
        {rows.map((row) => (
          <li key={row.join()} className="flex flex-wrap justify-between gap-2 rounded-[10px] border border-border px-4 py-3 font-mono text-xs">
            {row.map((cell) => <span key={cell}>{cell}</span>)}
          </li>
        ))}
      </ul>
    </div>
  );
}
