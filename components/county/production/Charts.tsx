"use client";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import { format } from "date-fns";
import { brand } from "@/lib/brand";
import type { PricePoint, TierPoint, TypeSlice } from "@/lib/mappers/countyMapper";

export function PriceTrendChart({ data }: { data: PricePoint[] }) {
  const fmt = (v: number) => `$${Math.round(v/1000)}k`;

  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 md:p-6 shadow-[0_10px_30px_-10px_rgba(20,20,20,.1)] hover:shadow-[0_14px_36px_-10px_rgba(20,20,20,.15)] transition-all duration-300">
      <h3 className="text-xl font-extrabold mb-4">12-Month Price Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="copperLine" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%"   stopColor={brand.copper} stopOpacity={0.9}/>
                <stop offset="100%" stopColor={brand.copper} stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" strokeOpacity={0.15} />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => format(new Date(d), "MMM")}
              tick={{ fontSize: 12 }}
            />
            <YAxis tickFormatter={fmt} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(v: number) => fmt(v)}
              labelFormatter={(l) => format(new Date(l), "MMM yyyy")}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="url(#copperLine)"
              strokeWidth={3}
              dot={false}
              strokeLinecap="round"
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function PriceTierChart({ data }: { data: TierPoint[] }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 md:p-6 shadow-[0_10px_30px_-10px_rgba(20,20,20,.1)] hover:shadow-[0_14px_36px_-10px_rgba(20,20,20,.15)] transition-all duration-300">
      <h3 className="text-xl font-extrabold mb-4">Price Tier Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" strokeOpacity={0.15} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} fill={brand.gold} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function PropertyTypesChart({ data }: { data: TypeSlice[] }) {
  const palette = [brand.copper, brand.gold, brand.purple, brand.lime];

  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4 md:p-6 shadow-[0_10px_30px_-10px_rgba(20,20,20,.1)] hover:shadow-[0_14px_36px_-10px_rgba(20,20,20,.15)] transition-all duration-300">
      <h3 className="text-xl font-extrabold mb-4">Property Types</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={palette[i % palette.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={24} />
            <Tooltip formatter={(v: number) => `${v}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
