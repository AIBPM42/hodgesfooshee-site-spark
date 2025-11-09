'use client'
import { useEffect, useState } from "react";

export function ThemeToggle(){
  const [dark, setDark] = useState(false);

  useEffect(()=>{
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  },[]);

  useEffect(()=>{
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  },[dark]);

  return (
    <button
      className="glass px-3 py-1.5 text-sm focus-visible:outline-none hover:bg-opacity-80 transition-all"
      onClick={()=>setDark(v=>!v)}
      aria-pressed={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}
