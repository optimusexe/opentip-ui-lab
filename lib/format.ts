import { ETH_USD, FEE_RATE } from "@/lib/constants";
import type { Token } from "@/lib/mock/types";

export function shortAddr(addr: string) {
  if (!addr) return "";
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function shortHash(hash: string) {
  return shortAddr(hash);
}

/** Project name only, matching Opentip's capitalize(repo). Paths stay owner/repo. */
export function repoTitle(repoIdOrName: string) {
  const slug = repoIdOrName.includes("/") ? (repoIdOrName.split("/")[1] ?? repoIdOrName) : repoIdOrName;
  if (!slug) return repoIdOrName;
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function tokenUsd(amount: number, token: Token) {
  return token === "USDC" ? amount : amount * ETH_USD;
}

export function formatUsd(amount: number, digits = 2) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatToken(amount: number, token: Token) {
  if (token === "USDC") {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  const digits = amount >= 1 ? 3 : 4;
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatAmount(amount: number, token: Token) {
  return `${formatToken(amount, token)} ${token}`;
}

export function splitAmount(amount: number) {
  const fee = round(amount * FEE_RATE);
  const maintainer = round(amount - fee);
  return { fee, maintainer };
}

function round(n: number) {
  return Math.round(n * 1e8) / 1e8;
}

export function relTime(ts: number, now = Date.now()) {
  const s = Math.max(0, now - ts) / 1000;
  if (s < 45) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  const d = Math.floor(s / 86400);
  return `${d}d`;
}

export function formatStamp(ts: number) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(ts));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("day")} ${get("month")} ${get("year")}, ${get("hour")}:${get("minute")}`;
}

export function fakeHash() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return `0x${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}

export function minError(amount: number, token: Token) {
  if (!Number.isFinite(amount) || amount <= 0) return "Enter an amount";
  if (tokenUsd(amount, token) < 1) return "Minimum is $1";
  return null;
}
