"use client";

import { motion } from "framer-motion";
import { Heart, Activity, Shield, Zap, Brain } from "lucide-react";

interface LungHealthCardProps {
    riskScore?: number;
    aiRecommendation?: string;
}

function RiskArc({ value }: { value: number }) {
    const r = 38;
    const circ = Math.PI * r;
    const color = value < 33 ? "#10B981" : value < 66 ? "#F59E0B" : "#EF4444";
    const offset = circ * (1 - value / 100);

    return (
        <svg width="96" height="58" viewBox="0 0 96 58">
            <path d="M 6 53 A 42 42 0 0 1 90 53" fill="none" stroke="#F3F4F6" strokeWidth="10" strokeLinecap="round" />
            <motion.path
                d="M 6 53 A 42 42 0 0 1 90 53"
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
            />
            <text x="48" y="44" textAnchor="middle" fontSize="18" fontWeight="800" fill="#111827" fontFamily="Inter">{value}</text>
        </svg>
    );
}

const subMetrics = [
    { Icon: Activity, label: "Respiratory Function", value: "78%", col: "text-sky-600", bg: "bg-sky-50" },
    { Icon: Shield, label: "Exposure Level", value: "Low", col: "text-emerald-600", bg: "bg-emerald-50" },
    { Icon: Heart, label: "Recovery Index", value: "Good", col: "text-rose-500", bg: "bg-rose-50" },
    { Icon: Zap, label: "Immunity Factor", value: "High", col: "text-amber-500", bg: "bg-amber-50" },
];

export function LungHealthCard({
    riskScore = 32,
    aiRecommendation = "Good recovery potential. Use air purifiers during high AQI periods and monitor closely on forecast days above 80.",
}: LungHealthCardProps) {
    const riskLabel = riskScore < 33 ? "Low Risk" : riskScore < 66 ? "Moderate Risk" : "High Risk";
    const badgeClass = riskScore < 33 ? "badge-low" : riskScore < 66 ? "badge-moderate" : "badge-severe";

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">Lung Health Risk</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full px-2.5 py-1">
                    <Brain className="w-3 h-3" /> AI Powered
                </div>
            </div>

            {/* Risk arc + label */}
            <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                    <RiskArc value={riskScore} />
                    <p className="text-[10px] text-gray-400 mt-1">/ 100</p>
                </div>
                <div>
                    <span className={`badge ${badgeClass} mb-2`}>{riskLabel}</span>
                    <p className="text-[10px] text-gray-400 mb-3">Lower is better</p>
                    {/* Risk scale bar */}
                    <div className="flex gap-1 rounded-full overflow-hidden h-2 w-32">
                        <div className="flex-1 bg-emerald-400" />
                        <div className="flex-1 bg-amber-300" />
                        <div className="flex-1 bg-orange-400" />
                        <div className="flex-1 bg-red-400" />
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-400 mt-1 w-32">
                        <span>Low</span><span>Critical</span>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-4" />

            {/* Sub-metrics */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                {subMetrics.map((m) => {
                    const Icon = m.Icon;
                    return (
                        <div key={m.label} className={`${m.bg} rounded-xl p-3`}>
                            <div className="flex items-center gap-1.5 mb-1">
                                <Icon className={`w-3 h-3 ${m.col}`} />
                                <span className="text-[10px] text-gray-500 font-medium leading-tight">{m.label}</span>
                            </div>
                            <p className={`text-sm font-bold ${m.col}`}>{m.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* AI recommendation — left border style */}
            <div className="border-l-2 border-rose-300 pl-3 py-1">
                <p className="text-[10px] font-semibold text-rose-600 mb-0.5">AI Recommendation</p>
                <p className="text-xs text-gray-600 leading-relaxed">{aiRecommendation}</p>
            </div>
        </motion.div>
    );
}
