"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useDemo } from "@/lib/mock/store";
import type { Persona } from "@/lib/mock/types";

const personas: { id: Persona; label: string; detail: string }[] = [
  { id: "funder", label: "Signed-out funder", detail: "No account. Connect a wallet to fund." },
  { id: "maintainer", label: "Maintainer with a balance", detail: "Signed in as vercel. Pending claim on next.js." },
  { id: "unregistered", label: "Unregistered repo", detail: "Signed in as kofi. signal-desk is not registered." },
  { id: "new", label: "New user", detail: "Signed in as Nova. Onboarding is not finished." },
];

export function DevPanel() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openPanel = () => setOpen(true);
    window.addEventListener("opentip-demo", openPanel);
    return () => window.removeEventListener("opentip-demo", openPanel);
  }, []);
  const persona = useDemo((s) => s.activePersona);
  const flags = useDemo((s) => s.flags);
  const setPersona = useDemo((s) => s.setPersona);
  const setWrongNetwork = useDemo((s) => s.setWrongNetwork);
  const setRejectTx = useDemo((s) => s.setRejectTx);
  const resetDemo = useDemo((s) => s.resetDemo);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[340px] sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Demo controls</SheetTitle>
            <SheetDescription>Everything here is fake and stays in this browser.</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-5 px-4 pb-6">
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 text-xs tracking-[0.14em] text-muted-foreground uppercase">Persona</legend>
              {personas.map((item) => (
                <label key={item.id} className="flex cursor-pointer items-start gap-2 rounded-[10px] border border-border px-3 py-2">
                  <input
                    type="radio"
                    name="persona"
                    className="mt-1 accent-primary"
                    checked={persona === item.id}
                    onChange={() => setPersona(item.id)}
                  />
                  <span>
                    <span className="block text-sm">{item.label}</span>
                    <span className="block text-xs text-muted-foreground">{item.detail}</span>
                  </span>
                </label>
              ))}
            </fieldset>
            <label className="flex items-center justify-between gap-3 text-sm">
              Wrong network
              <Switch checked={flags.wrongNetwork} onCheckedChange={setWrongNetwork} />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
              Reject next transaction
              <Switch checked={flags.rejectTx} onCheckedChange={setRejectTx} />
            </label>
            <Button
              variant="outline"
              onClick={() => {
                resetDemo();
                setOpen(false);
              }}
            >
              Reset demo
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
