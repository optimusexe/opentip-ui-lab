"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { BellIcon, MoonIcon, SearchIcon, SunIcon } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/lib/mock/use-session";
import { useDemo } from "@/lib/mock/store";
import { shortAddr } from "@/lib/format";
import { cn } from "cn";

const links = [
  { href: "/repos", label: "Repos" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/activity", label: "Activity" },
  { href: "/docs", label: "Docs" },
];

export function SiteHeader({ center }: { center?: string }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const session = useSession();
  const signOut = useDemo((s) => s.signOut);
  const notifications = useDemo((s) => s.notifications);
  const unread = session.user ? notifications.filter((n) => n.userId === session.user?.id && !n.read).length : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center gap-3 px-4">
        <Link href="/" className="shrink-0" aria-label="Opentip home">
          <Logo />
        </Link>
        {center ? (
          <p className="hidden min-w-0 flex-1 truncate text-center font-mono text-xs text-muted-foreground sm:block">
            {center}
          </p>
        ) : (
          <nav className="ml-4 hidden items-center gap-5 md:flex" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm text-muted-foreground transition-colors hover:text-foreground",
                  pathname === link.href && "text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <Button
            variant="ghost"
            className="h-8 px-2 text-xs text-muted-foreground"
            onClick={() => window.dispatchEvent(new Event("opentip-demo"))}
          >
            Demo
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search repositories"
            onClick={() => window.dispatchEvent(new Event("opentip-search"))}
          >
            <SearchIcon />
          </Button>
          <span className="hidden items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs sm:inline-flex">
            <span className={cn("size-1.5 rounded-full", session.wrongNetwork ? "bg-pending" : "bg-primary")} />
            {session.wrongNetwork ? "Wrong network" : "Base"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle color theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <SunIcon className="hidden dark:block" />
            <MoonIcon className="dark:hidden" />
          </Button>
          {session.signedIn ? (
            <>
              <Button variant="ghost" size="icon" aria-label="Notifications" render={<Link href="/notifications" />}>
                <BellIcon />
                {unread > 0 ? (
                  <span className="absolute top-1 right-1 size-1.5 rounded-full bg-primary" />
                ) : null}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="inline-flex h-8 items-center rounded-full border border-border px-2.5 font-mono text-xs"
                >
                  {session.address ? shortAddr(session.address) : session.user?.login ?? "Account"}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem render={<Link href="/dashboard" />}>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/wallet" />}>Wallet</DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/dashboard/repos" />}>Your repos</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="ink" className="h-8 rounded-full px-3" render={<Link href="/signin" />}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
