"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { relTime, shortAddr } from "@/lib/format";
import { useDemo } from "@/lib/mock/store";
import { useSession } from "@/lib/mock/use-session";

export default function NotificationsPage() {
  const session = useSession();
  const notifications = useDemo((s) => s.notifications);
  const items = useMemo(
    () => notifications.filter((n) => n.userId === session.user?.id).sort((a, b) => b.createdAt - a.createdAt),
    [notifications, session.user?.id],
  );
  const markRead = useDemo((s) => s.markRead);
  const markAll = useDemo((s) => s.markAllRead);
  const clear = useDemo((s) => s.clearNotifications);

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">Notifications</h1>
          <p className="mt-2 text-sm text-muted-foreground">Funding and claim events for the signed-in maintainer.</p>
        </div>
        {session.user ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => markAll(session.user!.id)}>Mark all read</Button>
            <Button variant="ghost" size="sm" onClick={() => clear(session.user!.id)}>Clear</Button>
          </div>
        ) : null}
      </div>
      {!session.signedIn ? (
        <div className="mt-6 rounded-[10px] border border-border p-6">
          <p className="text-sm text-muted-foreground">Sign in to read your inbox.</p>
          <Button className="mt-3" render={<Link href="/signin?callbackUrl=/notifications" />}>Sign in</Button>
        </div>
      ) : items.length === 0 ? (
        <p className="mt-8 rounded-[10px] border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">No notifications.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => markRead(item.id)}
                className="flex w-full flex-col items-start gap-1 rounded-[10px] border border-border px-4 py-3 text-left hover:bg-muted/40"
              >
                <span className="flex w-full items-center justify-between gap-3">
                  <span className="text-sm font-medium">{item.title}</span>
                  {!item.read ? <span className="size-1.5 rounded-full bg-primary" /> : null}
                </span>
                <span className="text-sm text-muted-foreground">{item.body}</span>
                <span className="text-xs text-muted-foreground">
                  {relTime(item.createdAt)}
                  {item.txHash ? ` · ${shortAddr(item.txHash)}` : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
