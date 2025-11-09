"use client";
import { useTheme } from "next-themes";

/* Shared palette for Recharts axes/grid/series */
export function useChartTheme(){
  const { theme } = useTheme();
  const dark = theme === "dark";
  return {
    axis: dark ? "#A8B0BE" : "#666C76",
    grid: dark ? "rgba(255,255,255,.06)" : "rgba(21,23,24,.08)",
    primary: "var(--brand-orange)",
    secondary: "var(--brand-plum)",
    success: "var(--brand-green)",
    bandHi: dark ? "rgba(242,201,76,.20)" : "rgba(242,201,76,.35)",
    bandLo: dark ? "rgba(120,184,75,.18)" : "rgba(120,184,75,.25)",
  };
}
