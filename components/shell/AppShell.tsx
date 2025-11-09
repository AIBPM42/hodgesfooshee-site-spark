"use client";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "@/components/shell/ThemeToggle";

export default function AppShell({ nav, children }:{ nav: React.ReactNode; children: React.ReactNode }){
  const pathname = usePathname();
  return (
    <div className="min-h-screen text-[var(--text-strong)] bg-[var(--bg-canvas)]">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[var(--bg-card)]/90 backdrop-blur-18 dark:border-white/10">
        <div className="mx-auto flex w-[min(1400px,95%)] items-center justify-between px-3 py-2">
          <div className="font-semibold tracking-tight">Hodges & Fooshee — Market Intelligence</div>
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto flex w-[min(1400px,95%)] gap-6 py-4">
        <aside className="hidden w-64 shrink-0 border-r border-black/10 p-3 md:block dark:border-white/10">
          {nav}
        </aside>
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex-1"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
