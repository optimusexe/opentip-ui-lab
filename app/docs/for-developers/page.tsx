import type { Metadata } from "next";
import { DocsFrame } from "@/components/doc-article";

export const metadata: Metadata = { title: "For maintainers" };

export default function Page() {
  return <DocsFrame slug="for-developers" />;
}
