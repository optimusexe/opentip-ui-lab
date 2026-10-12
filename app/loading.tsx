export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-[1120px] flex-col gap-3 px-4 py-16">
      <div className="h-8 w-40 animate-pulse rounded bg-muted" />
      <div className="h-24 animate-pulse rounded-[10px] bg-muted" />
      <div className="h-40 animate-pulse rounded-[10px] bg-muted" />
    </div>
  );
}
