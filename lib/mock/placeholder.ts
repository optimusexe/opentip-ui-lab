import type { Repo } from "@/lib/mock/types";

export function placeholderRepo(owner: string, name: string, registered = false): Repo {
  const repoId = `${owner}/${name}`;
  return {
    repoId,
    owner,
    name,
    description: "Opened from a repository link.",
    registered,
    summary:
      "This repository is not in the seeded ledger. A maintainer can register it.",
    links: [{ label: "GitHub", href: `https://github.com/${repoId}` }],
    hidden: false,
    icon: name.slice(0, 1).toUpperCase() || "?",
    language: "Unknown",
    stars: 0,
    fundedUsd: 0,
    funderCount: 0,
    openingPending: { ETH: 0, USDC: 0 },
  };
}
