import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function AppShell({
  children,
  center,
  footer = true,
}: {
  children: React.ReactNode;
  center?: string;
  footer?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader center={center} />
      <div className="mx-auto flex w-full min-w-0 max-w-[1120px] flex-1 flex-col px-4 py-8">{children}</div>
      {footer ? <SiteFooter /> : null}
    </div>
  );
}
