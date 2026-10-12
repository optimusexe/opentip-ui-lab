import { cn } from "cn";

export function SplitBar({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex h-1.5 w-full overflow-hidden rounded-full bg-fee", className)}
      role="img"
      aria-label="95 percent to maintainers and 5 percent platform fee"
    >
      <div className="h-full bg-primary" style={{ width: "95%" }} />
      <div className="h-full bg-transparent" style={{ width: "5%" }} />
    </div>
  );
}
