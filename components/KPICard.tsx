"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Sparkline } from "./sparkline";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number; // Percentage change
  trend?: "up" | "down" | "stable";
  sparklineData?: number[];
  icon?: React.ReactNode;
  delay?: number;
}

export function KPICard({
  title,
  value,
  change,
  trend,
  sparklineData,
  icon,
  delay = 0,
}: KPICardProps) {
  const getTrendColor = () => {
    if (trend === "up") return "text-emerald-400";
    if (trend === "down") return "text-rose-400";
    return "text-amber-400";
  };

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="w-4 h-4" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass p-5 hover:scale-105 transition-transform cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm text-white/70">{title}</div>
        {icon && <div className="text-white/50">{icon}</div>}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2, ease: "backOut" }}
            className="text-3xl font-semibold mb-2"
          >
            {value}
          </motion.div>

          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{Math.abs(change).toFixed(1)}%</span>
              <span className="text-white/50 text-xs">vs last period</span>
            </div>
          )}
        </div>

        {sparklineData && (
          <div className="ml-4">
            <Sparkline points={sparklineData} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
