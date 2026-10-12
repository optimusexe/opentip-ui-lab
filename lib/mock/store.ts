"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ADDR } from "@/lib/constants";
import { fakeHash, repoTitle, splitAmount, tokenUsd } from "@/lib/format";
import { placeholderRepo } from "@/lib/mock/placeholder";
import { createSeed } from "@/lib/mock/seed";
import type {
  DemoData,
  Persona,
  Policy,
  Receipt,
  Token,
  User,
} from "@/lib/mock/types";

export const PERSONA_USER: Record<Persona, string | null> = {
  funder: null,
  maintainer: "user_vercel",
  unregistered: "user_kofi",
  new: "user_nova",
};

type Actions = {
  setPersona: (persona: Persona) => void;
  connectWallet: () => void;
  disconnectWallet: () => void;
  switchToBase: () => void;
  setWrongNetwork: (value: boolean) => void;
  setRejectTx: (value: boolean) => void;
  resetDemo: () => void;
  signOut: () => void;
  signInEmail: (email: string) => boolean;
  signUp: (input: { name: string; email: string }) => void;
  fund: (input: {
    repoId: string;
    token: Token;
    amount: number;
    from: string;
    displayName?: string;
  }) => Receipt;
  claim: (input: { repoId: string; from: string; tokens: Token[] }) => Receipt[];
  verifyRepo: (userId: string, repoId: string) => void;
  registerRepo: (input: { repoId: string; payoutAddress: string; from: string }) => string;
  hideRepo: (repoId: string, hidden: boolean) => void;
  updateProfile: (userId: string, patch: Partial<User>) => void;
  connectGithub: (userId: string) => void;
  createSmartWallet: (userId: string) => string;
  linkExternalWallet: (userId: string, address: string) => void;
  setPrimaryWallet: (userId: string, walletId: string) => void;
  completeOnboarding: (userId: string) => void;
  markEmailVerified: (userId: string) => void;
  updatePolicy: (userId: string, patch: Partial<Policy>) => void;
  addRecipient: (userId: string, address: string) => void;
  removeRecipient: (userId: string, address: string) => void;
  setNotifPermission: (userId: string, permission: "granted" | "denied") => void;
  updateNotifPrefs: (
    userId: string,
    patch: {
      push?: boolean;
      email?: boolean;
      permission?: "default" | "granted" | "denied";
      types?: Partial<DemoData["notifPrefs"][string]["types"]>;
    },
  ) => void;
  markRead: (id: string) => void;
  markAllRead: (userId: string) => void;
  clearNotifications: (userId: string) => void;
  sendFromWallet: (input: {
    from: string;
    to: string;
    token: Token;
    amount: number;
    sponsored: boolean;
  }) => { txHash: string };
  saveDisplayName: (address: string, name: string) => void;
};

export type DemoState = DemoData & Actions;

function uid(prefix: string) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

export const useDemo = create<DemoState>()(
  persist(
    (set, get) => ({
      ...createSeed(),

      setPersona: (activePersona) => set({ activePersona }),
      connectWallet: () => {
        const { activePersona, sessions, users } = get();
        const userId = PERSONA_USER[activePersona];
        const user = users.find((u) => u.id === userId);
        let address = sessions[activePersona].address;
        if (!address) {
          address = activePersona === "new" ? ADDR.nova : ADDR.guest;
        }
        if (user && activePersona === "new" && !get().wallets.some((w) => w.userId === user.id)) {
          address = ADDR.nova;
        }
        set({
          sessions: {
            ...sessions,
            [activePersona]: { walletConnected: true, address },
          },
        });
      },
      disconnectWallet: () => {
        const { activePersona, sessions } = get();
        set({
          sessions: {
            ...sessions,
            [activePersona]: { ...sessions[activePersona], walletConnected: false },
          },
        });
      },
      switchToBase: () => set({ flags: { ...get().flags, wrongNetwork: false } }),
      setWrongNetwork: (wrongNetwork) => set({ flags: { ...get().flags, wrongNetwork } }),
      setRejectTx: (rejectTx) => set({ flags: { ...get().flags, rejectTx } }),
      resetDemo: () => set(createSeed()),
      signOut: () => set({ activePersona: "funder" }),
      signInEmail: (email) => {
        const user = get().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!user) return false;
        const persona = (Object.keys(PERSONA_USER) as Persona[]).find((p) => PERSONA_USER[p] === user.id);
        if (!persona) return false;
        set({ activePersona: persona });
        return true;
      },
      signUp: ({ name, email }) => {
        set((s) => ({
          activePersona: "new",
          users: s.users.map((u) =>
            u.id === "user_nova"
              ? {
                  ...u,
                  name: name || u.name,
                  email,
                  emailVerified: false,
                  onboardingComplete: false,
                  hasGithub: false,
                  login: null,
                }
              : u,
          ),
        }));
      },
      fund: ({ repoId, token, amount, from, displayName }) => {
        const { fee, maintainer } = splitAmount(amount);
        const txHash = fakeHash();
        const timestamp = Date.now();
        const seq = get().receiptSeq;
        const receipt: Receipt = {
          id: `ot-${seq}`,
          kind: "fund",
          number: `OT-${String(seq).padStart(5, "0")}`,
          repoId,
          token,
          amount,
          maintainerAmount: maintainer,
          feeAmount: fee,
          from,
          txHash,
          timestamp,
        };
        const name = displayName?.trim();
        set((s) => {
          const seen = new Set(
            s.fundings.filter((f) => f.repoId === repoId).map((f) => f.tipperAddress.toLowerCase()),
          );
          const fresh = !seen.has(from.toLowerCase());
          const owner = s.repos.find((r) => r.repoId === repoId)?.owner ?? repoId.split("/")[0];
          const maintainerUser = s.users.find((u) => u.login === owner);
          const usd = tokenUsd(amount, token);
          return {
            receiptSeq: seq + 1,
            receipts: [receipt, ...s.receipts],
            fundings: [
              {
                id: uid("f"),
                tipperAddress: from,
                displayName: name || s.displayNames[from],
                repoId,
                token,
                amount,
                feeAmount: fee,
                timestamp,
                txHash,
              },
              ...s.fundings,
            ],
            repos: (s.repos.some((r) => r.repoId === repoId)
              ? s.repos
              : [...s.repos, placeholderRepo(repoId.split("/")[0] ?? "unknown", repoId.split("/")[1] ?? repoId)]
            ).map((r) =>
              r.repoId === repoId
                ? {
                    ...r,
                    fundedUsd: r.fundedUsd + usd,
                    funderCount: r.funderCount + (fresh ? 1 : 0),
                  }
                : r,
            ),
            balances: {
              ...s.balances,
              [from]: {
                ETH: token === "ETH" ? (s.balances[from]?.ETH ?? 0) - amount : s.balances[from]?.ETH ?? 0,
                USDC: token === "USDC" ? (s.balances[from]?.USDC ?? 0) - amount : s.balances[from]?.USDC ?? 0,
              },
            },
            displayNames: name ? { ...s.displayNames, [from]: name } : s.displayNames,
            walletTxs: [
              {
                id: uid("wt"),
                walletAddress: from,
                kind: "fund",
                repoId,
                token,
                amount,
                to: repoId,
                status: "confirmed",
                txHash,
                createdAt: timestamp,
                gasSponsored: from === ADDR.vercel || from === ADDR.kofi,
              },
              ...s.walletTxs,
            ],
            notifications: maintainerUser
              ? [
                  {
                    id: uid("n"),
                    userId: maintainerUser.id,
                    type: "funding_received" as const,
                    title: "Funding received",
                    body: `${name || "A funder"} funded ${repoTitle(repoId)} with ${amount} ${token}.`,
                    read: false,
                    txHash,
                    createdAt: timestamp,
                  },
                  ...s.notifications,
                ]
              : s.notifications,
          };
        });
        return receipt;
      },
      claim: ({ repoId, from, tokens }) => {
        const s = get();
        const receipts: Receipt[] = [];
        const claims = [...s.claims];
        const walletTxs = [...s.walletTxs];
        const balances = { ...s.balances, [from]: { ...(s.balances[from] ?? { ETH: 0, USDC: 0 }) } };
        let seq = s.receiptSeq;
        const timestamp = Date.now();
        for (const token of tokens) {
          const amount = pendingOf(s, repoId, token);
          if (amount <= 0) continue;
          const txHash = fakeHash();
          const gross = amount / 0.95;
          const receipt: Receipt = {
            id: `ot-${seq}`,
            kind: "claim",
            number: `OT-${String(seq).padStart(5, "0")}`,
            repoId,
            token,
            amount: gross,
            maintainerAmount: amount,
            feeAmount: gross - amount,
            from,
            txHash,
            timestamp,
          };
          seq += 1;
          receipts.push(receipt);
          claims.unshift({
            id: uid("c"),
            repoId,
            payoutAddress: from,
            token,
            amount,
            timestamp,
            txHash,
          });
          balances[from] = {
            ...balances[from],
            [token]: (balances[from]?.[token] ?? 0) + amount,
          };
          walletTxs.unshift({
            id: uid("wt"),
            walletAddress: from,
            kind: "claim",
            repoId,
            token,
            amount,
            status: "confirmed",
            txHash,
            createdAt: timestamp,
            gasSponsored: true,
          });
        }
        const owner = s.repos.find((r) => r.repoId === repoId)?.owner;
        const maintainerUser = s.users.find((u) => u.login === owner);
        set({
          claims,
          balances,
          walletTxs,
          receiptSeq: seq,
          receipts: [...receipts, ...s.receipts],
          notifications: maintainerUser
            ? [
                {
                  id: uid("n"),
                  userId: maintainerUser.id,
                  type: "claim_submitted",
                  title: "Claim confirmed",
                  body: `Claimed ${tokens.join(" and ")} from ${repoTitle(repoId)}.`,
                  read: false,
                  txHash: receipts[0]?.txHash,
                  createdAt: timestamp,
                },
                ...s.notifications,
              ]
            : s.notifications,
        });
        return receipts;
      },
      verifyRepo: (userId, repoId) =>
        set((s) => ({
          verified: {
            ...s.verified,
            [userId]: Array.from(new Set([...(s.verified[userId] ?? []), repoId])),
          },
        })),
      registerRepo: ({ repoId, payoutAddress, from }) => {
        const txHash = fakeHash();
        const timestamp = Date.now();
        set((s) => ({
          repos: s.repos.some((r) => r.repoId === repoId)
            ? s.repos.map((r) =>
                r.repoId === repoId
                  ? { ...r, registered: true, payoutAddress, registeredAt: timestamp }
                  : r,
              )
            : s.repos,
          walletTxs: [
            {
              id: uid("wt"),
              walletAddress: from,
              kind: "register",
              repoId,
              status: "confirmed",
              txHash,
              createdAt: timestamp,
              gasSponsored: true,
            },
            ...s.walletTxs,
          ],
        }));
        const [owner, name] = repoId.split("/");
        if (owner && name && !get().repos.some((r) => r.repoId === repoId)) {
          set((s) => ({
            repos: [
              {
                repoId,
                owner,
                name,
                description: "Registered from GitHub.",
                registered: true,
                payoutAddress,
                registeredAt: timestamp,
                summary: "Registered on Opentip. Funds are held by the contract on Base until maintainers claim.",
                links: [{ label: "GitHub", href: `https://github.com/${repoId}` }],
                hidden: false,
                icon: name.slice(0, 1).toUpperCase(),
                language: "TypeScript",
                stars: 0,
                fundedUsd: 0,
                funderCount: 0,
                openingPending: { ETH: 0, USDC: 0 },
              },
              ...s.repos,
            ],
          }));
        }
        return txHash;
      },
      hideRepo: (repoId, hidden) =>
        set((s) => ({
          repos: s.repos.map((r) => (r.repoId === repoId ? { ...r, hidden } : r)),
        })),
      updateProfile: (userId, patch) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === userId ? { ...u, ...patch, id: u.id } : u)),
        })),
      connectGithub: (userId) =>
        set((s) => ({
          users: s.users.map((u) =>
            u.id === userId ? { ...u, hasGithub: true, login: u.login ?? "nova", github: u.github || "nova" } : u,
          ),
        })),
      createSmartWallet: (userId) => {
        const stem = userId.replace("user_", "").padEnd(8, "a").slice(0, 8);
        const trimmed = `0x${stem}${"0".repeat(28)}5a17`;
        set((s) => ({
          wallets: [
            ...s.wallets.map((w) => (w.userId === userId ? { ...w, isPrimary: false } : w)),
            {
              id: uid("w"),
              userId,
              address: trimmed,
              walletType: "smart" as const,
              isPrimary: true,
            },
          ],
          balances: { ...s.balances, [trimmed]: s.balances[trimmed] ?? { ETH: 0.02, USDC: 0 } },
          sessions: {
            ...s.sessions,
            [s.activePersona]: { walletConnected: true, address: trimmed },
          },
        }));
        return trimmed;
      },
      linkExternalWallet: (userId, address) =>
        set((s) => ({
          wallets: s.wallets.some((w) => w.address.toLowerCase() === address.toLowerCase())
            ? s.wallets
            : [
                ...s.wallets,
                { id: uid("w"), userId, address, walletType: "eoa" as const, isPrimary: s.wallets.every((w) => w.userId !== userId) },
              ],
        })),
      setPrimaryWallet: (userId, walletId) =>
        set((s) => ({
          wallets: s.wallets.map((w) =>
            w.userId === userId ? { ...w, isPrimary: w.id === walletId } : w,
          ),
        })),
      completeOnboarding: (userId) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === userId ? { ...u, onboardingComplete: true } : u)),
        })),
      markEmailVerified: (userId) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === userId ? { ...u, emailVerified: true } : u)),
        })),
      updatePolicy: (userId, patch) =>
        set((s) => ({
          policies: { ...s.policies, [userId]: { ...s.policies[userId], ...patch } },
        })),
      addRecipient: (userId, address) =>
        set((s) => {
          const policy = s.policies[userId];
          if (!policy) return s;
          return {
            policies: {
              ...s.policies,
              [userId]: {
                ...policy,
                permittedRecipients: Array.from(new Set([...policy.permittedRecipients, address])),
              },
            },
          };
        }),
      removeRecipient: (userId, address) =>
        set((s) => {
          const policy = s.policies[userId];
          if (!policy) return s;
          return {
            policies: {
              ...s.policies,
              [userId]: {
                ...policy,
                permittedRecipients: policy.permittedRecipients.filter((a) => a !== address),
              },
            },
          };
        }),
      setNotifPermission: (userId, permission) =>
        set((s) => ({
          notifPrefs: {
            ...s.notifPrefs,
            [userId]: { ...s.notifPrefs[userId], permission, push: permission === "granted" },
          },
        })),
      updateNotifPrefs: (userId, patch) =>
        set((s) => {
          const current = s.notifPrefs[userId];
          return {
            notifPrefs: {
              ...s.notifPrefs,
              [userId]: {
                ...current,
                ...patch,
                types: { ...current.types, ...(patch.types ?? {}) },
              },
            },
          };
        }),
      markRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllRead: (userId) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n)),
        })),
      clearNotifications: (userId) =>
        set((s) => ({
          notifications: s.notifications.filter((n) => n.userId !== userId),
        })),
      sendFromWallet: ({ from, to, token, amount, sponsored }) => {
        const txHash = fakeHash();
        const timestamp = Date.now();
        set((s) => ({
          balances: {
            ...s.balances,
            [from]: {
              ETH: token === "ETH" ? (s.balances[from]?.ETH ?? 0) - amount : s.balances[from]?.ETH ?? 0,
              USDC: token === "USDC" ? (s.balances[from]?.USDC ?? 0) - amount : s.balances[from]?.USDC ?? 0,
            },
          },
          walletTxs: [
            {
              id: uid("wt"),
              walletAddress: from,
              kind: "send",
              token,
              amount,
              to,
              status: "confirmed",
              txHash,
              createdAt: timestamp,
              gasSponsored: sponsored,
            },
            ...s.walletTxs,
          ],
        }));
        return { txHash };
      },
      saveDisplayName: (address, name) =>
        set((s) => ({ displayNames: { ...s.displayNames, [address]: name } })),
    }),
    {
      name: "opentip-ledger-v2",
      version: 2,
      skipHydration: true,
      partialize: (state) => {
        const data = { ...state } as Partial<DemoState>;
        (Object.keys(data) as (keyof DemoState)[]).forEach((key) => {
          if (typeof data[key] === "function") delete data[key];
        });
        return data as DemoState;
      },
      merge: (persisted, current) => {
        const saved = persisted as Partial<DemoData> | undefined;
        if (!saved?.repos || !saved.sessions) return current;
        return { ...current, ...saved };
      },
    },
  ),
);

export function pendingOf(state: DemoData, repoId: string, token: Token) {
  const repo = state.repos.find((r) => r.repoId === repoId);
  const opening = repo?.openingPending[token] ?? 0;
  const funded = state.fundings
    .filter((f) => f.repoId === repoId && f.token === token)
    .reduce((sum, f) => sum + (f.amount - f.feeAmount), 0);
  const claimed = state.claims
    .filter((c) => c.repoId === repoId && c.token === token)
    .reduce((sum, c) => sum + c.amount, 0);
  return Math.max(0, round8(opening + funded - claimed));
}

function round8(n: number) {
  return Math.round(n * 1e8) / 1e8;
}

export function pendingUsd(state: DemoData, repoId: string) {
  return tokenUsd(pendingOf(state, repoId, "USDC"), "USDC") + tokenUsd(pendingOf(state, repoId, "ETH"), "ETH");
}
