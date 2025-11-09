"use client";

import { motion } from "framer-motion";

export function LiveIndicator({ lastUpdate }: { lastUpdate?: string }) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="w-2 h-2 rounded-full bg-emerald-400"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <span className="text-xs text-white/60">
        Live {lastUpdate ? `• Updated ${lastUpdate}` : ""}
      </span>
    </div>
  );
}
