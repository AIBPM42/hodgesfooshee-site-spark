"use client";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function LiftCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={clsx(
        "rounded-2xl bg-[rgba(255,255,255,0.92)] shadow-soft hover:shadow-lift transition-shadow",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
