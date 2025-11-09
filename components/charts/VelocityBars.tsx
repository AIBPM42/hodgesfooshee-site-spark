"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts'
import { formatCompact } from '@/lib/format'

export default function VelocityBars({ data }:{ data: Array<{week:string; actives:number; pendings:number}> }){
  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="18%" barGap={4}>
          <CartesianGrid stroke="var(--grid)" strokeDasharray="0" vertical={false} />
          <XAxis dataKey="week" tick={{ fill:'var(--axis)', fontSize: 12 }} axisLine={false} tickLine={false} dy={8}/>
          <YAxis tick={{ fill:'var(--axis)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatCompact}/>
          <Tooltip
            cursor={{ fill:'rgba(148,163,184,.08)' }}
            contentStyle={{
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number) => formatCompact(value)}
          />
          <Bar dataKey="actives" fill="#F97316" radius={[6,6,0,0]}>
            <LabelList dataKey="actives" position="top" style={{ fill: 'var(--text)', fontSize: 12, fontWeight: 600 }} formatter={formatCompact} />
          </Bar>
          <Bar dataKey="pendings" fill="#65A30D" radius={[6,6,0,0]}>
            <LabelList dataKey="pendings" position="top" style={{ fill: 'var(--text)', fontSize: 12, fontWeight: 600 }} formatter={formatCompact} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
