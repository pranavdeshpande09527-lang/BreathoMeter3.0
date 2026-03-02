"use client";

import { motion } from "framer-motion";
import { Heart, Activity, Shield, Zap, Brain } from "lucide-react";

interface LungHealthCardProps {
    riskScore?: number;
    respiratoryFunction?: number;
    exposureLevel?: string;
    recoveryIndex?: string;
    immunityFactor?: string;
    aiRecommendation?: string;
}

function RiskArc({ value }: { value: number }) {
    const r = 40;
    const circ = Math.PI * r;
    const color = value < 33 ? "#10B981" : value < 66 ? "#F59E0B" : "#EF4444";
    const offset = circ * (1 - value / 100);

    return (
        <svg width="100" height="60" viewBox="0 0 100 60">
            <path d="M 8 55 A 42 42 0 0 1 92 55" fill="none" stroke="#F3F4F6" strokeWidth="10" strokeLinecap="round" />
            <motion.path
                d="M 8 55 A 42 42 0 0 1 92 55"
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            <text x="50" y="47" textAnchor="middle" fontSize="18" fontWeight="700" fill="#111827">{value}</text>
        </svg>
    );
}

const subMetrics = [
    { icon: Activity, label: "Respiratory Function", value: "78%", sub: "", color: "text-blue-400", bg: "bg-blue-50" },
    { icon: Shield, label: "Exposure Level", value: "Low", sub: "", color: "text-emerald-500", bg: "bg-emerald-50" },
    { icon: Heart, label: "Recovery Index", value: "Good", sub: "", color: "text-rose-400", bg: "bg-rose-50" },
    { icon: Zap, label: "Immunity Factor", value: "High", sub: "", color: "text-orange-400", bg: "bg-orange-50" },
];

export function LungHealthCard({
    riskScore = 32,
    aiRecommendation = "Good recovery potential. Use air purifiers during high AQI periods and monitor closely on forecast days above 80.",
}: LungHealthCardProps) {
    const riskLabel = riskScore < 33 ? "Low Risk" : riskScore < 66 ? "Moderate Risk" : "High Risk";
    const riskColor = riskScore < 33 ? "text-emerald-500" : riskScore < 66 ? "text-amber-500" : "text-red-500";

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-3xl p-6 shadow-card"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-rose-500" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">Lung Health Risk</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold bg-pink-50 text-pink-600 rounded-full px-2.5 py-1">
                    <Brain className="w-3 h-3" />
                    AI Powered
                </div>
            </div>

            {/* Risk Arc */}
            <div className="flex items-center gap-6 mb-5">
                <div className="flex flex-col items-center">
                    <RiskArc value={riskScore} />
                    <p className="text-[10px] text-gray-400 mt-1">/ 100</p>
                </div>
                <div>
                    <p className={`text-lg font-bold ${riskColor}`}>{riskLabel}</p>
                    <p className="text-xs text-gray-400 mb-3">Lower is better</p>
                    {/* Risk gradient bar */}
                    <div className="flex gap-1 items-center">
                        <div className="h-2 w-10 rounded-full bg-emerald-400" />
                        <div className="h-2 w-10 rounded-full bg-amber-300" />
                        <div className="h-2 w-10 rounded-full bg-orange-400" />
                        <div className="h-2 w-10 rounded-full bg-red-400" />
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                        <span>Low</span>
                        <span>Critical</span>
                    </div>
                </div>
            </div>

            {/* Sub metrics 2x2 grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                {subMetrics.map((m) => {
                    const Icon = m.icon;
                    return (
                        <div key={m.label} className={`${m.bg} rounded-xl p-3`}>
                            <div className="flex items-center gap-1.5 mb-1">
                                <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                                <span className="text-[10px] text-gray-500 font-medium">{m.label}</span>
                            </div>
                            <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* AI Recommendation */}
            <div className="bg-pink-50 border border-pink-100 rounded-xl p-3">
                <p className="text-xs text-gray-700">
                    <span className="font-bold text-pink-600">AI Recommendation:</span> {aiRecommendation}
                </p>
            </div>
        </motion.div>
    );
}
