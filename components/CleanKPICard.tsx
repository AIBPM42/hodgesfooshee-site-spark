"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CleanKPICardProps {
  title: string;
  value: number | string;
  change?: number;
  subtitle?: string;
  delay?: number;
}

/**
 * Clean, professional KPI card
 * - Subtle entrance animation
 * - Number counter (optional)
 * - Minimal hover effect (just slight opacity change)
 * - No sparkles, no rotation, no glow
 */
export function CleanKPICard({
  title,
  value,
  change,
  subtitle,
  delay = 0,
}: CleanKPICardProps) {
  const [displayValue, setDisplayValue] = useState(
    typeof value === "number" ? 0 : value
  );

  // Number counter (only if value is a number)
  useEffect(() => {
    if (typeof value !== "number") {
      setDisplayValue(value);
      return;
    }

    let current = 0;
    const target = value;
    const duration = 1000;
    const steps = 50;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayValue(target);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const formatValue = (val: number | string) => {
    if (typeof val === "string") return val;
    return val.toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      whileHover={{ opacity: 0.9 }} // Very subtle hover
      className="glass p-6"
    >
      {/* Title */}
      <div className="text-sm text-white/70 mb-3">{title}</div>

      {/* Value */}
      <div className="text-3xl font-semibold mb-2">
        {formatValue(displayValue)}
      </div>

      {/* Change indicator (optional) */}
      {change !== undefined && (
        <div
          className={`text-sm ${
            change >= 0 ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {change >= 0 ? "↗" : "↘"} {Math.abs(change).toFixed(1)}%
          {subtitle && <span className="text-white/50 ml-1">{subtitle}</span>}
        </div>
      )}
    </motion.div>
  );
}
