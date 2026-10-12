import type { Metadata } from "next";
import { DocsFrame } from "@/components/doc-article";

export const metadata: Metadata = { title: "Getting started" };

export default function Page() {
  return <DocsFrame slug="getting-started" />;
}
