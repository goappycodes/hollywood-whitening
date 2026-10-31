"use client";

import { useEffect } from "react";

/** Moves each panel's pearl sheen to follow the cursor. */
export function Sheen() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const tile = (e.target as Element | null)?.closest?.<HTMLElement>(".hd-tile");
      if (!tile) return;
      const rect = tile.getBoundingClientRect();
      tile.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      tile.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
