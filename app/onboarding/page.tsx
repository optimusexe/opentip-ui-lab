"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { shortAddr } from "@/lib/format";
import { useDemo } from "@/lib/mock/store";
import { useSession } from "@/lib/mock/use-session";

const stages = ["Account", "GitHub", "Wallet", "Done"];

export default function OnboardingPage() {
  const router = useRouter();
  const session = useSession();
  const setPersona = useDemo((s) => s.setPersona);
  const connectGithub = useDemo((s) => s.connectGithub);
  const createSmartWallet = useDemo((s) => s.createSmartWallet);
  const completeOnboarding = useDemo((s) => s.completeOnboarding);
  const flags = useDemo((s) => s.flags);
  const [step, setStep] = useState(0);
  const [creating, setCreating] = useState(false);
  const [failed, setFailed] = useState(false);
  const [address, setAddress] = useState<string | null>(session.primary?.address ?? null);

  const index = session.signedIn ? Math.max(step, session.user?.hasGithub ? (address ? 3 : 2) : 1) : 0;

  async function createWallet() {
    if (!session.user) return;
    setFailed(false);
    setCreating(true);
    await wait(1200);
    if (flags.rejectTx) {
      setCreating(false);
      setFailed(true);
      return;
    }
    const created = createSmartWallet(session.user.id);
    setAddress(created);
    setCreating(false);
    setStep(3);
    toast.success("Wallet created");
  }

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-md flex-col gap-8 py-10">
        <div>
          <h1 className="font-display text-5xl">Set up Opentip</h1>
          <ol className="mt-6 grid grid-cols-4 gap-2">
            {stages.map((label, i) => (
              <li key={label} className="flex flex-col gap-2">
                <span className={i <= index ? "h-1 rounded-full bg-primary" : "h-1 rounded-full bg-muted"} />
                <span className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase">{label}</span>
              </li>
            ))}
          </ol>
        </div>

        {index === 0 ? (
          <section className="flex flex-col gap-3 border-t border-border pt-6">
            <h2 className="text-xl font-medium">Create your account</h2>
            <p className="text-sm text-muted-foreground">Sign in with GitHub or email. Funders don&apos;t need an account — just connect a wallet on any funding page.</p>
            <div className="flex gap-2">
              <Button onClick={() => { setPersona("new"); setStep(1); }}>Sign in with GitHub</Button>
              <Button variant="outline" render={<a href="/signin" />}>Use email</Button>
            </div>
          </section>
        ) : null}

        {index === 1 ? (
          <section className="flex flex-col gap-3 border-t border-border pt-6">
            <h2 className="text-xl font-medium">Connect GitHub</h2>
            <p className="text-sm text-muted-foreground">Link GitHub so you can verify repo ownership and register repos for funding.</p>
            <Button
              onClick={() => {
                if (session.user) connectGithub(session.user.id);
                setStep(2);
                toast.success("GitHub connected");
              }}
            >
              Connect GitHub
            </Button>
          </section>
        ) : null}

        {index === 2 ? (
          <section className="flex flex-col gap-3 border-t border-border pt-6">
            {failed ? (
              <>
                <h2 className="text-xl font-medium">Wallet creation failed</h2>
                <p className="text-sm text-muted-foreground">The demo wallet could not be created. Try again.</p>
                <Button onClick={() => void createWallet()}>Try again</Button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-medium">{creating ? "Creating your wallet" : "Create your smart wallet"}</h2>
                <p className="text-sm text-muted-foreground">Your Opentip Smart Wallet works on every device. This takes a few seconds.</p>
                <Button disabled={creating} onClick={() => void createWallet()}>{creating ? "Please wait…" : "Create wallet"}</Button>
              </>
            )}
          </section>
        ) : null}

        {index >= 3 && address ? (
          <section className="flex flex-col gap-3 border-t border-border pt-6">
            <h2 className="text-xl font-medium">Welcome to Opentip</h2>
            <p className="font-mono text-sm">{shortAddr(address)} <span className="ml-2 rounded bg-foreground px-1.5 py-0.5 text-[10px] text-background">SMART</span></p>
            <p className="text-sm text-muted-foreground">You are set up. Fund the wallet with ETH or USDC, then register a repo.</p>
            <Button
              onClick={() => {
                if (session.user) completeOnboarding(session.user.id);
                router.push("/dashboard/github-repos");
              }}
            >
              Register repo now
            </Button>
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
