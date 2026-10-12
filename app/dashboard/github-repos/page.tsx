"use client";

import Link from "next/link";
import { useDemo } from "@/lib/mock/store";
import { useSession } from "@/lib/mock/use-session";
import { repoTitle } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function GithubReposPage() {
  const session = useSession();
  const login = session.user?.login;
  const githubRepos = useDemo((s) => s.githubRepos);
  const github = login ? githubRepos[login] ?? [] : [];
  const repos = useDemo((s) => s.repos);
  if (!session.user) return null;

  if (!session.user.hasGithub || !login) {
    return (
      <div>
        <h1 className="font-display text-4xl">GitHub repos</h1>
        <p className="mt-2 text-sm text-muted-foreground">Connect GitHub before you can register a repository.</p>
        <Button className="mt-4" render={<Link href="/onboarding" />}>Connect GitHub</Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-4xl">GitHub repos</h1>
      <p className="mt-2 text-sm text-muted-foreground">Repos {login} can register. This list is seeded for the demo.</p>
      {github.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No repositories on this account.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {github.map((repo) => {
            const id = `${repo.owner}/${repo.name}`;
            const registered = repos.find((item) => item.repoId === id)?.registered;
            return (
              <li key={id} className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{repoTitle(repo.name)}</p>
                  <p className="text-xs text-muted-foreground">{repo.description}</p>
                </div>
                {registered ? <Badge variant="outline">Registered</Badge> : <Button size="sm" render={<Link href={`/${id}`} />}>Register</Button>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
