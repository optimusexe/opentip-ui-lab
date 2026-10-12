import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <AppShell footer>
      <article className="mx-auto flex max-w-2xl flex-col gap-8 py-6">
        <header>
          <h1 className="font-display text-4xl">Terms of Service</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026. Demo copy only. This is not the production service, and no real funds move.</p>
        </header>
        <Section title="1. Acceptance of Terms" body="By accessing or using Opentip, you agree to these terms. If you do not agree, do not use the service." />
        <Section title="2. Description of Service" body="Opentip lets people send cryptocurrency funding to open-source maintainers. The service facilitates transactions on Base. Opentip does not custody user funds. This UI lab simulates that flow in the browser only." />
        <Section title="3. Eligibility" body="You must be at least 18 and able to form a binding contract. You are responsible for complying with the laws that apply to you." />
        <Section title="4. User responsibilities" body="You are responsible for your wallet and for transactions you start. Do not use the service for illegal purposes, and do not attempt to exploit the contracts or the platform." />
        <Section title="5. Fees" body="Opentip charges a 5% platform fee on funding, taken by the smart contract before a maintainer can claim. The fee is capped at 10%. Fees are not refundable once a transaction is confirmed." />
        <Section title="6. Smart contract risk" body="The service relies on smart contracts on Base. They are provided as is. Blockchain systems carry risk, including bugs, congestion, and unexpected failures." />
        <Section title="7. No warranty" body="The service is provided without warranties of any kind, including merchantability, fitness for a particular purpose, and non-infringement." />
        <Section title="8. Limitation of liability" body="Opentip and its contributors are not liable for indirect, incidental, special, consequential, or punitive damages, including loss of funds, data, or profits." />
        <Section title="9. Modifications" body="These terms may change. Continued use after a change means you accept the update." />
        <Section title="10. Governing law" body="These terms are governed by the applicable jurisdiction, without regard to conflict-of-law rules." />
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
