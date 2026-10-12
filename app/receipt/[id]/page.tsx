"use client";

import { use, useRef, useState } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { ReceiptCard } from "@/components/receipt-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatAmount, repoTitle } from "@/lib/format";
import { useDemo } from "@/lib/mock/store";

export default function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const receipt = useDemo((s) => s.receipts.find((item) => item.id === id));
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  async function download() {
    if (!cardRef.current || !receipt) return;
    setSaving(true);
    try {
      const backgroundColor = getComputedStyle(document.body).backgroundColor;
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `opentip-${receipt.kind}-${receipt.number}.png`;
      link.click();
    } catch {
      toast.error("Could not save the receipt");
    } finally {
      setSaving(false);
    }
  }

  function share() {
    if (!receipt) return;
    const project = repoTitle(receipt.repoId);
    const pageUrl = `https://opentip.tech/${receipt.repoId}`;
    const text =
      receipt.kind === "claim"
        ? `Just claimed ${formatAmount(receipt.maintainerAmount, receipt.token)} in funding for ${project} on @opentip_tech. Funding for open source, from the open market.`
        : `I just funded ${project} on @opentip_tech. Funding for open source, from the open market.`;
    const intent = `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
  }

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-md flex-col items-center py-6">
        <div className="mb-8 flex w-full items-center justify-between">
          <Link href="/" className="text-sm font-semibold">Opentip</Link>
          <Badge className="bg-pending/15 text-pending">Demo</Badge>
        </div>
        {receipt ? (
          <>
            <span className="flex size-12 items-center justify-center rounded-full bg-accent text-brand">✓</span>
            <h1 className="mt-4 font-display text-5xl">{receipt.kind === "claim" ? "Claimed." : "Funded."}</h1>
            <div ref={cardRef} className="mt-8 w-full bg-background px-3 py-2">
              <ReceiptCard receipt={receipt} />
            </div>
            <Button variant="ink" className="mt-6 h-12 w-full rounded-full" aria-label="Share on X" onClick={share}>
              Share on
              <XMark />
            </Button>
            <Button variant="outline" className="mt-2 h-12 w-full rounded-full" disabled={saving} onClick={() => void download()}>
              {saving ? "Saving…" : "Download receipt"}
            </Button>
            {receipt.kind === "claim" ? (
              <Button variant="outline" className="mt-2 h-12 w-full rounded-full" render={<Link href="/dashboard" />}>
                Back to dashboard
              </Button>
            ) : (
              <Button variant="outline" className="mt-2 h-12 w-full rounded-full" render={<Link href="/repos" />}>
                Fund another repo
              </Button>
            )}
          </>
        ) : (
          <div className="py-16 text-center">
            <h1 className="font-display text-4xl">Receipt not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">That receipt is not in this browser’s demo ledger.</p>
            <Button className="mt-4" render={<Link href="/" />}>Go home</Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function XMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
