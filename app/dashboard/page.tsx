"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatUsd } from "@/lib/format";
import { pendingUsd, useDemo } from "@/lib/mock/store";
import { useSession } from "@/lib/mock/use-session";

export default function DashboardPage() {
  const session = useSession();
  const user = session.user;
  const allRepos = useDemo((s) => s.repos);
  const repos = useMemo(
    () => allRepos.filter((repo) => repo.owner === user?.login && repo.registered),
    [allRepos, user?.login],
  );
  const state = useDemo();
  const updateProfile = useDemo((s) => s.updateProfile);
  const unread = useDemo((s) => s.notifications.filter((n) => n.userId === user?.id && !n.read).length);
  const [bio, setBio] = useState(user?.bio ?? "");
  const [website, setWebsite] = useState(user?.website ?? "");
  const [twitter, setTwitter] = useState(user?.twitter ?? "");
  const [discord, setDiscord] = useState(user?.discord ?? "");
  const [telegram, setTelegram] = useState(user?.telegram ?? "");
  const [farcaster, setFarcaster] = useState(user?.farcaster ?? "");
  const [github, setGithub] = useState(user?.github ?? "");
  if (!user) return null;

  const pending = repos.reduce((sum, repo) => sum + pendingUsd(state, repo.repoId), 0);
  const funded = repos.reduce((sum, repo) => sum + repo.fundedUsd, 0);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-4xl">Overview</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/dashboard/repos" className="rounded-[10px] border border-border p-4 hover:border-brand/40">
          <p className="text-xs text-muted-foreground">Pending claim</p>
          <p className="mt-1 font-mono text-2xl text-pending tabular-nums">{formatUsd(pending)}</p>
        </Link>
        <Link href="/activity" className="rounded-[10px] border border-border p-4 hover:border-brand/40">
          <p className="text-xs text-muted-foreground">Total funded</p>
          <p className="mt-1 font-mono text-2xl tabular-nums">{formatUsd(funded)}</p>
        </Link>
        <Link href="/notifications" className="rounded-[10px] border border-border p-4 hover:border-brand/40">
          <p className="text-xs text-muted-foreground">Unread</p>
          <p className="mt-1 font-mono text-2xl tabular-nums">{unread}</p>
        </Link>
      </div>
      <section className="rounded-[10px] border border-border p-4">
        <h2 className="text-sm font-medium">Public profile</h2>
        <p className="mt-1 text-xs text-muted-foreground">Shown on /dev/{user.login ?? "you"}.</p>
        <FieldGroup className="mt-4">
          <Field>
            <FieldLabel htmlFor="bio">Bio</FieldLabel>
            <Textarea id="bio" value={bio} onChange={(event) => setBio(event.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField id="website" label="Website" value={website} onChange={setWebsite} />
            <TextField id="twitter" label="X" value={twitter} onChange={setTwitter} />
            <TextField id="discord" label="Discord" value={discord} onChange={setDiscord} />
            <TextField id="telegram" label="Telegram" value={telegram} onChange={setTelegram} />
            <TextField id="farcaster" label="Farcaster" value={farcaster} onChange={setFarcaster} />
            <TextField id="github" label="GitHub" value={github} onChange={setGithub} />
          </div>
        </FieldGroup>
        <Button
          className="mt-4"
          onClick={() => {
            updateProfile(user.id, { bio, website, twitter, discord, telegram, farcaster, github });
            toast.success("Profile saved");
          }}
        >
          Save profile
        </Button>
      </section>
    </div>
  );
}

function TextField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} />
    </Field>
  );
}
