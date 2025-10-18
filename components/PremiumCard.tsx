"use client";
import { motion } from "framer-motion";

export function PremiumCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl bg-[linear-gradient(180deg,rgba(255,255,255,.92),rgba(255,255,255,.86))] border border-white/80 shadow-[var(--shadow-ambient),var(--shadow-key)] [box-shadow:inset_0_1px_0_rgba(255,255,255,.65),var(--shadow-ambient),var(--shadow-key)] p-6 md:p-7 transition-transform transition-shadow hover:shadow-[var(--shadow-lift)] focus-within:shadow-[var(--shadow-lift)]"
    >
      <div className="rounded-2xl ring-0 hover:ring-2 focus-within:ring-2 ring-[var(--plum-500)]/15 transition-all">
        {children}
      </div>
    </motion.div>
  );
}
