"use client";
import { useTheme } from "next-themes";
import { MoonStar } from "lucide-react";
import { useEffect, useState } from "react";

export function ModeToggle(){
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted,setMounted]=useState(false);
  useEffect(()=>setMounted(true),[]);

  if(!mounted) return null;
  const isDark=resolvedTheme==="dark";

  return(
    <button
      aria-label="Toggle dark mode"
      onClick={()=>setTheme(isDark?"light":"dark")}
      className="rounded-full p-2 border border-white/10 backdrop-blur-xl shadow-glass hover:bg-white/10 transition"
      style={{backgroundColor:'rgba(var(--bg-2-rgb, 12, 15, 21), 0.7)'}}
    >
      <MoonStar className="w-5 h-5"/>
    </button>
  );
}
