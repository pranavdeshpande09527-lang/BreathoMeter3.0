"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle } from "lucide-react";

interface AQIGaugeCardProps {
    aqi?: number;
    pm25?: number;
    pm10?: number;
    o3?: number;
    no2?: number;
    city?: string;
}

function GaugeSVG({ value, max = 200 }: { value: number; max?: number }) {
    const radius = 56;
    const circumference = Math.PI * radius; // half circle
    const pct = Math.min(value / max, 1);
    const offset = circumference * (1 - pct);

    const color =
        value <= 50 ? "#10B981"
            : value <= 100 ? "#F59E0B"
                : value <= 150 ? "#F97316"
                    : "#EF4444";

    return (
        <svg width="140" height="80" viewBox="0 0 140 80">
            {/* Track */}
            <path
                d="M 10 72 A 60 60 0 0 1 130 72"
                fill="none"
                stroke="#F3F4F6"
                strokeWidth="12"
                strokeLinecap="round"
            />
            {/* Fill */}
            <motion.path
                d="M 10 72 A 60 60 0 0 1 130 72"
                fill="none"
                stroke={color}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            {/* Center value */}
            <text x="70" y="60" textAnchor="middle" fontSize="22" fontWeight="700" fill="#111827">{value}</text>
            <text x="70" y="73" textAnchor="middle" fontSize="9" fill="#9CA3AF">AQI INDEX</text>
        </svg>
    );
}

function PollutantBadge({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
    return (
        <div className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl bg-gray-50">
            <span className="text-xs text-gray-400 font-medium">{label}</span>
            <span className={`text-base font-bold ${color}`}>{value}</span>
            <span className="text-[10px] text-gray-400">{unit}</span>
        </div>
    );
}

export function AQIGaugeCard({
    aqi = 85, pm25 = 35.2, pm10 = 58.7, o3 = 42.1, no2 = 18.4, city = "San Francisco, CA"
}: AQIGaugeCardProps) {
    const riskLabel = aqi <= 50 ? "Good" : aqi <= 100 ? "Moderate" : aqi <= 150 ? "Unhealthy" : "Hazardous";

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-3xl p-6 shadow-card"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Air Quality Index</p>
                            <p className="text-xs text-gray-400">{city}</p>
                        </div>
                    </div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-full px-2.5 py-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +12%
                </span>
            </div>

            {/* Gauge */}
            <div className="flex justify-center mb-2">
                <GaugeSVG value={aqi} />
            </div>

            {/* Risk label */}
            <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-xs text-gray-400">Scale: 0 – 200+</span>
                <span className="text-sm font-bold text-amber-500 border border-amber-200 rounded-full px-3 py-0.5 bg-amber-50">
                    {riskLabel}
                </span>
            </div>

            {/* Pollutant grid */}
            <div className="grid grid-cols-4 gap-2 mb-4">
                <PollutantBadge label="PM2.5" value={pm25} unit="μg/m³" color="text-amber-500" />
                <PollutantBadge label="PM10" value={pm10} unit="μg/m³" color="text-orange-500" />
                <PollutantBadge label="O₃" value={o3} unit="ppb" color="text-violet-500" />
                <PollutantBadge label="NO₂" value={no2} unit="ppb" color="text-blue-400" />
            </div>

            {/* Warning banner */}
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                    Moderate air quality. Sensitive individuals should limit prolonged outdoor exposure.
                </p>
            </div>
        </motion.div>
    );
}
