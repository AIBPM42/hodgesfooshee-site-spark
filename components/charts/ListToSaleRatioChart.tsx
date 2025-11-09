'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  LabelList,
} from 'recharts';
import ChartFrame from './ChartFrame';
import { brand } from '@/lib/brand-palette';

type Point = { month: string; ratio: number }; // e.g., 98.7

export default function ListToSaleRatioChart({ data }: { data: Point[] }) {
  const latest = data[data.length - 1]?.ratio ?? 0;
  const color = latest >= 100 ? brand.green : latest >= 98 ? brand.yellow : brand.slate;

  const badge = (
    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
      Latest: {latest.toFixed(1)}%
    </span>
  );

  return (
    <ChartFrame title="List-to-Sale Price Ratio" badge={badge}>
      <div className="h-[280px] w-full">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ left: 8, right: 8, top: 25, bottom: 10 }}>
            <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 14 }} />
            <YAxis tick={{ fill: '#71717a', fontSize: 14 }} width={36} domain={[92, 102]} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const value = payload[0]?.value;
                const displayValue = typeof value === 'number' ? `${value.toFixed(1)}%` : (value != null ? `${value}%` : 'N/A');
                return (
                  <div style={{
                    borderRadius: 10,
                    border: '1px solid rgba(0,0,0,0.1)',
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    padding: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}>
                    <p style={{ color: '#fff', fontWeight: 600, marginBottom: 8 }}>{label}</p>
                    <p style={{ color: '#fff', margin: '4px 0', fontSize: 14 }}>
                      <span style={{ color: payload[0]?.color }}>List→Sale Ratio: </span>
                      <span style={{ fontWeight: 600 }}>{displayValue}</span>
                    </p>
                  </div>
                );
              }}
            />
            <ReferenceLine y={100} stroke={brand.green} strokeDasharray="3 3" />
            <Bar dataKey="ratio" fill={color} radius={[10, 10, 0, 0]}>
              <LabelList
                dataKey="ratio"
                position="top"
                formatter={(v: number) => `${v.toFixed(1)}%`}
                style={{ fontSize: 12, fill: '#121212', fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
