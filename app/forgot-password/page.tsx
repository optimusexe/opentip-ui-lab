"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6 py-16">
        <h1 className="font-display text-4xl">Reset password</h1>
        {sent ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">If an account exists for {email}, a reset link is on its way. This demo does not send email.</p>
            <Button render={<Link href="/reset-password?token=demo" />}>Open reset link</Button>
            <Button variant="outline" render={<Link href="/reset-password?token=expired" />}>Preview expired link</Button>
          </div>
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!email.includes("@")) {
                setError("Enter a valid email");
                return;
              }
              setError(null);
              setSent(true);
            }}
          >
            <Field data-invalid={error ? true : undefined}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(error)} />
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
            </Field>
            <Button type="submit">Send reset link</Button>
          </form>
        )}
        <Link href="/signin" className="text-sm text-muted-foreground underline">Back to sign in</Link>
      </div>
    </AppShell>
  );
}
