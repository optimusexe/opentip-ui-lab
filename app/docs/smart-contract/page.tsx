import type { Metadata } from "next";
import { DocsFrame } from "@/components/doc-article";

export const metadata: Metadata = { title: "Smart contract" };

export default function Page() {
  return <DocsFrame slug="smart-contract" />;
}
