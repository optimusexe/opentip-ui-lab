export type DocSection = { heading: string; body: string[] };
export type DocPage = { slug: string; title: string; lede: string; sections: DocSection[] };

const contract = "0xAf1b70F5BdDFfD64c5D7B971bA670e1ff65cB1bC";

export const docs: DocPage[] = [
  {
    slug: "index",
    title: "Documentation",
    lede: "Opentip turns a GitHub repository into a funding page on Base. Maintainers keep 95%. No account is required to fund.",
    sections: [
      {
        heading: "How it works",
        body: [
          "Find a repo at opentip.tech/owner/repo, or replace github.com with opentip.tech in any repository link.",
          "Connect a wallet, choose ETH or USDC, and confirm. The contract holds the funds. OAR is coming soon.",
          "A maintainer verifies GitHub access, registers a payout wallet, and claims whenever they want.",
        ],
      },
      {
        heading: "Quick facts",
        body: [
          "Platform fee: 5%, with a hard cap of 10%.",
          "Minimum: $1 per contribution.",
          "Network: Base. Contract: " + contract + ".",
          "Tokens: ETH and USDC are live. OAR is coming soon.",
        ],
      },
    ],
  },
  {
    slug: "getting-started",
    title: "Getting started",
    lede: "Fund an open-source repository. The flow takes less than a minute.",
    sections: [
      { heading: "Prerequisites", body: ["A wallet on Base, or an Opentip Smart Wallet.", "ETH or USDC on Base. OAR is coming soon.", "No Opentip account is required to fund."] },
      { heading: "Step 1 — Find a repo", body: ["Browse Repos, or open opentip.tech/{owner}/{repo}.", "Example: opentip.tech/vercel/next.js."] },
      { heading: "Step 2 — Connect your wallet", body: ["Choose Connect wallet on the funding page. Signed-in maintainers can use their smart wallet."] },
      { heading: "Step 3 — Choose a token and amount", body: ["USDC asks for an approval, then the funding transaction. The smart wallet can batch those.", "ETH is a single payment. The minimum is $1."] },
      { heading: "Step 4 — Fund", body: ["Confirm in the wallet. The receipt shows the 95/5 split and a transaction hash."] },
      { heading: "Display name", body: ["Add an optional name on the funding form. It is shown on the ledger instead of your address."] },
      { heading: "How fees work", body: ["A $100 contribution pays $95 to maintainers and $5 to the platform. The fee is taken by the contract and capped at 10%."] },
    ],
  },
  {
    slug: "for-developers",
    title: "For maintainers",
    lede: "Register a repository, then claim on your schedule.",
    sections: [
      { heading: "Create an account", body: ["Sign in with GitHub or email. Finish onboarding to create a smart wallet."] },
      { heading: "Verify ownership", body: ["Open your repo page and verify. If the signed-in login does not own the repo, verification fails. If no wallet is linked, link one first."] },
      { heading: "Register", body: ["Choose a payout wallet and register. The page can then be claimed by that wallet."] },
      { heading: "Claim", body: ["Pending balances are kept per token. Claim pays the maintainer share out of the contract. The 5% fee was already taken when the funding landed."] },
      { heading: "Profile", body: ["The dashboard profile editor sets the bio and links shown on /dev/{login}."] },
    ],
  },
  {
    slug: "smart-wallet",
    title: "Smart wallet",
    lede: "One address on every device, created during onboarding.",
    sections: [
      { heading: "What it is", body: ["The Opentip Smart Wallet is the default payout and spending account for a signed-in maintainer. Gas on sends can be sponsored."] },
      { heading: "Create it", body: ["Onboarding creates the wallet after GitHub is connected. If creation fails, try again."] },
      { heading: "Using it", body: ["Fund, claim, and send from the wallet page. Security rules can pause spending, cap amounts, and limit recipients."] },
      { heading: "Supported assets", body: ["ETH and USDC on Base. OAR is coming soon."] },
    ],
  },
  {
    slug: "smart-contract",
    title: "Smart contract",
    lede: "A non-custodial contract on Base holds funding until the registered payout wallet claims it.",
    sections: [
      { heading: "Address", body: [contract, "Anyone can read the contract. This demo does not send real transactions."] },
      { heading: "Pull payments", body: ["Funding increases a per-repo, per-token pending balance, minus the fee. Only the current payout address can claim that balance."] },
      { heading: "Owner key", body: ["The owner can pause funding, registrations, payout updates, and claims, set the fee up to 10%, and reassign a payout address. The owner cannot withdraw a maintainer’s pending balance."] },
    ],
  },
  {
    slug: "architecture",
    title: "Architecture",
    lede: "The production app is a Next.js frontend, an indexer, and the Base contract. This lab keeps the same shapes in the browser.",
    sections: [
      { heading: "Pieces", body: ["Frontend: funding pages, dashboard, wallet, docs.", "Indexer: funding, claims, and pending balances.", "Contract: custody and the 95/5 split."] },
      { heading: "This demo", body: ["State lives in localStorage. Reset demo restores the seed. There is no network, wallet, or payment call."] },
    ],
  },
  {
    slug: "api",
    title: "API",
    lede: "The production app exposes read endpoints for funding, repos, prices, and profiles. This demo does not call them.",
    sections: [
      { heading: "Reads", body: ["GET /api/tips?repoId=owner/repo", "GET /api/leaderboard", "GET /api/repos", "GET /api/prices", "GET /api/dev/{login}"] },
      { heading: "Shapes", body: ["A funding row has tipper address, repo id, token, amount, fee, timestamp, and tx hash.", "Pending balance is the sum of maintainer shares minus claims, per token."] },
    ],
  },
  {
    slug: "contributing",
    title: "Contributing",
    lede: "Opentip is open source. This UI lab is a separate mock and is not a patch to the production app.",
    sections: [
      { heading: "Production repo", body: ["Source lives at github.com/optimusexe/Opentip. The frontend is the Next.js app in frontend/."] },
      { heading: "This lab", body: ["Run npm install and npm run dev. No environment variables are required."] },
    ],
  },
  {
    slug: "resources",
    title: "Resources",
    lede: "Contracts, code, and contact points.",
    sections: [
      { heading: "Contract", body: [contract] },
      { heading: "GitHub", body: ["https://github.com/opentiphq", "https://github.com/optimusexe/Opentip"] },
      { heading: "Contact", body: ["support@opentip.tech", "https://x.com/opentip_tech"] },
    ],
  },
  {
    slug: "contacts",
    title: "Contact",
    lede: "Write to support@opentip.tech.",
    sections: [
      { heading: "What to include", body: ["The repo id, the transaction hash, and whether you were funding or claiming."] },
      { heading: "Security", body: ["Do not send a seed phrase. Opentip cannot recover a wallet or move a maintainer’s pending balance."] },
    ],
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    lede: "Common stops on the funding page, and what this demo lets you force.",
    sections: [
      { heading: "Wrong network", body: ["Funding, claiming, and registering require Base. Use the demo panel to force a wrong network, then switch back."] },
      { heading: "Minimum", body: ["Contributions under $1 are rejected before a transaction starts."] },
      { heading: "Rejected transaction", body: ["Turn on Reject next transaction in the demo panel to see the rejected state."] },
      { heading: "Not the owner", body: ["Verification checks the signed-in GitHub login against the repo owner."] },
      { heading: "Link a wallet first", body: ["Registration needs a linked payout wallet. New accounts hit this until onboarding creates one."] },
    ],
  },
];

export const docNav = [
  ["Overview", "/docs"],
  ["Getting started", "/docs/getting-started"],
  ["For maintainers", "/docs/for-developers"],
  ["Smart wallet", "/docs/smart-wallet"],
  ["Smart contract", "/docs/smart-contract"],
  ["Architecture", "/docs/architecture"],
  ["API", "/docs/api"],
  ["Contributing", "/docs/contributing"],
  ["Resources", "/docs/resources"],
  ["Contact", "/docs/contacts"],
  ["Troubleshooting", "/docs/troubleshooting"],
];
