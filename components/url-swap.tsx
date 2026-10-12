"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fundingPath, parseGithubRepo } from "@/lib/parse-repo";
import { cn } from "cn";

export function UrlSwap({
  initial = "vercel/next.js",
  button = "Fund this repo",
  compact = false,
  onNavigate,
}: {
  initial?: string;
  button?: string;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = parseGithubRepo(value);
    if (!parsed) {
      setError("Enter owner/repo, or paste a GitHub URL.");
      return;
    }
    setError(null);
    onNavigate?.();
    router.push(fundingPath(parsed));
  }

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-2">
      <div
        className={cn(
          "flex flex-col gap-2 rounded-[10px] border border-border bg-card p-1.5 sm:flex-row sm:items-center sm:rounded-full sm:pl-4",
          compact && "sm:pl-3",
        )}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1.5 gap-y-1 px-2 font-mono text-[13px] sm:flex-nowrap sm:px-0">
          <span className="text-muted-foreground">https://</span>
          <span className="text-muted-foreground line-through decoration-muted-foreground/80">github.com</span>
          <span className="text-muted-foreground" aria-hidden>
            →
          </span>
          <span className="rounded-full bg-accent px-1.5 py-0.5 text-brand">opentip.tech</span>
          <span className="text-muted-foreground">/</span>
          <input
            aria-label="Repository"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              if (error) setError(null);
            }}
            placeholder="owner/repo"
            spellCheck={false}
            className="min-w-0 flex-1 basis-full bg-transparent font-mono text-[13px] text-foreground outline-none placeholder:text-muted-foreground sm:basis-auto"
          />
        </div>
        <Button type="submit" variant="ink" className="h-10 rounded-full px-4">
          {button}
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>
      {error ? <p className="px-2 text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
