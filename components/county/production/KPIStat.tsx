"use client";
import { brand } from "@/lib/brand";

export default function KPIStat({
  label,
  value,
  prefix = "",
  suffix = "",
}: {
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl bg-white shadow-[0_10px_30px_rgba(20,20,20,.08)] ring-1 ring-black/5 p-5 md:p-6 hover:shadow-[0_14px_36px_rgba(20,20,20,.12)] transition-all duration-300">
      <div className="text-xs font-medium tracking-wide text-neutral-500">
        {label.toUpperCase()}
      </div>
      <div
        className="mt-2 text-2xl md:text-3xl font-extrabold"
        style={{ color: brand.ink }}
      >
        {prefix}
        {typeof value === "number"
          ? value.toLocaleString()
          : value}
        {suffix}
      </div>
    </div>
  );
}
