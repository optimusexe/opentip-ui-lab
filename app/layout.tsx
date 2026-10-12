import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { cn } from "cn";
import { Providers } from "@/components/providers";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "800",
  variable: "--font-bricolage",
});

export const metadata: Metadata = {
  title: {
    default: "Opentip | Funding for open source",
    template: "%s | Opentip",
  },
  description:
    "Funding for open source, from the open market. Maintainers keep 95%. Fund any GitHub repo on Base. No account needed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(sans.variable, mono.variable, display.variable)} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
