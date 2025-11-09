"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ChartData {
  [key: string]: any;
}

interface InteractiveBarChartProps {
  data: ChartData[];
  dataKey: string;
  xAxisKey: string;
  title: string;
  color?: string;
  onDrillDown?: (item: ChartData) => React.ReactNode;
}

export function InteractiveBarChart({
  data,
  dataKey,
  xAxisKey,
  title,
  color = "#E87722",
  onDrillDown
}: InteractiveBarChartProps) {
  const [selectedItem, setSelectedItem] = useState<ChartData | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey={xAxisKey} stroke="#aaa" tickLine={false} axisLine={false} />
          <YAxis stroke="#aaa" tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "#0f1117",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
            }}
          />
          <Bar
            dataKey={dataKey}
            radius={[10, 10, 0, 0]}
            cursor="pointer"
            onClick={(data) => setSelectedItem(data)}
            onMouseEnter={(_, index) => setActiveIndex(index)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={activeIndex === index ? `${color}dd` : color}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Drill-down modal */}
      <AnimatePresence>
        {selectedItem && onDrillDown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass p-8 max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {title}: {selectedItem[xAxisKey]}
                </h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div>{onDrillDown(selectedItem)}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
