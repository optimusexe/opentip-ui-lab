"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/mock/use-session";
import { cn } from "cn";

const links = [
  ["/dashboard", "Overview"],
  ["/dashboard/repos", "Repos"],
  ["/dashboard/github-repos", "GitHub repos"],
  ["/dashboard/wallets", "Wallets"],
  ["/dashboard/notifications", "Notifications"],
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const session = useSession();

  return (
    <AppShell>
      <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-1">
          <p className="px-2 text-xs tracking-[0.14em] text-muted-foreground uppercase">Dashboard</p>
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                pathname === href && "bg-muted text-foreground",
              )}
            >
              {label}
            </Link>
          ))}
        </aside>
        <div className="min-w-0">
          {!session.signedIn ? (
            <div className="rounded-[10px] border border-border p-6">
              <h1 className="font-display text-3xl">Sign in to continue</h1>
              <p className="mt-2 text-sm text-muted-foreground">The dashboard is for maintainers. Funding a repo does not require an account.</p>
              <Button className="mt-4" render={<Link href="/signin?callbackUrl=/dashboard" />}>Sign in</Button>
            </div>
          ) : (
            <>
              {session.user && !session.user.onboardingComplete ? (
                <p className="mb-4 rounded-[10px] border border-pending/40 bg-pending/10 px-3 py-2 text-sm">
                  Finish setup to register a repo. <Link href="/onboarding" className="text-brand">Continue onboarding</Link>
                </p>
              ) : null}
              {children}
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
