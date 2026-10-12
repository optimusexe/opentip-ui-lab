"use client";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <AppShell>
      <h1 className="font-display text-4xl">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">The demo hit an unexpected error. You can try the page again.</p>
      <Button className="mt-4" onClick={() => reset()}>Try again</Button>
    </AppShell>
  );
}
