"use client";

import { use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { SplitBar } from "@/components/split-bar";
import { CONTRACT_ADDRESS } from "@/lib/constants";
import { formatAmount, formatStamp, repoTitle, shortAddr } from "@/lib/format";
import { useDemo } from "@/lib/mock/store";

export default function ExplorerPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = use(params);
  const decoded = decodeURIComponent(hash);
  const funding = useDemo((s) => s.fundings.find((item) => item.txHash === decoded));
  const claim = useDemo((s) => s.claims.find((item) => item.txHash === decoded));
  const walletTx = useDemo((s) => s.walletTxs.find((item) => item.txHash === decoded));
  const row = funding ?? claim ?? walletTx;

  return (
    <AppShell>
      <h1 className="font-display text-4xl">Transaction</h1>
      {!row ? (
        <p className="mt-6 text-sm text-muted-foreground">No demo transaction uses this hash.</p>
      ) : (
        <div className="mt-6 max-w-xl rounded-[10px] border border-border p-5">
          <Badge variant="outline">Confirmed</Badge>
          <p className="mt-4 font-mono text-xs break-all">{decoded}</p>
          <dl className="mt-4 flex flex-col gap-2 text-sm">
            <Item k="Block" v="21,048,221" />
            <Item k="When" v={formatStamp("timestamp" in row ? row.timestamp : row.createdAt)} />
            {"tipperAddress" in row ? <Item k="From" v={row.tipperAddress} /> : null}
            {"payoutAddress" in row ? <Item k="To" v={row.payoutAddress} /> : null}
            {"walletAddress" in row ? <Item k="Wallet" v={row.walletAddress} /> : null}
            <Item k="Contract" v={CONTRACT_ADDRESS} />
            {"repoId" in row && row.repoId ? (
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Repo</dt>
                <dd><Link className="text-sm font-medium text-brand" href={`/${row.repoId}`}>{repoTitle(row.repoId)}</Link></dd>
              </div>
            ) : null}
            {"amount" in row && row.amount && "token" in row && row.token ? <Item k="Amount" v={formatAmount(row.amount, row.token)} /> : null}
          </dl>
          {funding ? (
            <div className="mt-4">
              <SplitBar />
              <p className="mt-2 text-xs text-muted-foreground">
                Maintainers {formatAmount(funding.amount - funding.feeAmount, funding.token)} · fee {formatAmount(funding.feeAmount, funding.token)}
              </p>
            </div>
          ) : null}
          <p className="mt-4 text-xs text-muted-foreground">Demo record for {shortAddr(decoded)}. Not a Basescan page.</p>
        </div>
      )}
    </AppShell>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="max-w-[70%] truncate text-right font-mono text-xs">{v}</dd>
    </div>
  );
}
