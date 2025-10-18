"use client";
import { motion } from "framer-motion";
import clsx from "clsx";

type CTAButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: string;
};

export default function CTAButton({
  children,
  className,
  icon,
  ...props
}: CTAButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.995 }}
      className={clsx(
        "group relative overflow-hidden px-6 md:px-7 py-3 rounded-full font-semibold",
        "text-white bg-[var(--btn-copper)]",
        "shadow-[0_10px_28px_rgba(226,112,67,.35)]",
        "hover:shadow-[0_16px_40px_rgba(226,112,67,.45)]",
        "transition-all",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {icon && (
        <span className="ml-2 inline-block translate-x-0 group-hover:translate-x-0.5 transition">
          {icon}
        </span>
      )}
      <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/40 mix-blend-soft-light" />
    </motion.button>
  );
}
