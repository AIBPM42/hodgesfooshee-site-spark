"use client";
import { ResponsiveContainer, LineChart, Line, Area } from 'recharts'
import { formatPct } from '@/lib/format'

export default function ZipSparkGrid({ zips }:{ zips: Array<{zip:string; change:number; series:number[]}> }){
  return (
    <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-4">
      {zips.map(z=> {
        const { tone } = z.change >= 0 ? { tone: '#65A30D' } : { tone: '#F97316' };
        const data = z.series.map((v,i)=>({i,v}));

        return (
          <div
            key={z.zip}
            className="group rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--panel)_92%,transparent)] p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold text-[var(--text)]">{z.zip}</span>
              <span className="font-medium" style={{ color: tone }}>
                {z.change>=0?"▲":"▼"} {formatPct(Math.abs(z.change), false, 1)}
              </span>
            </div>
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id={`spark-${z.zip}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" fill={`url(#spark-${z.zip})`} stroke="none" />
                  <Line type="monotone" dataKey="v" stroke="#7C3AED" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  )
}
