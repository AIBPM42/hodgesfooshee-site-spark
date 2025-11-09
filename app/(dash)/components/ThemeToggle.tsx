"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const d = localStorage.getItem("theme") === "dark";
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <button
      onClick={toggle}
      className="ring-token inline-flex items-center gap-2 rounded-2xl border border-black/10 px-3 py-1.5 text-sm
                 bg-white/80 backdrop-blur-18 hover:bg-white shadow-glass
                 dark:bg-ink-900/60 dark:text-white dark:border-white/10 dark:hover:bg-ink-900/80">
      <span className="text-xs">{dark ? "☀︎ Light" : "🌙 Dark"}</span>
    </button>
  );
}
