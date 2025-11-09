"use client";
import { motion } from "framer-motion";

type KpiData = {
  label: string;
  value: string;
  sub: string;
  colorLight: string;
  colorDark: string;
  glow: string;
};

export default function KpiRow({ kpis }: { kpis: KpiData[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {kpis.map((kpi) => (
        <motion.div
          key={kpi.label}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className={[
            // Base glass card
            "relative overflow-hidden rounded-2xl p-5",
            "backdrop-blur-md border",
            // Light / Dark surfaces
            "bg-gradient-to-br",
            kpi.colorLight,
            "dark:from-transparent dark:to-transparent",
            "border-white/10 dark:border-white/5",
            // Subtle ring that changes in dark
            "ring-1 ring-black/5 dark:ring-[1.5px] dark:ring-[#F59E0B]/20",
            // Soft shadow + stronger glow on hover
            "shadow-[0_8px_30px_rgba(0,0,0,0.06)]",
            "hover:" + kpi.glow,
          ].join(" ")}
        >
          {/* Dark-mode "black glass" gradient layer */}
          <div className="pointer-events-none absolute inset-0 hidden dark:block">
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${kpi.colorDark}`} />
            {/* faint vignette */}
            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(120%_70%_at_50%_0%,rgba(255,183,77,0.08),rgba(0,0,0,0)_60%)]" />
            {/* micro-noise texture (keeps it premium, not flat) */}
            <div
              className="absolute inset-0 opacity-[0.08] mix-blend-soft-light"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='64' height='64' filter='url(%23n)' opacity='0.6'/></svg>\")",
              }}
            />
          </div>

          {/* Light-mode soft wash for depth */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-white/8 dark:bg-transparent" />

          {/* Content */}
          <div className="relative flex flex-col gap-2">
            <div className="text-[11px] uppercase tracking-wide text-[var(--sub)]">
              {kpi.label}
            </div>
            <div className="text-[28px] leading-none font-semibold text-[var(--text)]">
              {kpi.value}
            </div>
            <div className="text-sm text-[var(--sub)]">{kpi.sub}</div>
          </div>

          {/* Gold/Orange top edge glint in dark mode */}
          <div className="pointer-events-none absolute -top-px left-6 right-6 h-px rounded-full bg-gradient-to-r from-transparent via-[#F59E0B]/50 to-transparent opacity-0 dark:opacity-100" />
        </motion.div>
      ))}
    </div>
  );
}
