"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SplitBar } from "@/components/split-bar";
import { formatAmount, relTime, shortAddr } from "@/lib/format";
import { useDemo } from "@/lib/mock/store";

export default function ActivityPage() {
  const allFundings = useDemo((s) => s.fundings);
  const fundings = useMemo(() => [...allFundings].sort((a, b) => b.timestamp - a.timestamp), [allFundings]);
  const claims = useDemo((s) => s.claims);

  return (
    <AppShell>
      <h1 className="font-display text-4xl">Activity</h1>
      <p className="mt-2 text-sm text-muted-foreground">A live feed of funding and claims in this demo.</p>
      {fundings.length === 0 && claims.length === 0 ? (
        <p className="mt-8 rounded-[10px] border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">No funding yet.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {fundings.map((row) => (
            <li key={row.id} className="rounded-[10px] border border-border px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm">
                  <span className="font-mono text-xs">{row.displayName ?? shortAddr(row.tipperAddress)}</span>
                  {" funded "}
                  <Link href={`/${row.repoId}`} className="font-mono text-xs text-brand">{row.repoId}</Link>
                </p>
                <span className="font-mono text-xs text-brand tabular-nums">+{formatAmount(row.amount, row.token)}</span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <SplitBar className="max-w-40" />
                <Link href={`/explorer/${row.txHash}`} className="font-mono text-[11px] text-muted-foreground hover:text-brand">
                  {shortAddr(row.txHash)}
                </Link>
                <span className="ml-auto text-xs text-muted-foreground">{relTime(row.timestamp)}</span>
              </div>
            </li>
          ))}
          {claims.map((row) => (
            <li key={row.id} className="rounded-[10px] border border-border px-4 py-3 text-sm">
              <span className="font-mono text-xs">{shortAddr(row.payoutAddress)}</span> claimed {formatAmount(row.amount, row.token)} from{" "}
              <Link href={`/${row.repoId}`} className="font-mono text-xs text-brand">{row.repoId}</Link>
              <span className="ml-2 text-xs text-muted-foreground">{relTime(row.timestamp)}</span>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
