"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UrlSwap } from "@/components/url-swap";
import { useDemo } from "@/lib/mock/store";

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const repos = useDemo((s) => s.repos);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    const openEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("opentip-search", openEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("opentip-search", openEvent);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>Find a repo</DialogTitle>
          <DialogDescription>Swap github.com for opentip.tech, or pick a page below.</DialogDescription>
        </DialogHeader>
        <UrlSwap compact onNavigate={() => setOpen(false)} />
        <ul className="max-h-64 overflow-auto">
          {repos
            .filter((repo) => !repo.hidden)
            .map((repo) => (
              <li key={repo.repoId}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => {
                    setOpen(false);
                    router.push(`/${repo.repoId}`);
                  }}
                >
                  <span className="font-mono text-[13px]">{repo.repoId}</span>
                  <span className="text-xs text-muted-foreground">{repo.registered ? "Registered" : "Unclaimed"}</span>
                </button>
              </li>
            ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
