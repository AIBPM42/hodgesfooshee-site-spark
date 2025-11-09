"use client";

import { motion } from "framer-motion";
import { Users, Home, TrendingUp, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";

interface KPIData {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export function AnimatedDashboardRow() {
  const kpis: KPIData[] = [
    {
      title: "Total Agents",
      value: 127,
      change: 8.4,
      icon: <Users className="w-5 h-5" />,
      color: "#E87722", // hodges-orange
    },
    {
      title: "Active Listings",
      value: 342,
      change: 12.3,
      icon: <Home className="w-5 h-5" />,
      color: "#7BB241", // hodges-green
    },
    {
      title: "Pending Deals",
      value: 89,
      change: -2.1,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "#6F4DA0", // hodges-purple
    },
    {
      title: "Monthly Revenue",
      value: 2840000,
      change: 15.7,
      icon: <DollarSign className="w-5 h-5" />,
      color: "#C0392B", // hodges-crimson
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {kpis.map((kpi, index) => (
        <AnimatedKPICard key={kpi.title} kpi={kpi} delay={index * 0.1} />
      ))}
    </div>
  );
}

function AnimatedKPICard({ kpi, delay }: { kpi: KPIData; delay: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Number counter animation
  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = kpi.value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;

      if (step >= steps) {
        setDisplayValue(kpi.value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [kpi.value]);

  // Format number (e.g., 2840000 → $2.84M)
  const formatValue = (val: number) => {
    if (kpi.title.includes("Revenue")) {
      if (val >= 1000000) {
        return `$${(val / 1000000).toFixed(2)}M`;
      }
      return `$${val.toLocaleString()}`;
    }
    return val.toLocaleString();
  };

  return (
    <motion.div
      // Entrance animation
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.21, 1.11, 0.81, 0.99], // Bounce easing
      }}
      // Hover animation
      whileHover={{ scale: 1.02, y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="glass p-6 cursor-pointer relative overflow-hidden"
    >
      {/* Background glow on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${kpi.color}20, transparent)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon + Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-white/70">{kpi.title}</div>
          <motion.div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${kpi.color}20` }}
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ color: kpi.color }}>{kpi.icon}</div>
          </motion.div>
        </div>

        {/* Number with counter animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: delay + 0.2,
            ease: "backOut",
          }}
          className="text-3xl font-semibold mb-3"
        >
          {formatValue(displayValue)}
        </motion.div>

        {/* Change indicator */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: delay + 0.4 }}
          className={`text-sm flex items-center gap-1 ${
            kpi.change >= 0 ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {/* Animated arrow */}
          <motion.span
            animate={{
              y: kpi.change >= 0 ? [0, -3, 0] : [0, 3, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-lg"
          >
            {kpi.change >= 0 ? "↗" : "↘"}
          </motion.span>

          {/* Percentage */}
          <span>{Math.abs(kpi.change).toFixed(1)}%</span>
          <span className="text-white/50 text-xs">vs last month</span>
        </motion.div>
      </div>

      {/* Sparkle effect on hover */}
      {isHovered && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: kpi.color,
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [0, -20],
              }}
              transition={{
                duration: 1,
                delay: i * 0.2,
                repeat: Infinity,
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}
