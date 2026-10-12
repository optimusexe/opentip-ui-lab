"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { DevPanel } from "@/components/dev-panel";
import { CommandSearch } from "@/components/command-search";
import { useDemo } from "@/lib/mock/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    Promise.resolve(useDemo.persist.rehydrate()).finally(() => {
      if (live) setReady(true);
    });
    return () => {
      live = false;
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        {ready ? children : <div className="min-h-screen bg-background" />}
        {ready ? <Toaster /> : null}
        {ready ? <CommandSearch /> : null}
        {ready ? <DevPanel /> : null}
      </TooltipProvider>
    </ThemeProvider>
  );
}
