"use client";
import ChartFrame from "./chartFrame";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { pricePositioning as pp } from "@/lib/mock/dashHomeData";

export default function PricePositioningScatter(){
  return (
    <ChartFrame title="Price Positioning (PPSF vs DOM)">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <XAxis type="number" dataKey="ppsf" name="$/sqft" />
            <YAxis type="number" dataKey="dom" name="DOM" />
            <Tooltip />
            <Scatter data={pp.sold} name="Sold (30d)" fill="#10b981" opacity={0.6} />
            <Scatter data={pp.active} name="Active" fill="#94a3b8" opacity={0.6} />
            <Scatter data={pp.your} name="Your Listings" fill="#f97316" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
