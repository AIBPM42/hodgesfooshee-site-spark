"use client";
import { useTheme } from "next-themes";

/** Unified palette + strokes so all charts feel related and readable */
export function useChartTheme() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return {
    // text & guides
    axis: dark ? "#A8B0BE" : "#666C76",
    grid: dark ? "rgba(255,255,255,.06)" : "rgba(21,23,24,.08)",
    tick: dark ? "#D7DBE2" : "#262A2E",
    // brand series
    primary: "#FF7E0A",   // orange
    secondary: "#6E5AA3", // plum
    success: "#78B84B",   // green
    neutral: dark ? "#C9CDD4" : "#9AA1AC",
    // confidence bands
    bandHi: dark ? "rgba(242,201,76,.22)" : "rgba(242,201,76,.32)",
    bandLo: dark ? "rgba(120,184,75,.18)" : "rgba(120,184,75,.26)",
    // fills
    panel: "color-mix(in oklab, var(--surface) 94%, transparent)",
    border: "var(--border)",
  };
}
