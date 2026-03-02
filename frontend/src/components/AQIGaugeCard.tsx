"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle } from "lucide-react";

interface AQIGaugeCardProps {
    aqi?: number; pm25?: number; pm10?: number; o3?: number; no2?: number; city?: string;
}

function ArcGauge({ value, max = 200 }: { value: number; max?: number }) {
    const r = 54;
    const arc = Math.PI * r;
    const pct = Math.min(value / max, 1);
    const offset = arc * (1 - pct);
    const color = value <= 50 ? "#10B981" : value <= 100 ? "#F59E0B" : value <= 150 ? "#F97316" : "#EF4444";

    return (
        <div className="flex justify-center py-2">
            <svg width="148" height="84" viewBox="0 0 148 84">
                <path d="M 10 76 A 58 58 0 0 1 138 76" fill="none" stroke="#F3F4F6" strokeWidth="10" strokeLinecap="round" />
                <motion.path
                    d="M 10 76 A 58 58 0 0 1 138 76"
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={arc}
                    initial={{ strokeDashoffset: arc }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.1, ease: "easeInOut" }}
                />
                <text x="74" y="63" textAnchor="middle" fontSize="24" fontWeight="800" fill="#111827" fontFamily="Inter">{value}</text>
                <text x="74" y="76" textAnchor="middle" fontSize="10" fill="#9CA3AF" fontFamily="Inter">AQI</text>
            </svg>
        </div>
    );
}

function Pollutant({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
    return (
        <div className="text-center">
            <p className="text-[10px] font-medium text-gray-400 mb-1">{label}</p>
            <p className={`text-sm font-bold ${color}`}>{value}</p>
            <p className="text-[10px] text-gray-400">{unit}</p>
        </div>
    );
}

export function AQIGaugeCard({ aqi = 85, pm25 = 35.2, pm10 = 58.7, o3 = 42.1, no2 = 18.4, city = "San Francisco, CA" }: AQIGaugeCardProps) {
    const riskLabel = aqi <= 50 ? "Good" : aqi <= 100 ? "Moderate" : aqi <= 150 ? "Unhealthy" : "Hazardous";
    const badgeClass = aqi <= 50 ? "badge-low" : aqi <= 100 ? "badge-moderate" : "badge-severe";

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Air Quality Index</p>
                        <p className="text-xs text-gray-400">{city}</p>
                    </div>
                </div>
                <span className="badge badge-moderate flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +12%
                </span>
            </div>

            {/* Gauge */}
            <ArcGauge value={aqi} />

            {/* Risk label + scale */}
            <div className="flex items-center justify-between px-1 mb-4">
                <span className="text-xs text-gray-400">Scale: 0–200+</span>
                <span className={`badge ${badgeClass}`}>{riskLabel}</span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-4" />

            {/* Pollutants */}
            <div className="grid grid-cols-4 gap-2 mb-4">
                <Pollutant label="PM2.5" value={pm25} unit="μg/m³" color="text-amber-500" />
                <Pollutant label="PM10" value={pm10} unit="μg/m³" color="text-orange-500" />
                <Pollutant label="O₃" value={o3} unit="ppb" color="text-indigo-500" />
                <Pollutant label="NO₂" value={no2} unit="ppb" color="text-sky-500" />
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 bg-amber-50 border-l-2 border-amber-400 rounded-lg px-3 py-2.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                    Moderate air quality. Sensitive individuals should limit prolonged outdoor exposure.
                </p>
            </div>
        </motion.div>
    );
}
