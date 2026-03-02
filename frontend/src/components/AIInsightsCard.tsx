"use client";

import { motion } from "framer-motion";
import { Brain, TrendingUp, Target, Zap, Flame, Award } from "lucide-react";

interface AIInsightsCardProps {
    healthScore?: number;
    recommendation?: string;
}

function ScoreRing({ score }: { score: number }) {
    const r = 32;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - score / 100);

    return (
        <div className="relative flex items-center justify-center shrink-0">
            <svg width="80" height="80">
                <circle cx="40" cy="40" r={r} fill="none" stroke="#EEF2FF" strokeWidth="8" />
                <motion.circle
                    cx="40" cy="40" r={r}
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    style={{ transformOrigin: "40px 40px", transform: "rotate(-90deg)" }}
                />
            </svg>
            <p className="absolute text-xl font-bold text-gray-900">{score}</p>
        </div>
    );
}

const insightRows = [
    { Icon: Target, label: "Daily Goal", value: "4.2 / 5 hrs", pct: 84, color: "#10B981" },
    { Icon: Zap, label: "Energy Level", value: "High", pct: 90, color: "#F59E0B" },
    { Icon: TrendingUp, label: "7-Day Trend", value: "+12%", pct: 72, color: "#6366F1" },
    { Icon: Flame, label: "Streak", value: "14 Days", pct: 60, color: "#EC4899" },
];

export function AIInsightsCard({
    healthScore = 78,
    recommendation = "Morning walk at 7AM (AQI: 45). Avoid outdoor exercise 12–3PM. Evening session is optimal after 6PM.",
}: AIInsightsCardProps) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <Brain className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">AI Health Insights</p>
                </div>
                <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 rounded-full px-2.5 py-1">Updated now</span>
            </div>

            {/* Score row */}
            <div className="flex items-center gap-4 mb-4">
                <ScoreRing score={healthScore} />
                <div className="flex-1 space-y-1.5">
                    <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                        <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-wide">Excellent</p>
                        <p className="text-[10px] text-gray-400">Top 15% of users</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg px-3 py-2 text-center">
                        <p className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Trending ↑
                        </p>
                        <p className="text-[10px] text-gray-400">vs last week</p>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-4" />

            {/* Insight rows */}
            <div className="space-y-3 mb-4">
                {insightRows.map((row) => {
                    const Icon = row.Icon;
                    return (
                        <div key={row.label} className="flex items-center gap-3">
                            <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="text-xs text-gray-500">{row.label}</span>
                                    <span className="text-xs font-semibold text-gray-800">{row.value}</span>
                                </div>
                                <div className="progress-track">
                                    <motion.div
                                        className="progress-fill"
                                        style={{ backgroundColor: row.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${row.pct}%` }}
                                        transition={{ duration: 0.9, delay: 0.4 }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Today&apos;s recommendation — left border */}
            <div className="border-l-2 border-indigo-300 pl-3 py-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                    <Award className="w-3 h-3 text-indigo-500" />
                    <p className="text-[10px] font-semibold text-indigo-600">Today's Recommendation</p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{recommendation}</p>
            </div>
        </motion.div>
    );
}
