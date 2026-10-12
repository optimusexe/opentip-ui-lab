import type { Metadata } from "next";
import { DocsFrame } from "@/components/doc-article";

export const metadata: Metadata = { title: "Contributing" };

export default function Page() {
  return <DocsFrame slug="contributing" />;
}
