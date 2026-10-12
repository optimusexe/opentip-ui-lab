"use client";

import { use } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { ReceiptCard } from "@/components/receipt-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/mock/store";

export default function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const receipt = useDemo((s) => s.receipts.find((item) => item.id === id));

  return (
    <AppShell footer={false}>
      <div className="mx-auto flex w-full max-w-md flex-col items-center py-6">
        <div className="mb-8 flex w-full items-center justify-between">
          <Link href="/" className="text-sm font-semibold">Opentip</Link>
          <Badge className="bg-pending/15 text-pending">Demo</Badge>
        </div>
        {receipt ? (
          <>
            <span className="flex size-12 items-center justify-center rounded-full bg-accent text-brand">✓</span>
            <h1 className="mt-4 font-display text-5xl">{receipt.kind === "claim" ? "Claimed." : "Funded."}</h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {receipt.kind === "claim"
                ? "The maintainer share has been paid out of the contract on Base."
                : "Your funding is held by the contract on Base."}
            </p>
            <div className="mt-8 w-full">
              <ReceiptCard receipt={receipt} />
            </div>
            <Button
              variant="ink"
              className="mt-6 h-12 w-full rounded-full"
              onClick={() => {
                void navigator.clipboard.writeText(window.location.href);
                toast.success("Receipt link copied");
              }}
            >
              Share receipt
            </Button>
            <Button variant="outline" className="mt-2 h-12 w-full rounded-full" render={<Link href="/repos" />}>
              Fund another repo
            </Button>
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
