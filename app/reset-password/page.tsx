"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const params = useSearchParams();
  const router = useRouter();
  const expired = params.get("token") === "expired";
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (expired) {
    return (
      <AppShell>
        <div className="mx-auto flex max-w-sm flex-col gap-4 py-16">
          <h1 className="font-display text-4xl">Link expired</h1>
          <p className="text-sm text-muted-foreground">This reset link is no longer valid. Request a new one.</p>
          <Button render={<Link href="/forgot-password" />}>Request a new link</Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-sm flex-col gap-5 py-16">
        <h1 className="font-display text-4xl">Choose a new password</h1>
        {done ? (
          <Button onClick={() => router.push("/signin")}>Continue to sign in</Button>
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (password.length < 8) {
                setError("Password must be at least 8 characters");
                return;
              }
              setDone(true);
            }}
          >
            <Field data-invalid={error ? true : undefined}>
              <FieldLabel htmlFor="password">New password</FieldLabel>
              <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={Boolean(error)} />
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
            </Field>
            <Button type="submit">Update password</Button>
          </form>
        )}
      </div>
    </AppShell>
  );
}
