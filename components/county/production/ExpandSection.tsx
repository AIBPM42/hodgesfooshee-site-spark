"use client";
import { ReactNode } from "react";

export default function ExpandSection({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group rounded-3xl bg-[#FBF6EE] ring-1 ring-black/5 shadow-[0_10px_30px_-10px_rgba(20,20,20,.1)] hover:shadow-[0_14px_36px_-10px_rgba(20,20,20,.15)] transition-all duration-300"
      open={defaultOpen}
    >
      <summary className="cursor-pointer list-none px-6 md:px-8 py-6 md:py-7 select-none">
        <div className="flex items-center gap-3 text-2xl md:text-3xl font-extrabold">
          <span className="text-xl">{icon}</span>
          <span>{title}</span>
        </div>
        <div className="mt-3 h-[3px] w-24 rounded-full bg-gradient-to-r from-[#FF7A45] to-[#E4552E]"></div>
      </summary>
      <div className="px-6 md:px-8 pb-8 -mt-1 text-[17px] leading-8 text-neutral-700">
        {children}
      </div>
    </details>
  );
}
