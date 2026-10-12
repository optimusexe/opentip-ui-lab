"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatUsd, repoTitle } from "@/lib/format";
import { useDemo } from "@/lib/mock/store";

export default function ReposPage() {
  const repos = useDemo((s) => s.repos);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"funded" | "recent" | "funders">("funded");
  const listed = useMemo(() => {
    const q = query.trim().toLowerCase();
    return repos
      .filter((repo) => repo.registered && !repo.hidden)
      .filter((repo) => !q || repo.repoId.includes(q) || repoTitle(repo.repoId).toLowerCase().includes(q) || repo.description.toLowerCase().includes(q))
      .sort((a, b) => {
        if (sort === "funders") return b.funderCount - a.funderCount;
        if (sort === "recent") return (b.registeredAt ?? 0) - (a.registeredAt ?? 0);
        return b.fundedUsd - a.fundedUsd;
      });
  }, [repos, query, sort]);

  return (
    <AppShell>
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-4xl">Repos</h1>
        <p className="max-w-xl text-sm text-muted-foreground">Registered funding pages. Unclaimed repos stay off this list until a maintainer registers.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search owner or repo" aria-label="Search repos" className="h-10 sm:max-w-sm" />
          <select
            aria-label="Sort repos"
            value={sort}
            onChange={(event) => setSort(event.target.value as typeof sort)}
            className="h-10 rounded-[10px] border border-border bg-background px-3 text-sm"
          >
            <option value="funded">Most funded</option>
            <option value="funders">Most funders</option>
            <option value="recent">Recently registered</option>
          </select>
        </div>
      </header>
      {listed.length === 0 ? (
        <div className="mt-10 rounded-[10px] border border-dashed border-border px-4 py-12 text-center">
          <p className="font-medium">No repos match</p>
          <p className="mt-1 text-sm text-muted-foreground">Try another name, or open a page directly with owner/repo.</p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-[10px] border border-border">
          {listed.map((repo) => (
            <li key={repo.repoId}>
              <Link href={`/${repo.repoId}`} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/60">
                <span className="flex size-9 items-center justify-center rounded-[8px] border border-border font-display">{repo.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{repoTitle(repo.repoId)}</span>
                  <span className="block truncate text-xs text-muted-foreground">{repo.description}</span>
                </span>
                <Badge variant="outline" className="hidden sm:inline-flex">{repo.language}</Badge>
                <span className="font-mono text-sm tabular-nums">{formatUsd(repo.fundedUsd)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
