import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { UrlSwap } from "@/components/url-swap";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <AppShell>
      <div className="mx-auto flex max-w-xl flex-col items-start gap-4 py-10">
        <p className="font-display text-7xl">404</p>
        <h1 className="font-display text-3xl">This page is not on the ledger.</h1>
        <p className="text-sm text-muted-foreground">Swap a GitHub link, or go back to a repo you can fund.</p>
        <UrlSwap initial="" button="Open funding page" />
        <Button variant="outline" render={<Link href="/" />}>Go home</Button>
      </div>
    </AppShell>
  );
}
