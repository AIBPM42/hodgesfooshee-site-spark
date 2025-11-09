"use client";
import { useEffect, useState } from "react";

export function useChartTheme() {
  const [colors, setColors] = useState({
    axis: "#cbd5e1",
    grid: "#e2e8f0",
    line1: "#ff7a1a",
    bar1: "#ff7a1a",
    bar2: "#3aa655",
    text: "#334155",
  });

  useEffect(() => {
    const get = (v: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(v).trim();

    setColors({
      axis: get("--axis"),
      grid: get("--grid"),
      line1: get("--line-1"),
      bar1: get("--bar-1"),
      bar2: get("--bar-2"),
      text: get("--text-2"),
    });
  }, []);

  return colors;
}
