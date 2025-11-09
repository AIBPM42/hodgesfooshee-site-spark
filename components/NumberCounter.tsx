"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface NumberCounterProps {
  value: number;
  duration?: number;
  format?: (val: number) => string;
  className?: string;
}

export function NumberCounter({
  value,
  duration = 1000,
  format = (v) => v.toLocaleString(),
  className = ""
}: NumberCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "backOut" }}
      className={className}
    >
      {format(displayValue)}
    </motion.div>
  );
}
