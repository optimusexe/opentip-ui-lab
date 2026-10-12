"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export default function InstallPage() {
  const [installed, setInstalled] = useState(false);
  return (
    <AppShell>
      <h1 className="font-display text-4xl">Install Opentip</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Opentip can be installed as an app on your phone or desktop. This demo does not register a service worker. The button shows the install confirmation only.
      </p>
      <ol className="mt-6 flex max-w-xl flex-col gap-3 text-sm">
        <li className="rounded-[10px] border border-border px-4 py-3">1. Open opentip.tech in Chrome, Edge, or Safari.</li>
        <li className="rounded-[10px] border border-border px-4 py-3">2. Choose Install, or Add to Home Screen.</li>
        <li className="rounded-[10px] border border-border px-4 py-3">3. Fund from the home screen. No account is required.</li>
      </ol>
      <Button
        className="mt-6"
        onClick={() => {
          setInstalled(true);
          toast.success("Installed in this demo");
        }}
      >
        {installed ? "Installed" : "Install app"}
      </Button>
    </AppShell>
  );
}
