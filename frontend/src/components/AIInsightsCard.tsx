"use client";

import { motion } from "framer-motion";
import { Brain, TrendingUp, Target, Zap, Flame, Award } from "lucide-react";

interface AIInsightsCardProps {
    healthScore?: number;
    energyLevel?: string;
    trend?: string;
    streak?: number;
    dailyGoal?: string;
    recommendation?: string;
}

function ScoreRing({ score }: { score: number }) {
    const r = 36;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - score / 100);

    return (
        <div className="relative flex items-center justify-center">
            <svg width="90" height="90">
                <circle cx="45" cy="45" r={r} fill="none" stroke="#EDE9FE" strokeWidth="8" />
                <motion.circle
                    cx="45" cy="45" r={r}
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.3, ease: "easeInOut" }}
                    style={{ transformOrigin: "45px 45px", transform: "rotate(-90deg)" }}
                />
            </svg>
            <div className="absolute text-center">
                <p className="text-2xl font-bold text-gray-900">{score}</p>
            </div>
        </div>
    );
}

const insightRows = [
    { icon: Target, label: "Daily Goal", value: "4.2 / 5 hrs", bar: 84, color: "#10B981", iconColor: "text-emerald-500" },
    { icon: Zap, label: "Energy Level", value: "High", bar: 90, color: "#F59E0B", iconColor: "text-amber-500" },
    { icon: TrendingUp, label: "7-Day Trend", value: "+12%", bar: 72, color: "#0EA5E9", iconColor: "text-sky-500" },
    { icon: Flame, label: "Streak", value: "14 Days", bar: 60, color: "#EC4899", iconColor: "text-pink-500" },
];

export function AIInsightsCard({
    healthScore = 78,
    recommendation = "Morning walk at 7AM (AQI: 45). Avoid outdoor exercise 12–3PM. Evening session is optimal after 6PM.",
}: AIInsightsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-3xl p-6 shadow-card"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-violet-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">AI Health Insights</p>
                </div>
                <span className="text-xs font-semibold bg-violet-50 text-violet-600 rounded-full px-2.5 py-1">
                    Updated now
                </span>
            </div>

            {/* Score ring + badge row */}
            <div className="flex items-center gap-5 mb-5">
                <ScoreRing score={healthScore} />
                <div className="flex flex-col gap-2 flex-1">
                    <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                        <p className="text-[10px] text-violet-500 font-bold uppercase tracking-wide">Excellent</p>
                        <p className="text-[10px] text-gray-400">Top 15% of users</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-2.5 text-center">
                        <p className="text-[10px] text-emerald-500 font-bold flex items-center justify-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Trending ↑
                        </p>
                        <p className="text-[10px] text-gray-400">vs last week</p>
                    </div>
                </div>
            </div>

            {/* Insight rows */}
            <div className="flex flex-col gap-3 mb-4">
                {insightRows.map((row) => {
                    const Icon = row.icon;
                    return (
                        <div key={row.label} className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${row.iconColor} shrink-0`} />
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="text-xs text-gray-500">{row.label}</span>
                                    <span className="text-xs font-semibold text-gray-700">{row.value}</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${row.bar}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: row.color }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Today's recommendation */}
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                    <Award className="w-3.5 h-3.5 text-violet-500" />
                    <p className="text-xs font-semibold text-violet-600">Today's Recommendation</p>
                </div>
                <p className="text-xs text-gray-600">{recommendation}</p>
            </div>
        </motion.div>
    );
}
