"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useDemo } from "@/lib/mock/store";
import { useSession } from "@/lib/mock/use-session";

export default function SecurityPage() {
  const session = useSession();
  const policy = useDemo((s) => (session.user ? s.policies[session.user.id] : null));
  const update = useDemo((s) => s.updatePolicy);
  const add = useDemo((s) => s.addRecipient);
  const remove = useDemo((s) => s.removeRecipient);
  const [recipient, setRecipient] = useState("");
  if (!session.signedIn || !session.user || !policy) {
    return (
      <AppShell>
        <h1 className="font-display text-4xl">Wallet security</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in as a maintainer to edit spending policy.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 className="font-display text-4xl">Wallet security</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">Pause spending, cap a day or a single send, and limit recipients. These rules apply to sends from the wallet page.</p>
      <div className="mt-6 flex max-w-xl flex-col gap-3">
        <Row label="Pause all spending">
          <Switch checked={policy.pauseAll} onCheckedChange={(pauseAll) => update(session.user!.id, { pauseAll })} />
        </Row>
        <Row label="Daily limit">
          <Switch checked={policy.dailyLimitEnabled} onCheckedChange={(dailyLimitEnabled) => update(session.user!.id, { dailyLimitEnabled })} />
        </Row>
        <Input
          type="number"
          aria-label="Daily limit in USD"
          value={policy.dailyLimitUsd}
          onChange={(event) => update(session.user!.id, { dailyLimitUsd: Number(event.target.value) })}
        />
        <Row label="Per-transaction limit">
          <Switch checked={policy.perTxLimitEnabled} onCheckedChange={(perTxLimitEnabled) => update(session.user!.id, { perTxLimitEnabled })} />
        </Row>
        <Input
          type="number"
          aria-label="Per transaction limit in USD"
          value={policy.perTxLimitUsd}
          onChange={(event) => update(session.user!.id, { perTxLimitUsd: Number(event.target.value) })}
        />
        <Row label="Permitted recipients only">
          <Switch checked={policy.permittedRecipientsEnabled} onCheckedChange={(permittedRecipientsEnabled) => update(session.user!.id, { permittedRecipientsEnabled })} />
        </Row>
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!recipient.startsWith("0x") || recipient.length < 8) return;
            add(session.user!.id, recipient);
            setRecipient("");
            toast.success("Recipient added");
          }}
        >
          <Input value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="0x recipient" aria-label="Recipient address" />
          <Button type="submit" variant="outline">Add</Button>
        </form>
        <ul className="flex flex-col gap-2">
          {policy.permittedRecipients.map((address) => (
            <li key={address} className="flex items-center justify-between font-mono text-xs">
              {address}
              <Button variant="ghost" size="sm" onClick={() => remove(session.user!.id, address)}>Remove</Button>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center justify-between rounded-[10px] border border-border px-4 py-3 text-sm">
      {label}
      {children}
    </label>
  );
}
