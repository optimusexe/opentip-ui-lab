import type { Metadata } from "next";
import { DocsFrame } from "@/components/doc-article";

export const metadata: Metadata = { title: "Docs" };

export default function DocsHome() {
  return <DocsFrame slug="index" />;
}
