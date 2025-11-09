"use client";
import { brand } from "@/lib/brand";
import { Bed, Bath, Square } from "lucide-react";

type ListingCardProps = {
  photo: string;
  price: string;
  title: string;
  city?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  status?: string;
  type?: string;
  href?: string;
};

// Status badge color mapping
const statusColors = {
  Active: "bg-emerald-500 text-white",
  Pending: "bg-amber-500 text-white",
  Sold: "bg-neutral-600 text-white",
  "Coming Soon": "bg-blue-500 text-white",
};

export function ListingCard({
  photo,
  price,
  title,
  city,
  beds,
  baths,
  sqft,
  status = "Active",
  type = "Residential",
  href = "#"
}: ListingCardProps) {
  const statusClass = statusColors[status as keyof typeof statusColors] || statusColors.Active;

  return (
    <a
      href={href}
      className="group block rounded-2xl overflow-hidden bg-white ring-1 ring-black/5
                 shadow-[0_8px_24px_rgba(20,20,20,.06)] hover:shadow-[0_14px_32px_rgba(20,20,20,.12)]
                 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image with hover scale */}
      <div className="relative overflow-hidden bg-neutral-100">
        <img
          src={photo}
          alt={title}
          className="w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Status and Type badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase
                           backdrop-blur-sm shadow-lg ${statusClass}`}>
            {status}
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold
                           bg-white/90 backdrop-blur-sm text-neutral-700 shadow-lg">
            {type}
          </span>
        </div>

        {/* Copper accent bar on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E4552E] to-[#F39C57]
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="text-2xl font-bold text-neutral-900 tracking-tight">
          {price}
        </div>
        <div className="mt-2 font-medium text-neutral-700 leading-snug line-clamp-2">
          {title}{city ? ` in ${city}` : ""}
        </div>

        {/* Property details */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-600">
          {beds != null && (
            <span className="flex items-center gap-1.5">
              <Bed className="w-4 h-4" />
              <span className="font-medium">{beds} bed{beds !== 1 ? 's' : ''}</span>
            </span>
          )}
          {baths != null && (
            <span className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" />
              <span className="font-medium">{baths} bath{baths !== 1 ? 's' : ''}</span>
            </span>
          )}
          {sqft != null && (
            <span className="flex items-center gap-1.5">
              <Square className="w-4 h-4" />
              <span className="font-medium">{sqft.toLocaleString()} sqft</span>
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
