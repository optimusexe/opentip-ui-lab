import type { Metadata } from "next";
import { DocsFrame } from "@/components/doc-article";

export const metadata: Metadata = { title: "Smart wallet" };

export default function Page() {
  return <DocsFrame slug="smart-wallet" />;
}
