import type { Metadata } from "next";
import { DocsFrame } from "@/components/doc-article";

export const metadata: Metadata = { title: "Troubleshooting" };

export default function Page() {
  return <DocsFrame slug="troubleshooting" />;
}
