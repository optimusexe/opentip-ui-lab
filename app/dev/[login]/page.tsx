"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { formatUsd } from "@/lib/format";
import { useDemo } from "@/lib/mock/store";

export default function DevPage({ params }: { params: Promise<{ login: string }> }) {
  const { login } = use(params);
  const name = decodeURIComponent(login);
  const user = useDemo((s) => s.users.find((item) => item.login === name));
  const allRepos = useDemo((s) => s.repos);
  const repos = useMemo(() => allRepos.filter((repo) => repo.owner === name && !repo.hidden), [allRepos, name]);

  if (!user && repos.length === 0) {
    return (
      <AppShell>
        <h1 className="font-display text-4xl">Profile not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">No maintainer named {name} is in this demo.</p>
      </AppShell>
    );
  }

  const profile = user ?? {
    name,
    login: name,
    bio: "Public maintainer page.",
    website: "",
    twitter: "",
    discord: "",
    telegram: "",
    farcaster: "",
    github: name,
    pfpHue: 220,
    headerHue: 230,
  };

  return (
    <AppShell>
      <div className="overflow-hidden rounded-[10px] border border-border">
        <div className="h-28" style={{ background: `linear-gradient(120deg, hsl(${profile.headerHue} 40% 42%), hsl(${profile.headerHue} 20% 18%))` }} />
        <div className="px-5 pb-5">
          <div className="-mt-8 flex size-16 items-center justify-center rounded-full border-4 border-background font-display text-xl text-white" style={{ background: `hsl(${profile.pfpHue} 45% 38%)` }}>
            {profile.name.slice(0, 1)}
          </div>
          <h1 className="mt-3 font-display text-4xl">{profile.name}</h1>
          <p className="font-mono text-sm text-muted-foreground">@{profile.login}</p>
          {profile.bio ? <p className="mt-3 max-w-xl text-sm leading-relaxed">{profile.bio}</p> : null}
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-brand">
            {profile.website ? <a href={profile.website}>Website</a> : null}
            {profile.twitter ? <span>X @{profile.twitter}</span> : null}
            {profile.github ? <a href={`https://github.com/${profile.github}`}>GitHub</a> : null}
            {profile.discord ? <span>Discord {profile.discord}</span> : null}
            {profile.farcaster ? <span>Farcaster {profile.farcaster}</span> : null}
          </div>
        </div>
      </div>
      <h2 className="mt-8 text-sm font-medium">Repos</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {repos.length === 0 ? <li className="text-sm text-muted-foreground">No public repos yet.</li> : repos.map((repo) => (
          <li key={repo.repoId}>
            <Link href={`/${repo.repoId}`} className="flex items-center justify-between rounded-[10px] border border-border px-4 py-3 hover:bg-muted/50">
              <span>
                <span className="block font-mono text-sm">{repo.repoId}</span>
                <span className="text-xs text-muted-foreground">{repo.registered ? "Registered" : "Not claimed yet"}</span>
              </span>
              <span className="font-mono text-sm tabular-nums">{formatUsd(repo.fundedUsd)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
