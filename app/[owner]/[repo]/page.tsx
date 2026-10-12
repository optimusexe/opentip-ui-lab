"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { FundPanel } from "@/components/fund-panel";
import { LedgerTable } from "@/components/ledger-table";
import { NumberTicker } from "@/components/number-ticker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatToken, formatUsd, repoTitle, tokenUsd } from "@/lib/format";
import { placeholderRepo } from "@/lib/mock/placeholder";
import { pendingOf, pendingUsd, useDemo } from "@/lib/mock/store";
import { useSession } from "@/lib/mock/use-session";
import { parseGithubRepo } from "@/lib/parse-repo";
import type { Repo, Token } from "@/lib/mock/types";

export default function RepoPage({ params }: { params: Promise<{ owner: string; repo: string }> }) {
  const { owner, repo } = use(params);
  const repoId = `${decodeURIComponent(owner)}/${decodeURIComponent(repo)}`;
  const repos = useDemo((s) => s.repos);
  const allFundings = useDemo((s) => s.fundings);
  const parsed = parseGithubRepo(repoId);
  const record =
    repos.find((item) => item.repoId.toLowerCase() === repoId.toLowerCase()) ??
    (parsed ? placeholderRepo(parsed.owner, parsed.repo) : undefined);
  const fundings = useMemo(
    () => allFundings.filter((item) => item.repoId.toLowerCase() === repoId.toLowerCase()),
    [allFundings, repoId],
  );
  const state = useDemo();
  const session = useSession();

  if (!record) {
    return (
      <AppShell center={`opentip.tech/${repoId}`}>
        <div className="mx-auto flex max-w-lg flex-col items-start gap-4 py-16">
          <p className="font-display text-4xl">Not a repository.</p>
          <p className="text-muted-foreground">
            {repoId} is not an owner/repo path. Open a page like opentip.tech/vercel/next.js.
          </p>
          <Button render={<Link href="/repos" />}>Browse repos</Button>
        </div>
      </AppShell>
    );
  }

  const pending = pendingUsd(state, record.repoId);
  const supporters = topSupporters(fundings);

  return (
    <AppShell center={`opentip.tech/${record.repoId}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-12 items-center justify-center rounded-[10px] border border-border bg-card font-display text-xl">
            {record.icon}
          </span>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl">{repoTitle(record.repoId)}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{record.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{record.registered ? "Registered" : "Not claimed yet"}</Badge>
              <Badge className="bg-pending/15 text-pending">Demo data</Badge>
              <span className="text-xs text-muted-foreground">{record.language}</span>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            void navigator.clipboard.writeText(`${window.location.origin}/${record.repoId}`);
            toast.success("Funding link copied");
          }}
        >
          Copy funding link
        </Button>
      </div>

      {!record.registered ? (
        <p className="mt-4 rounded-[10px] border border-border bg-muted px-4 py-3 text-sm">
          Not claimed yet. A maintainer can register this page.
        </p>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Total funded" value={record.fundedUsd} format={formatUsd} href="/activity" />
        <Stat label="Funders" value={record.funderCount} format={(n) => Math.round(n).toLocaleString("en-US")} href="/leaderboard" />
        <Stat label="Pending claim" value={pending} format={formatUsd} pending href="/dashboard/repos" />
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="order-2 flex flex-col gap-6 lg:order-1">
          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-sm font-medium">Ledger</h2>
              <p className="text-xs text-muted-foreground">Recent funding · Base</p>
            </div>
            <LedgerTable rows={fundings} />
          </section>
          <Tabs defaultValue="about">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="supporters">Top supporters</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="pt-4">
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{record.summary}</p>
              <ul className="mt-3 flex flex-col gap-1">
                {record.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-brand hover:underline" target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="supporters" className="pt-4">
              {supporters.length === 0 ? (
                <p className="text-sm text-muted-foreground">No supporters yet.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {supporters.map((item) => (
                    <li key={item.name} className="flex items-center justify-between text-sm">
                      <span className="font-mono text-xs">{item.name}</span>
                      <span className="font-mono text-xs tabular-nums">{formatUsd(item.usd)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>
        <div className="order-1 flex flex-col gap-4 lg:order-2">
          <FundPanel repoId={record.repoId} />
          <MaintainerCard repo={record} />
        </div>
      </div>
      <p className="sr-only">Signed in as {session.user?.login ?? "guest"}</p>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  format,
  href,
  pending,
}: {
  label: string;
  value: number;
  format: (n: number) => string;
  href: string;
  pending?: boolean;
}) {
  return (
    <Link href={href} className="rounded-[10px] border border-border bg-card px-4 py-3 transition-colors hover:border-brand/40">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={pending ? "mt-1 text-2xl text-pending" : "mt-1 text-2xl"}>
        <NumberTicker value={value} format={format} />
      </p>
    </Link>
  );
}

function MaintainerCard({ repo }: { repo: Repo }) {
  const router = useRouter();
  const session = useSession();
  const verified = useDemo((s) => (session.user ? (s.verified[session.user.id] ?? []).includes(repo.repoId) : false));
  const verifyRepo = useDemo((s) => s.verifyRepo);
  const registerRepo = useDemo((s) => s.registerRepo);
  const claim = useDemo((s) => s.claim);
  const flags = useDemo((s) => s.flags);
  const switchToBase = useDemo((s) => s.switchToBase);
  const state = useDemo();
  const [checking, setChecking] = useState(false);
  const [notOwner, setNotOwner] = useState(false);
  const [busy, setBusy] = useState<"register" | "claim" | null>(null);
  const [payout, setPayout] = useState(session.primary?.address ?? "");

  const isOwner = Boolean(session.user?.login && session.user.login === repo.owner);
  const tokens = (["USDC", "ETH"] as Token[]).filter((token) => pendingOf(state, repo.repoId, token) > 0);

  async function onVerify() {
    if (!session.user) return;
    setChecking(true);
    setNotOwner(false);
    await wait(700);
    setChecking(false);
    if (!isOwner) {
      setNotOwner(true);
      return;
    }
    if (session.linked.length === 0) return;
    verifyRepo(session.user.id, repo.repoId);
    toast.success("Ownership verified");
  }

  async function onRegister() {
    if (!session.address || !payout) return;
    if (session.wrongNetwork) return;
    if (flags.rejectTx) {
      setBusy("register");
      await wait(800);
      setBusy(null);
      toast.error("Transaction rejected");
      return;
    }
    setBusy("register");
    await wait(1400);
    const hash = registerRepo({ repoId: repo.repoId, payoutAddress: payout, from: session.address });
    setBusy(null);
    toast.success("Registered");
    router.push(`/explorer/${hash}`);
  }

  async function onClaim() {
    if (!session.address) return;
    if (session.wrongNetwork) return;
    if (flags.rejectTx) {
      setBusy("claim");
      await wait(800);
      setBusy(null);
      toast.error("Transaction rejected");
      return;
    }
    setBusy("claim");
    await wait(1500);
    const receipts = claim({ repoId: repo.repoId, from: session.address, tokens });
    setBusy(null);
    if (receipts[0]) router.push(`/receipt/${receipts[0].id}`);
  }

  return (
    <section className="rounded-[10px] border border-border p-4">
      <h2 className="text-sm font-medium">Maintainer</h2>
      {!session.signedIn ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to verify ownership, register, or claim.{" "}
          <Link href="/signin" className="text-brand">Sign in</Link>
        </p>
      ) : null}
      {session.signedIn && !repo.registered && !isOwner && !notOwner ? (
        <div className="mt-3 flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Verify GitHub ownership before this page can be registered.</p>
          <Button disabled={checking} onClick={() => void onVerify()}>
            {checking ? <Loader2Icon className="animate-spin" data-icon="inline-start" /> : null}
            Verify ownership
          </Button>
        </div>
      ) : null}
      {notOwner ? <p className="mt-3 text-sm text-destructive">You are not the owner of this repository.</p> : null}
      {session.signedIn && isOwner && !repo.registered && session.linked.length === 0 ? (
        <div className="mt-3 flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Link a wallet first. Registration needs a payout address.</p>
          <Button render={<Link href="/onboarding" />}>Link a wallet</Button>
        </div>
      ) : null}
      {session.signedIn && isOwner && !repo.registered && session.linked.length > 0 && !verified ? (
        <Button className="mt-3" disabled={checking} onClick={() => void onVerify()}>
          {checking ? <Loader2Icon className="animate-spin" data-icon="inline-start" /> : null}
          Verify ownership
        </Button>
      ) : null}
      {session.signedIn && isOwner && !repo.registered && verified ? (
        <div className="mt-3 flex flex-col gap-2">
          <label className="text-xs text-muted-foreground" htmlFor="payout">Payout wallet</label>
          <select
            id="payout"
            value={payout}
            onChange={(event) => setPayout(event.target.value)}
            className="h-9 rounded-[10px] border border-border bg-background px-2 font-mono text-xs"
          >
            {session.linked.map((wallet) => (
              <option key={wallet.id} value={wallet.address}>
                {wallet.walletType} · {wallet.address.slice(0, 8)}
              </option>
            ))}
          </select>
          {session.wrongNetwork ? (
            <Button onClick={switchToBase}>Switch to Base</Button>
          ) : (
            <Button disabled={busy === "register"} onClick={() => void onRegister()}>
              {busy === "register" ? "Registering" : "Register"}
            </Button>
          )}
        </div>
      ) : null}
      {session.signedIn && isOwner && repo.registered ? (
        <div className="mt-3 flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">Pending balance</p>
          {(["USDC", "ETH"] as Token[]).map((token) => {
            const amount = pendingOf(state, repo.repoId, token);
            return (
              <div key={token} className="flex items-center justify-between text-sm">
                <span>{token}</span>
                <span className="font-mono text-xs tabular-nums">
                  {formatToken(amount, token)} · {formatUsd(tokenUsd(amount, token))}
                </span>
              </div>
            );
          })}
          {session.wrongNetwork ? (
            <Button onClick={switchToBase}>Switch to Base</Button>
          ) : (
            <Button disabled={tokens.length === 0 || busy === "claim"} onClick={() => void onClaim()}>
              {busy === "claim" ? "Claiming" : tokens.length ? "Claim all" : "Nothing to claim"}
            </Button>
          )}
        </div>
      ) : null}
      {session.signedIn && !isOwner && repo.registered && !notOwner ? (
        <div className="mt-3">
          <Button variant="outline" disabled={checking} onClick={() => void onVerify()}>
            Verify ownership
          </Button>
        </div>
      ) : null}
    </section>
  );
}

function topSupporters(rows: { tipperAddress: string; displayName?: string; amount: number; token: Token }[]) {
  const map = new Map<string, { name: string; usd: number }>();
  for (const row of rows) {
    const key = row.tipperAddress;
    const current = map.get(key) ?? { name: row.displayName ?? `${row.tipperAddress.slice(0, 6)}…${row.tipperAddress.slice(-4)}`, usd: 0 };
    current.usd += tokenUsd(row.amount, row.token);
    if (row.displayName) current.name = row.displayName;
    map.set(key, current);
  }
  return Array.from(map.values()).sort((a, b) => b.usd - a.usd).slice(0, 5);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
