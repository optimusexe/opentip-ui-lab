"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useDemo } from "@/lib/mock/store";
import { useSession } from "@/lib/mock/use-session";

export default function VerifyEmailPage() {
  const router = useRouter();
  const session = useSession();
  const mark = useDemo((s) => s.markEmailVerified);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-sm flex-col items-start gap-5 py-16">
        <h1 className="font-display text-4xl">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code for {session.user?.email ?? "your inbox"}. Any 6 digits work in this demo.
        </p>
        <InputOTP maxLength={6} value={code} onChange={setCode}>
          <InputOTPGroup>
            {Array.from({ length: 6 }, (_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button
          onClick={() => {
            if (!/^\d{6}$/.test(code)) {
              setError("Enter the 6-digit code");
              return;
            }
            if (session.user) mark(session.user.id);
            router.push("/onboarding");
          }}
        >
          Verify
        </Button>
      </div>
    </AppShell>
  );
}
