import type { Metadata } from "next";
import { DocsFrame } from "@/components/doc-article";

export const metadata: Metadata = { title: "Architecture" };

export default function Page() {
  return <DocsFrame slug="architecture" />;
}
