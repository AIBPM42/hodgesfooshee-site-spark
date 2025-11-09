'use client';

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import ChartFrame from './ChartFrame';
import { brand } from '@/lib/brand-palette';

type Point = { month: string; active: number; pending: number };

export default function InventoryVsDemandChart({
  data,
  lastUpdated,
}: {
  data: Point[];
  lastUpdated?: string;
}) {
  const latest = data[data.length - 1];
  const ratio = latest ? Math.round((latest.pending / Math.max(latest.active, 1)) * 100) : 0;
  const market =
    ratio >= 80 ? 'Seller-leaning' : ratio >= 60 ? 'Balanced' : 'Buyer-leaning';

  const badge = (
    <span className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-700">
      {market} • Absorption {ratio}%
    </span>
  );

  return (
    <ChartFrame
      title="Inventory vs. Demand"
      subtitle={lastUpdated ? `Updated ${lastUpdated}` : ''}
      badge={badge}
    >
      <div className="h-[280px] w-full" role="img" aria-label={`Inventory vs. Demand chart showing active listings and pending sales, currently ${market.toLowerCase()} market with ${ratio}% absorption rate`}>
        <p className="sr-only">
          Chart displays monthly active listings (bars) and pending sales (area line) trends.
          Current absorption rate is {ratio}%, indicating a {market.toLowerCase()} market condition.
        </p>
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ left: 8, right: 8, top: 20, bottom: 10 }}>
            <defs>
              <linearGradient id="areaPending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={brand.teal} stopOpacity={0.36} />
                <stop offset="100%" stopColor={brand.teal} stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 14 }} />
            <YAxis tick={{ fill: '#71717a', fontSize: 14 }} width={52} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                return (
                  <div style={{
                    borderRadius: 10,
                    border: '1px solid rgba(0,0,0,0.1)',
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    padding: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}>
                    <p style={{ color: '#fff', fontWeight: 600, marginBottom: 8 }}>{label}</p>
                    {payload.map((entry: any, index: number) => {
                      const displayName = entry.dataKey === 'active' ? 'Active Listings' : entry.dataKey === 'pending' ? 'Pending Sales' : entry.name;
                      return (
                        <p key={index} style={{ color: '#fff', margin: '4px 0', fontSize: 14 }}>
                          <span style={{ color: entry.color }}>{displayName}: </span>
                          <span style={{ fontWeight: 600 }}>{entry.value?.toLocaleString() ?? 'N/A'}</span>
                        </p>
                      );
                    })}
                  </div>
                );
              }}
            />
            <Legend
              verticalAlign="top"
              height={28}
              formatter={(value: string) => value === 'Active' ? 'Active' : value === 'Pending' ? 'Pending' : value}
            />
            <Bar dataKey="active" name="Active" fill={brand.orange} radius={[10, 10, 0, 0]} />
            <Area
              dataKey="pending"
              name="Pending"
              type="monotone"
              stroke={brand.teal}
              strokeWidth={3}
              fill="url(#areaPending)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
