'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import ChartFrame from './ChartFrame';
import { brand } from '@/lib/brand-palette';

type Point = { month: string; dom: number };

export default function DaysOnMarketChart({ data }: { data: Point[] }) {
  const latest = data[data.length - 1]?.dom ?? 0;

  const badge = (
    <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700">
      Current: {latest} days
    </span>
  );

  return (
    <ChartFrame title="Median Days on Market" badge={badge}>
      <div className="h-[280px] w-full">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ left: 8, right: 8, top: 20, bottom: 10 }}>
            <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 14 }} />
            <YAxis tick={{ fill: '#71717a', fontSize: 14 }} width={36} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const value = payload[0]?.value;
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
                      <span style={{ color: payload[0]?.color }}>Days on Market: </span>
                      <span style={{ fontWeight: 600 }}>{value != null ? `${value} days` : 'N/A'}</span>
                    </p>
                  </div>
                );
              }}
            />
            <ReferenceLine y={30} stroke="#E04F16" strokeDasharray="4 4" />
            <Line
              dataKey="dom"
              type="monotone"
              stroke={brand.purple}
              strokeWidth={3}
              dot={{ r: 3, stroke: brand.purple, strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
