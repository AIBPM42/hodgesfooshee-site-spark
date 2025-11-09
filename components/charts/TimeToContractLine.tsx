"use client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts'
import { formatDays } from '@/lib/format'

export default function TimeToContractLine({ data }:{ data: Array<{day:number; days:number}> }){
  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="var(--grid)" strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill:'var(--axis)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            label={{ value: 'Days Since Listed', position: 'insideBottom', offset: -5, fill: 'var(--sub)', fontSize: 11 }}
          />
          <YAxis
            tick={{ fill:'var(--axis)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            label={{ value: 'Days to Contract', angle: -90, position: 'insideLeft', fill: 'var(--sub)', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number) => [formatDays(value), 'Time to Contract']}
          />
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="days" fill="url(#lineGradient)" stroke="none" />
          <Line type="monotone" dataKey="days" stroke="#F97316" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
