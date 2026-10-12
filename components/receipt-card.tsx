import Link from "next/link";
import { formatAmount, formatStamp, repoTitle, shortAddr } from "@/lib/format";
import type { Receipt } from "@/lib/mock/types";

export function ReceiptCard({ receipt }: { receipt: Receipt }) {
  const rows = [
    ["Maintainers · 95%", formatAmount(receipt.maintainerAmount, receipt.token)],
    ["Platform fee · 5%", formatAmount(receipt.feeAmount, receipt.token)],
    ["Network", "Base"],
    ["From", shortAddr(receipt.from)],
    ["Tx", shortAddr(receipt.txHash)],
    ["Time", formatStamp(receipt.timestamp)],
  ] as const;

  return (
    <article className="mx-auto w-full max-w-md">
      <div className="rounded-t-[10px] border border-b-0 border-border bg-card px-5 pt-5 pb-4">
        <div className="flex items-center justify-between text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
          <span>Receipt</span>
          <span className="font-mono tracking-normal">#{receipt.number}</span>
        </div>
        <div className="mt-4 flex items-end gap-3">
          <p className="font-mono text-5xl leading-none tracking-tight tabular-nums">
            {formatAmount(receipt.kind === "claim" ? receipt.maintainerAmount : receipt.amount, receipt.token).replace(
              ` ${receipt.token}`,
              "",
            )}
          </p>
          <p className="pb-1 text-sm text-muted-foreground">{receipt.token}</p>
        </div>
        <p className="mt-3 text-sm">
          <span className="text-muted-foreground">{receipt.kind === "claim" ? "Claimed from" : "→"} </span>
          <Link href={`/${receipt.repoId}`} className="font-medium hover:text-brand">
            {repoTitle(receipt.repoId)}
          </Link>
        </p>
      </div>
      <div className="relative border-x border-dashed border-border bg-card">
        <span className="absolute top-0 -left-3 size-6 -translate-y-1/2 rounded-full border border-border bg-background" />
        <span className="absolute top-0 -right-3 size-6 -translate-y-1/2 rounded-full border border-border bg-background" />
      </div>
      <div className="border-x border-border bg-card px-5 py-4">
        <dl className="flex flex-col gap-2.5 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-mono text-[13px] tabular-nums">
                {label === "Tx" ? (
                  <Link href={`/explorer/${receipt.txHash}`} className="text-brand hover:underline">
                    {value} ↗
                  </Link>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="receipt-scallop h-3 border-x border-border" />
    </article>
  );
}
