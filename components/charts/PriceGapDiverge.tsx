"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, ReferenceLine, Tooltip, Cell } from 'recharts'
import { formatPct } from '@/lib/format'

export default function PriceGapDiverge({ data }:{ data: Array<{segment:string; gap:number}> }){
  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 80, right: 16, top: 10, bottom: 10 }}>
          <XAxis
            type="number"
            domain={[-6,6]}
            tick={{ fill:'var(--axis)', fontSize: 12 }}
            tickFormatter={(v) => `${v}%`}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="segment"
            tick={{ fill:'var(--text)', fontSize: 13, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={70}
          />
          <Tooltip
            cursor={{ fill:'rgba(148,163,184,.06)' }}
            contentStyle={{
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number) => [`${formatPct(value, false, 1)}`, 'Gap']}
          />
          <ReferenceLine x={0} stroke="var(--border)" strokeWidth={2} />
          <Bar dataKey="gap" barSize={18} radius={9}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.gap >= 0 ? '#65A30D' : '#F97316'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
