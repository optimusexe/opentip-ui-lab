export const CONTRACT_ADDRESS = "0xAf1b70F5BdDFfD64c5D7B971bA670e1ff65cB1bC";
export const ETH_USD = 3200;
export const FEE_RATE = 0.05;
export const FEE_CAP = 0.1;
export const MIN_USD = 1;

export const ADDR = {
  guest: "0x7a3f0000000000000000000000000000000091c2",
  ada: "0x19be0000000000000000000000000000000004aa",
  adaName: "0xada1000000000000000000000000000000000ada",
  lin: "0xc0de0000000000000000000000000000000077e1",
  five: "0x5f0200000000000000000000000000000000b3d9",
  anon: "0x61aa00000000000000000000000000000000e905",
  kofiFunder: "0xb8c3000000000000000000000000000000000d44",
  vercel: "0x5e2c00000000000000000000000000000000b41e",
  vercelSub: "0x5e2d00000000000000000000000000000000aa01",
  kofi: "0xf01a00000000000000000000000000000000c0de",
  nova: "0x40aa00000000000000000000000000000000e0a1",
  treasury: "0x0eef00000000000000000000000000000000feee",
} as const;

export function hx(prefix: string, suffix: string) {
  const body = `${prefix}${"0".repeat(64 - prefix.length - suffix.length)}${suffix}`;
  return `0x${body}`;
}

export const TX = {
  ada: hx("4e1c", "a90f"),
  eth: hx("9b2d", "17c3"),
  lin: hx("82fa", "c4d1"),
  five: hx("d7e0", "3b62"),
  anon: hx("61aa", "e905"),
  kofi: hx("b8c3", "0d44"),
  claim: hx("c1a1", "09e2"),
  seedReceipt: hx("4e1c", "a90f"),
};
