"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ModeToggle(){
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={()=> setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-[var(--radius-pill)] border transition-all"
      style={{background:"color-mix(in oklab, var(--surface) 90%, transparent)", borderColor:"var(--border)"}}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={16}/> : <Moon size={16}/>}
      <span className="text-sm">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
