import { cn } from "cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <span className="size-2.5 rounded-full bg-primary" aria-hidden />
      Opentip
    </span>
  );
}
