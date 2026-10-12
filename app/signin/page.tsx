"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDemo } from "@/lib/mock/store";

export default function SignInPage() {
  return (
    <Suspense>
      <SignInInner />
    </Suspense>
  );
}

function SignInInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("callbackUrl") || "/dashboard";
  const setPersona = useDemo((s) => s.setPersona);
  const signInEmail = useDemo((s) => s.signInEmail);
  const signUp = useDemo((s) => s.signUp);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function github() {
    setPersona("maintainer");
    toast.success("Signed in as vercel");
    router.push(next.startsWith("/onboarding") ? next : "/dashboard");
  }

  function submit() {
    setError(null);
    if (mode === "signup") {
      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }
      signUp({ name, email });
      toast.success("Account created");
      router.push("/verify-email");
      return;
    }
    if (!email || password === "wrong" || password.length === 0) {
      setError("Invalid email or password");
      toast.error("Login failed");
      return;
    }
    const ok = signInEmail(email);
    if (!ok) {
      setError("Invalid email or password");
      toast.error("Login failed");
      return;
    }
    toast.success("Signed in");
    router.push(next);
  }

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8 py-10">
        <h1 className="font-display text-5xl">Sign in</h1>
        <Button variant="ink" className="h-11" onClick={github}>Continue with GitHub</Button>
        <div className="h-px bg-border" />
        <FieldGroup>
          {mode === "signup" ? (
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ada Lovelace" />
            </Field>
          ) : null}
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ada@example.com" aria-invalid={Boolean(error)} />
          </Field>
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" aria-invalid={Boolean(error)} />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </Field>
        </FieldGroup>
        {mode === "login" ? (
          <Link href="/forgot-password" className="text-xs text-muted-foreground underline underline-offset-4">Forgot your password?</Link>
        ) : null}
        <Button className="h-10 w-fit" onClick={submit}>{mode === "signup" ? "Create account" : "Sign in"}</Button>
        <p className="text-xs text-muted-foreground">
          {mode === "login" ? (
            <>Don&apos;t have an account? <button className="underline" onClick={() => setMode("signup")}>Create one</button></>
          ) : (
            <>Already have an account? <button className="underline" onClick={() => setMode("login")}>Sign in</button></>
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          Demo accounts: maintainers@vercel.com, kofi@dev.example, nova@example.com. Any password except “wrong”.
        </p>
        <Link href="/" className="text-sm text-muted-foreground underline">Back to home</Link>
      </div>
    </AppShell>
  );
}
