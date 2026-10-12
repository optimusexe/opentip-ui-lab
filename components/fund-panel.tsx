"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SplitBar } from "@/components/split-bar";
import { formatAmount, formatToken, minError, splitAmount, tokenUsd } from "@/lib/format";
import { cn } from "cn";
import { useDemo } from "@/lib/mock/store";
import { useSession } from "@/lib/mock/use-session";
import type { Token } from "@/lib/mock/types";

const presets: Record<Token, number[]> = {
  USDC: [5, 10, 25, 100],
  ETH: [0.005, 0.01, 0.05, 0.1],
};

export function FundPanel({ repoId }: { repoId: string }) {
  const router = useRouter();
  const session = useSession();
  const fund = useDemo((s) => s.fund);
  const connectWallet = useDemo((s) => s.connectWallet);
  const switchToBase = useDemo((s) => s.switchToBase);
  const flags = useDemo((s) => s.flags);
  const balance = session.balance;
  const [token, setToken] = useState<Token>("USDC");
  const [amount, setAmount] = useState("25");
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<"idle" | "approving" | "sending" | "rejected">("idle");
  const [error, setError] = useState<string | null>(null);

  const numeric = Number(amount);
  const split = Number.isFinite(numeric) && numeric > 0 ? splitAmount(numeric) : { fee: 0, maintainer: 0 };
  const busy = phase === "approving" || phase === "sending";

  async function onFund() {
    setError(null);
    if (!session.walletConnected || !session.address) {
      connectWallet();
      toast.success("Wallet connected");
      return;
    }
    if (session.wrongNetwork) return;
    const message = minError(numeric, token);
    if (message) {
      setError(message);
      return;
    }
    if ((balance[token] ?? 0) < numeric) {
      setError("Insufficient balance in this demo wallet.");
      return;
    }
    if (flags.rejectTx) {
      setPhase("sending");
      await wait(800);
      setPhase("rejected");
      toast.error("Transaction rejected");
      return;
    }
    if (token === "USDC") {
      setPhase("approving");
      await wait(1200);
      if (useDemo.getState().flags.rejectTx) {
        setPhase("rejected");
        toast.error("Transaction rejected");
        return;
      }
    }
    setPhase("sending");
    await wait(1500);
    if (useDemo.getState().flags.rejectTx) {
      setPhase("rejected");
      toast.error("Transaction rejected");
      return;
    }
    const receipt = fund({
      repoId,
      token,
      amount: numeric,
      from: session.address,
      displayName: name,
    });
    setPhase("idle");
    router.push(`/receipt/${receipt.id}`);
  }

  const label = !session.walletConnected
    ? "Connect wallet"
    : phase === "approving"
      ? "Approving USDC"
      : phase === "sending"
        ? "Sending"
        : `Fund ${Number.isFinite(numeric) && numeric > 0 ? formatAmount(numeric, token) : ""}`.trim();

  return (
    <section className="rise rounded-[10px] border border-border bg-card p-4 shadow-[0_18px_50px_-32px_rgba(11,13,12,0.45)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium">Fund this repo</h2>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          Base
        </span>
      </div>
      <div className="grid grid-cols-3" role="group" aria-label="Token">
        {(["ETH", "USDC"] as Token[]).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={token === item}
            onClick={() => {
              setToken(item);
              setAmount(item === "USDC" ? "25" : "0.01");
              setError(null);
              setPhase("idle");
            }}
            className={cn(
              "h-9 border border-border text-sm",
              item === "ETH" && "rounded-l-[10px]",
              token === item ? "bg-foreground text-background" : "bg-card text-foreground",
            )}
          >
            {item}
          </button>
        ))}
        <button
          type="button"
          className="h-9 rounded-r-[10px] border border-l-0 border-border text-xs text-muted-foreground"
          onClick={() => toast("OAR is coming soon")}
        >
          OAR soon
        </button>
      </div>
      <div className="mt-4 rounded-[10px] border border-border px-4 py-3">
        <div className="flex items-end justify-between gap-3">
          <input
            inputMode="decimal"
            aria-label="Amount"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setError(null);
              setPhase("idle");
            }}
            className="w-full bg-transparent font-mono text-4xl tracking-tight tabular-nums outline-none"
          />
          <span className="pb-1 text-xs text-muted-foreground">{token}</span>
        </div>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          ≈ {formatUsdSafe(numeric, token)} · min $1
        </p>
      </div>
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
      {phase === "rejected" ? <p className="mt-2 text-sm text-destructive">Transaction rejected. Nothing was sent.</p> : null}
      <div className="mt-3 grid grid-cols-4 gap-2">
        {presets[token].map((preset) => (
          <Button
            key={preset}
            type="button"
            variant={Number(amount) === preset ? "secondary" : "outline"}
            className="h-8"
            onClick={() => {
              setAmount(String(preset));
              setError(null);
            }}
          >
            {token === "USDC" ? `$${preset}` : preset}
          </Button>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <SplitBar />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Maintainers · 95%</span>
          <span className="font-mono text-foreground">{formatToken(split.maintainer, token)} {token}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Platform fee · 5%</span>
          <span className="font-mono text-foreground">{formatToken(split.fee, token)} {token}</span>
        </div>
      </div>
      <Input
        className="mt-4 h-10"
        placeholder="Display name (optional)"
        value={name}
        onChange={(event) => setName(event.target.value)}
        aria-label="Display name"
      />
      {session.wrongNetwork ? (
        <Button className="mt-3 h-11 w-full" onClick={() => { switchToBase(); toast.success("Switched to Base"); }}>
          Switch to Base
        </Button>
      ) : (
        <Button className="mt-3 h-11 w-full" disabled={busy} onClick={() => void onFund()}>
          {busy ? <Loader2Icon className="animate-spin" data-icon="inline-start" /> : null}
          {label}
        </Button>
      )}
      <p className="mt-3 text-center text-xs text-muted-foreground">
        No account needed. Held by the contract on Base until maintainers claim.
      </p>
    </section>
  );
}

function formatUsdSafe(amount: number, token: Token) {
  if (!Number.isFinite(amount) || amount < 0) return "$0.00";
  return tokenUsd(amount, token).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
