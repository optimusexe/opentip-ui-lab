"use client";

import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { shortAddr } from "@/lib/format";
import { useDemo } from "@/lib/mock/store";
import { useSession } from "@/lib/mock/use-session";

export default function WalletsPage() {
  const session = useSession();
  const setPrimary = useDemo((s) => s.setPrimaryWallet);
  const linkExternal = useDemo((s) => s.linkExternalWallet);
  const createSmartWallet = useDemo((s) => s.createSmartWallet);
  if (!session.user) return null;

  return (
    <div>
      <h1 className="font-display text-4xl">Wallets</h1>
      <p className="mt-2 text-sm text-muted-foreground">Linked payout wallets. The primary wallet is the default when you register a repo.</p>
      {session.linked.length === 0 ? (
        <div className="mt-6 rounded-[10px] border border-dashed border-border px-4 py-8">
          <p className="text-sm">No wallet linked yet.</p>
          <Button className="mt-3" onClick={() => { const address = createSmartWallet(session.user!.id); toast.success(`Smart wallet ${shortAddr(address)}`); }}>
            Create smart wallet
          </Button>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {session.linked.map((wallet) => (
            <li key={wallet.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-border px-4 py-3">
              <div>
                <p className="font-mono text-sm">{wallet.address}</p>
                <p className="text-xs text-muted-foreground">
                  {wallet.walletType}
                  {wallet.subAccountAddress ? ` · sub ${shortAddr(wallet.subAccountAddress)}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {wallet.isPrimary ? <Badge>Primary</Badge> : (
                  <Button variant="outline" size="sm" onClick={() => setPrimary(session.user!.id, wallet.id)}>Make primary</Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => {
          const address = `0xe0a${session.user!.id.slice(-4).padEnd(4, "0")}${"0".repeat(32)}`.slice(0, 42);
          linkExternal(session.user!.id, address);
          toast.success("External wallet linked");
        }}
      >
        Link another wallet
      </Button>
    </div>
  );
}
