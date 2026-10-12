"use client";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/mock/store";
import { useSession } from "@/lib/mock/use-session";

const types = [
  ["funding_received", "Funding received"],
  ["claim_available", "Claim available"],
  ["funding_sent", "Funding sent"],
  ["claim_submitted", "Claim submitted"],
] as const;

export default function NotificationSettingsPage() {
  const session = useSession();
  const prefs = useDemo((s) => (session.user ? s.notifPrefs[session.user.id] : null));
  const update = useDemo((s) => s.updateNotifPrefs);
  const setPermission = useDemo((s) => s.setNotifPermission);
  if (!session.user || !prefs) return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl">Notification settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">Choose what this demo should pretend to deliver.</p>
      </div>
      <section className="rounded-[10px] border border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Browser permission</p>
            <p className="text-xs text-muted-foreground">Current: {prefs.permission}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setPermission(session.user!.id, "denied")}>Deny</Button>
            <Button size="sm" onClick={() => setPermission(session.user!.id, "granted")}>Allow</Button>
          </div>
        </div>
        {prefs.permission === "denied" ? (
          <p className="mt-3 text-sm text-destructive">Notifications are blocked in this browser. Allow them to subscribe.</p>
        ) : null}
      </section>
      <label className="flex items-center justify-between rounded-[10px] border border-border px-4 py-3 text-sm">
        Email
        <Switch checked={prefs.email} onCheckedChange={(email) => update(session.user!.id, { email })} />
      </label>
      <label className="flex items-center justify-between rounded-[10px] border border-border px-4 py-3 text-sm">
        Push
        <Switch checked={prefs.push} disabled={prefs.permission !== "granted"} onCheckedChange={(push) => update(session.user!.id, { push })} />
      </label>
      <ul className="flex flex-col gap-2">
        {types.map(([key, label]) => (
          <li key={key} className="flex items-center justify-between rounded-[10px] border border-border px-4 py-3 text-sm">
            {label}
            <Switch checked={prefs.types[key]} onCheckedChange={(value) => update(session.user!.id, { types: { [key]: value } })} />
          </li>
        ))}
      </ul>
    </div>
  );
}
