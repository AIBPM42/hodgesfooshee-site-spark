"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, Lightbulb } from "lucide-react";
import { useState } from "react";

interface AIInsightCardProps {
  title: string;
  insight: string;
  confidence?: number; // 0-100
  source?: "claude" | "openai" | "perplexity" | "manus";
  actionable?: string[];
}

export function AIInsightCard({
  title,
  insight,
  confidence,
  source = "claude",
  actionable,
}: AIInsightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const sourceColors = {
    claude: "from-purple-500 to-indigo-500",
    openai: "from-emerald-500 to-teal-500",
    perplexity: "from-blue-500 to-cyan-500",
    manus: "from-orange-500 to-amber-500",
  };

  const sourceIcons = {
    claude: <Brain className="w-4 h-4" />,
    openai: <Sparkles className="w-4 h-4" />,
    perplexity: <Lightbulb className="w-4 h-4" />,
    manus: <Sparkles className="w-4 h-4" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-5 border-l-4 border-l-hodges-purple hover:border-l-hodges-orange transition-colors cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${sourceColors[source]}`}>
            {sourceIcons[source]}
          </div>
          <div>
            <div className="text-sm font-medium">{title}</div>
            <div className="text-xs text-white/50 capitalize">{source} AI</div>
          </div>
        </div>

        {confidence !== undefined && (
          <div className="text-right">
            <div className="text-xs text-white/50">Confidence</div>
            <div className="text-sm font-semibold">{confidence}%</div>
          </div>
        )}
      </div>

      {/* Insight */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : "3rem" }}
        className="overflow-hidden"
      >
        <p className="text-sm text-white/80 leading-relaxed mb-3">{insight}</p>

        {/* Actionable items */}
        {actionable && actionable.length > 0 && isExpanded && (
          <div className="mt-4 space-y-2">
            <div className="text-xs text-white/50 font-semibold">Recommended Actions:</div>
            {actionable.map((action, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2 text-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-hodges-orange mt-2" />
                <span className="text-white/70">{action}</span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Expand indicator */}
      <div className="text-center mt-2">
        <div className="text-xs text-white/40">
          {isExpanded ? "Click to collapse" : "Click to expand"}
        </div>
      </div>
    </motion.div>
  );
}
