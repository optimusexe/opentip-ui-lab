"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatUsd, repoTitle, shortAddr, tokenUsd } from "@/lib/format";
import { useDemo } from "@/lib/mock/store";

export default function LeaderboardPage() {
  const allRepos = useDemo((s) => s.repos);
  const repos = useMemo(
    () => allRepos.filter((repo) => repo.registered && !repo.hidden).sort((a, b) => b.fundedUsd - a.fundedUsd),
    [allRepos],
  );
  const fundings = useDemo((s) => s.fundings);
  const names = useDemo((s) => s.displayNames);
  const supporters = new Map<string, number>();
  for (const row of fundings) {
    supporters.set(row.tipperAddress, (supporters.get(row.tipperAddress) ?? 0) + tokenUsd(row.amount, row.token));
  }
  const people = Array.from(supporters.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <AppShell>
      <h1 className="font-display text-4xl">Leaderboard</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">Public totals from this demo ledger. Ranks follow funded volume.</p>
      <Tabs defaultValue="repos" className="mt-6">
        <TabsList>
          <TabsTrigger value="repos">Repos</TabsTrigger>
          <TabsTrigger value="funders">Funders</TabsTrigger>
        </TabsList>
        <TabsContent value="repos" className="pt-4">
          {repos.length === 0 ? <Empty /> : (
            <ol className="flex flex-col gap-2">
              {repos.map((repo, index) => (
                <li key={repo.repoId}>
                  <Link href={`/${repo.repoId}`} className="flex items-center gap-3 rounded-[10px] border border-border px-4 py-3 hover:bg-muted/50">
                    <span className="w-6 font-mono text-sm text-brand">{index + 1}</span>
                    <span className="flex-1 text-sm font-medium">{repoTitle(repo.repoId)}</span>
                    <span className="text-xs text-muted-foreground">{repo.funderCount} funders</span>
                    <span className="font-mono text-sm tabular-nums">{formatUsd(repo.fundedUsd)}</span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </TabsContent>
        <TabsContent value="funders" className="pt-4">
          {people.length === 0 ? <Empty /> : (
            <ol className="flex flex-col gap-2">
              {people.map(([address, usd], index) => (
                <li key={address} className="flex items-center gap-3 rounded-[10px] border border-border px-4 py-3">
                  <span className="w-6 font-mono text-sm text-brand">{index + 1}</span>
                  <span className="flex-1 font-mono text-sm">{names[address] ?? shortAddr(address)}</span>
                  <span className="font-mono text-sm tabular-nums">{formatUsd(usd)}</span>
                </li>
              ))}
            </ol>
          )}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function Empty() {
  return <p className="rounded-[10px] border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">Nothing on the board yet.</p>;
}
