import { SiteHeader } from "@/components/site-header";

export function AppShell({ children, center }: { children: React.ReactNode; center?: string }) {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader center={center} />
      <div className="mx-auto flex w-full min-w-0 max-w-[1120px] flex-1 flex-col px-4 py-8">{children}</div>
    </div>
  );
}
