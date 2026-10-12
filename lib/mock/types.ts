export type Token = "ETH" | "USDC";
export type Persona = "funder" | "maintainer" | "unregistered" | "new";

export type Repo = {
  repoId: string;
  owner: string;
  name: string;
  description: string;
  registered: boolean;
  payoutAddress?: string;
  registeredAt?: number;
  summary: string;
  links: { label: string; href: string }[];
  hidden: boolean;
  icon: string;
  language: string;
  stars: number;
  fundedUsd: number;
  funderCount: number;
  openingPending: { ETH: number; USDC: number };
};

export type Funding = {
  id: string;
  tipperAddress: string;
  displayName?: string;
  repoId: string;
  token: Token;
  amount: number;
  feeAmount: number;
  timestamp: number;
  txHash: string;
};

export type Claim = {
  id: string;
  repoId: string;
  payoutAddress: string;
  token: Token;
  amount: number;
  timestamp: number;
  txHash: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  login: string | null;
  bio: string;
  website: string;
  twitter: string;
  discord: string;
  telegram: string;
  farcaster: string;
  github: string;
  pfpHue: number;
  headerHue: number;
  onboardingComplete: boolean;
  emailVerified: boolean;
  hasGithub: boolean;
  hasPassword: boolean;
};

export type Wallet = {
  id: string;
  userId: string;
  address: string;
  walletType: "eoa" | "smart";
  isPrimary: boolean;
  subAccountAddress?: string;
};

export type Balances = Record<string, { ETH: number; USDC: number }>;

export type WalletTx = {
  id: string;
  walletAddress: string;
  kind: "fund" | "claim" | "send" | "register";
  repoId?: string;
  token?: Token;
  amount?: number;
  to?: string;
  status: "pending" | "confirmed" | "rejected";
  txHash?: string;
  createdAt: number;
  gasSponsored?: boolean;
};

export type AppNotification = {
  id: string;
  userId: string;
  type: "funding_received" | "claim_available" | "funding_sent" | "claim_submitted";
  title: string;
  body: string;
  read: boolean;
  txHash?: string;
  createdAt: number;
};

export type Policy = {
  pauseAll: boolean;
  dailyLimitUsd: number;
  dailyLimitEnabled: boolean;
  perTxLimitUsd: number;
  perTxLimitEnabled: boolean;
  permittedRecipientsEnabled: boolean;
  permittedRecipients: string[];
};

export type NotifPrefs = {
  push: boolean;
  email: boolean;
  permission: "default" | "granted" | "denied";
  types: {
    funding_received: boolean;
    claim_available: boolean;
    funding_sent: boolean;
    claim_submitted: boolean;
  };
};

export type GithubRepo = {
  owner: string;
  name: string;
  description: string;
  language: string;
  stars: number;
};

export type Receipt = {
  id: string;
  kind: "fund" | "claim";
  number: string;
  repoId: string;
  token: Token;
  amount: number;
  maintainerAmount: number;
  feeAmount: number;
  from: string;
  txHash: string;
  timestamp: number;
};

export type PersonaSession = {
  walletConnected: boolean;
  address: string | null;
};

export type DemoData = {
  repos: Repo[];
  fundings: Funding[];
  claims: Claim[];
  users: User[];
  wallets: Wallet[];
  balances: Balances;
  walletTxs: WalletTx[];
  notifications: AppNotification[];
  policies: Record<string, Policy>;
  notifPrefs: Record<string, NotifPrefs>;
  githubRepos: Record<string, GithubRepo[]>;
  displayNames: Record<string, string>;
  receipts: Receipt[];
  verified: Record<string, string[]>;
  receiptSeq: number;
  activePersona: Persona;
  sessions: Record<Persona, PersonaSession>;
  flags: { wrongNetwork: boolean; rejectTx: boolean };
};
