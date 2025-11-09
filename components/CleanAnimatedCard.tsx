"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CleanAnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Minimal, clean card animation
 * - Subtle fade in
 * - Gentle slide up (8px, not 20px)
 * - Quick transition (0.3s, not 0.5s)
 * - No scale, no bounce - just smooth and professional
 */
export function CleanAnimatedCard({
  children,
  delay = 0,
  className = ""
}: CleanAnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay,
        ease: "easeOut", // Smooth, not bouncy
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
