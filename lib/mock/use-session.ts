"use client";

import { PERSONA_USER, useDemo } from "@/lib/mock/store";
import type { Wallet } from "@/lib/mock/types";

export function useSession() {
  const persona = useDemo((s) => s.activePersona);
  const sessions = useDemo((s) => s.sessions);
  const users = useDemo((s) => s.users);
  const wallets = useDemo((s) => s.wallets);
  const flags = useDemo((s) => s.flags);
  const balances = useDemo((s) => s.balances);
  const userId = PERSONA_USER[persona];
  const user = users.find((u) => u.id === userId) ?? null;
  const session = sessions[persona];
  const linked = user ? wallets.filter((w) => w.userId === user.id) : [];
  const primary = linked.find((w) => w.isPrimary) ?? linked[0] ?? null;
  const address = session.walletConnected ? session.address : null;
  const wallet: Wallet | null =
    address && user
      ? linked.find((w) => w.address.toLowerCase() === address.toLowerCase()) ??
        (primary && address === primary.address ? primary : null)
      : null;
  return {
    persona,
    user,
    signedIn: Boolean(user),
    walletConnected: Boolean(address),
    address,
    linked,
    primary,
    wallet,
    wrongNetwork: flags.wrongNetwork && Boolean(address),
    rejectTx: flags.rejectTx,
    balance: address ? balances[address] ?? { ETH: 0, USDC: 0 } : { ETH: 0, USDC: 0 },
    sponsored: wallet?.walletType === "smart",
  };
}
