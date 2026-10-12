import Link from "next/link";
import { docs, docNav } from "@/lib/docs";

export function DocsFrame({ slug }: { slug: string }) {
  const page = docs.find((item) => item.slug === slug) ?? docs[0];
  return (
    <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)]">
      <nav className="flex flex-col gap-1" aria-label="Docs">
        {docNav.map(([label, href]) => (
          <Link key={href} href={href} className="rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
            {label}
          </Link>
        ))}
      </nav>
      <article className="max-w-2xl">
        <h1 className="font-display text-4xl">{page.title}</h1>
        <p className="mt-3 text-muted-foreground">{page.lede}</p>
        {page.sections.map((section) => (
          <section key={section.heading} className="mt-8 border-t border-border pt-6">
            <h2 className="text-xl font-medium">{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="mt-2 text-sm leading-relaxed text-muted-foreground">{paragraph}</p>
            ))}
          </section>
        ))}
      </article>
    </div>
  );
}
