import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <AppShell>
      <article className="mx-auto flex max-w-2xl flex-col gap-8 py-6">
        <header>
          <h1 className="font-display text-4xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026. This demo stores data only in your browser.</p>
        </header>
        <Section title="1. Information we collect" body="Production Opentip collects GitHub account data for sign-in and profiles, an email address for recovery, wallet addresses you link, and minimal server logs. This demo stores the same kinds of fields in localStorage and never sends them to a server." />
        <Section title="2. How data is used" body="Data is used to authenticate you, show a maintainer profile, record funding, send account email, and limit abuse. On-chain addresses are public by nature." />
        <Section title="3. Storage" body="Production data is stored to operate the service. This lab keeps a single localStorage key, opentip-ledger-v1. Reset demo deletes that working copy back to the seed." />
        <Section title="4. Sharing" body="Opentip does not sell personal data. Wallet addresses and funding amounts are visible on the public ledger because that is how the product works." />
        <Section title="5. Contact" body="Privacy questions go to support@opentip.tech." />
      </article>
    </AppShell>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl font-medium">{title}</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </section>
  );
}
