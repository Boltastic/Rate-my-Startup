import React from "react";
import { motion } from "motion/react";

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  showPercent?: boolean;
}

export default function ScoreGauge({
  score,
  label,
  size = 'md',
  showPercent = true,
}: ScoreGaugeProps) {
  const safeScore = Math.max(0, Math.min(100, score));
  
  // Radial dimensions
  const dimensions = size === 'sm' ? 80 : size === 'md' ? 120 : 160;
  const strokeWidth = size === 'sm' ? 6 : size === 'md' ? 10 : 12;
  const radius = (dimensions - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  // Determine elegant color matching
  const getColor = (val: number) => {
    if (val < 45) return "stroke-rose-500 text-rose-500 bg-rose-50";
    if (val < 70) return "stroke-amber-400 text-amber-500 bg-amber-50";
    return "stroke-emerald-500 text-emerald-500 bg-emerald-50";
  };

  const colorClass = getColor(safeScore);

  return (
    <div className="flex flex-col items-center justify-center text-center p-2.5" id={`score-gauge-${label.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className="relative" style={{ width: dimensions, height: dimensions }}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            className="stroke-slate-100 fill-transparent"
            strokeWidth={strokeWidth}
          />
          {/* Animated Indicator Circle */}
          <motion.circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            className={`fill-transparent ${colorClass.split(' ')[0]}`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Floating value inside circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`font-display font-extrabold tracking-tight ${
              size === 'sm' ? "text-lg" : size === 'md' ? "text-3xl" : "text-4xl"
            } ${colorClass.split(' ')[1]}`}
          >
            {safeScore}
            {showPercent && <span className="text-xs font-semibold text-slate-400 ml-0.5">%</span>}
          </motion.span>
          {size !== 'sm' && (
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold font-display mt-0.5">
              Confidence
            </span>
          )}
        </div>
      </div>

      <span className="text-xs font-semibold font-display text-slate-600 mt-2">{label}</span>
    </div>
  );
}

interface ScoreBarProps {
  score: number;
  label: string;
  icon?: React.ReactNode;
}

export function ScoreBar({ score, label, icon }: ScoreBarProps) {
  const safeScore = Math.max(0, Math.min(100, score));

  const getBarColor = (val: number) => {
    if (val < 45) return "bg-rose-500";
    if (val < 70) return "bg-amber-400";
    return "bg-emerald-500";
  };

  const getBgColor = (val: number) => {
    if (val < 45) return "bg-rose-50";
    if (val < 70) return "bg-amber-50";
    return "bg-emerald-50";
  };

  const getTextColor = (val: number) => {
    if (val < 45) return "text-rose-600";
    if (val < 70) return "text-amber-600";
    return "text-emerald-600";
  };

  return (
    <div className="space-y-1.5" id={`score-bar-${label.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className="flex justify-between items-center text-xs font-medium">
        <div className="flex items-center space-x-1.5 text-slate-700">
          {icon}
          <span className="font-semibold text-slate-700">{label}</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${getBgColor(safeScore)} ${getTextColor(safeScore)}`}>
          {safeScore}/100
        </span>
      </div>

      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeScore}%` }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className={`h-full rounded-full ${getBarColor(safeScore)}`}
        />
      </div>
    </div>
  );
}
