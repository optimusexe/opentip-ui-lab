"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { formatToken, formatUsd, repoTitle, tokenUsd } from "@/lib/format";
import { pendingOf, pendingUsd, useDemo } from "@/lib/mock/store";
import { useSession } from "@/lib/mock/use-session";
import type { Token } from "@/lib/mock/types";

export default function DashboardReposPage() {
  const session = useSession();
  const router = useRouter();
  const login = session.user?.login;
  const allRepos = useDemo((s) => s.repos);
  const repos = useMemo(
    () => allRepos.filter((repo) => repo.owner === login && repo.registered),
    [allRepos, login],
  );
  const state = useDemo();
  const hideRepo = useDemo((s) => s.hideRepo);
  const claim = useDemo((s) => s.claim);
  const [busy, setBusy] = useState<string | null>(null);

  if (!session.user) return null;

  return (
    <div>
      <h1 className="font-display text-4xl">Your repos</h1>
      <p className="mt-2 text-sm text-muted-foreground">Claim a pending balance whenever you want.</p>
      {repos.length === 0 ? (
        <div className="mt-6 rounded-[10px] border border-dashed border-border px-4 py-10 text-center">
          <p className="font-medium">No registered repos</p>
          <Button className="mt-3" render={<Link href="/dashboard/github-repos" />}>Register from GitHub</Button>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {repos.map((repo) => {
            const tokens = (["USDC", "ETH"] as Token[]).map((token) => ({ token, amount: pendingOf(state, repo.repoId, token) }));
            return (
              <li key={repo.repoId} className="rounded-[10px] border border-border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link href={`/${repo.repoId}`} className="text-sm font-medium hover:text-brand">{repoTitle(repo.repoId)}</Link>
                    <p className="mt-1 font-mono text-lg tabular-nums">{formatUsd(pendingUsd(state, repo.repoId))} pending</p>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    Hidden
                    <Switch checked={repo.hidden} onCheckedChange={(checked) => hideRepo(repo.repoId, checked)} />
                  </label>
                </div>
                <ul className="mt-3 flex flex-col gap-1 text-sm">
                  {tokens.map((row) => (
                    <li key={row.token} className="flex justify-between">
                      <span>{row.token}</span>
                      <span className="font-mono text-xs">{formatToken(row.amount, row.token)} · {formatUsd(tokenUsd(row.amount, row.token))}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 font-mono text-[11px] text-muted-foreground">Payout {repo.payoutAddress}</p>
                <Button
                  className="mt-3"
                  disabled={busy === repo.repoId || tokens.every((row) => row.amount <= 0) || !session.address}
                  onClick={() => {
                    if (!session.address) return;
                    setBusy(repo.repoId);
                    window.setTimeout(() => {
                      const receipts = claim({
                        repoId: repo.repoId,
                        from: session.address!,
                        tokens: tokens.filter((row) => row.amount > 0).map((row) => row.token),
                      });
                      setBusy(null);
                      toast.success("Claimed");
                      if (receipts[0]) router.push(`/receipt/${receipts[0].id}`);
                    }, 1200);
                  }}
                >
                  {busy === repo.repoId ? "Claiming" : "Claim"}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
