"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "cn";

export function NumberTicker({
  value,
  format,
  className,
}: {
  value: number;
  format: (n: number) => string;
  className?: string;
}) {
  const [shown, setShown] = useState(value);
  const from = useRef(0);
  const started = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startValue = started.current ? from.current : 0;
    started.current = true;
    if (reduce) {
      from.current = value;
      setShown(value);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 700);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = startValue + (value - startValue) * eased;
      setShown(next);
      if (p < 1) frame = requestAnimationFrame(tick);
      else from.current = value;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span className={cn("font-mono tabular-nums", className)}>{format(shown)}</span>;
}
