"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatAmount, formatUsd, relTime, shortAddr, tokenUsd } from "@/lib/format";
import { useDemo } from "@/lib/mock/store";
import { useSession } from "@/lib/mock/use-session";
import type { Token } from "@/lib/mock/types";

export default function WalletPage() {
  const session = useSession();
  const connect = useDemo((s) => s.connectWallet);
  const send = useDemo((s) => s.sendFromWallet);
  const walletTxs = useDemo((s) => s.walletTxs);
  const txs = useMemo(
    () => walletTxs.filter((tx) => session.address && tx.walletAddress.toLowerCase() === session.address.toLowerCase()),
    [walletTxs, session.address],
  );
  const policy = useDemo((s) => (session.user ? s.policies[session.user.id] : null));
  const flags = useDemo((s) => s.flags);
  const [token, setToken] = useState<Token>("USDC");
  const [amount, setAmount] = useState("10");
  const [to, setTo] = useState("0x000000000000000000000000000000000000dEaD");
  const [review, setReview] = useState(false);
  const [phase, setPhase] = useState<"idle" | "pending" | "done" | "rejected">("idle");
  const [hash, setHash] = useState<string | null>(null);

  const numeric = Number(amount);
  const usd = Number.isFinite(numeric) ? tokenUsd(numeric, token) : 0;

  function policyError() {
    if (!policy) return null;
    if (policy.pauseAll) return "Spending is paused.";
    if (policy.perTxLimitEnabled && usd > policy.perTxLimitUsd) return `Above the per-transaction limit of $${policy.perTxLimitUsd}.`;
    if (policy.dailyLimitEnabled && usd > policy.dailyLimitUsd) return `Above the daily limit of $${policy.dailyLimitUsd}.`;
    if (policy.permittedRecipientsEnabled && !policy.permittedRecipients.some((item) => item.toLowerCase() === to.toLowerCase())) {
      return "Recipient is not on the permitted list.";
    }
    return null;
  }

  async function confirm() {
    if (!session.address) return;
    const blocked = policyError();
    if (blocked) {
      toast.error(blocked);
      return;
    }
    if ((session.balance[token] ?? 0) < numeric) {
      toast.error("Insufficient balance");
      return;
    }
    setPhase("pending");
    await wait(1400);
    if (flags.rejectTx) {
      setPhase("rejected");
      toast.error("Transaction rejected");
      return;
    }
    const result = send({ from: session.address, to, token, amount: numeric, sponsored: session.sponsored });
    setHash(result.txHash);
    setPhase("done");
    setReview(false);
    toast.success("Sent");
  }

  return (
    <AppShell>
      <h1 className="font-display text-4xl">Smart wallet</h1>
      {!session.walletConnected ? (
        <div className="mt-6 max-w-md rounded-[10px] border border-dashed border-border p-6">
          <p className="font-medium">No wallet connected</p>
          <p className="mt-1 text-sm text-muted-foreground">Connect a demo wallet to see a balance, send, and history.</p>
          <Button className="mt-4" onClick={() => { connect(); toast.success("Wallet connected"); }}>Connect wallet</Button>
        </div>
      ) : (
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <section className="rounded-[10px] border border-border bg-foreground p-5 text-background">
            <div className="flex items-center justify-between text-xs text-background/70">
              <span>Opentip Smart Wallet</span>
              <span className="rounded-full bg-background/10 px-2 py-0.5">{session.sponsored ? "Gas sponsored" : "You pay gas"}</span>
            </div>
            <p className="mt-6 font-mono text-xs text-background/70">{session.address}</p>
            <p className="mt-3 font-mono text-4xl tabular-nums">{formatUsd(tokenUsd(session.balance.USDC, "USDC") + tokenUsd(session.balance.ETH, "ETH"))}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-background/60">ETH</p>
                <p className="font-mono">{session.balance.ETH.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-background/60">USDC</p>
                <p className="font-mono">{session.balance.USDC.toFixed(2)}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-background/60">Base · demo balances only</p>
          </section>
          <section className="rounded-[10px] border border-border p-4">
            <h2 className="text-sm font-medium">Send</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["USDC", "ETH"] as Token[]).map((item) => (
                <Button key={item} variant={token === item ? "default" : "outline"} onClick={() => setToken(item)}>{item}</Button>
              ))}
            </div>
            <Input className="mt-3 h-10 font-mono" value={amount} onChange={(event) => setAmount(event.target.value)} aria-label="Amount" />
            <Input className="mt-2 h-10 font-mono text-xs" value={to} onChange={(event) => setTo(event.target.value)} aria-label="Recipient" />
            <p className="mt-2 text-xs text-muted-foreground">≈ {formatUsd(usd)} · {session.sponsored ? "Gas sponsored" : "Estimated gas $0.02"}</p>
            {policyError() ? <p className="mt-2 text-sm text-destructive">{policyError()}</p> : null}
            <Button className="mt-3" onClick={() => setReview(true)} disabled={!Number.isFinite(numeric) || numeric <= 0}>Review</Button>
            {phase === "rejected" ? <p className="mt-2 text-sm text-destructive">Transaction rejected.</p> : null}
            {phase === "done" && hash ? (
              <p className="mt-2 text-sm">Sent. <Link className="text-brand" href={`/explorer/${hash}`}>{shortAddr(hash)}</Link></p>
            ) : null}
            <h3 className="mt-6 text-sm font-medium">History</h3>
            {txs.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">No transactions yet.</p> : (
              <ul className="mt-2 flex flex-col gap-2">
                {txs.map((tx) => (
                  <li key={tx.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="capitalize">{tx.kind}{tx.repoId ? ` · ${tx.repoId}` : ""}</span>
                    <span className="font-mono text-xs">{tx.amount ? formatAmount(tx.amount, tx.token ?? "USDC") : tx.status}</span>
                    <span className="text-xs text-muted-foreground">{relTime(tx.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
      <Dialog open={review} onOpenChange={setReview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review send</DialogTitle>
            <DialogDescription>This stays inside the demo. Nothing is broadcast.</DialogDescription>
          </DialogHeader>
          <dl className="flex flex-col gap-2 text-sm">
            <Row k="Amount" v={formatAmount(numeric || 0, token)} />
            <Row k="To" v={shortAddr(to)} />
            <Row k="Gas" v={session.sponsored ? "Sponsored" : "$0.02"} />
          </dl>
          <DialogFooter>
            <Button disabled={phase === "pending"} onClick={() => void confirm()}>{phase === "pending" ? "Sending" : "Confirm"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-mono text-xs">{v}</dd>
    </div>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
