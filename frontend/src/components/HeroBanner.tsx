"use client";

import { motion } from "framer-motion";
import { MapPin, RefreshCw, FileCheck } from "lucide-react";

interface HeroBannerProps {
    city?: string;
    aqi?: number;
    healthScore?: number;
    lungRisk?: number;
    airPurity?: number;
}

const aqiLabel = (v: number) => v <= 50 ? "Good" : v <= 100 ? "Moderate" : v <= 150 ? "Unhealthy" : "Hazardous";
const aqiColor = (v: number) => v <= 50 ? "#10B981" : v <= 100 ? "#F59E0B" : "#EF4444";

interface StatChipProps { label: string; value: string | number; sub: string; accent?: boolean }

function StatChip({ label, value, sub, accent }: StatChipProps) {
    return (
        <div className={`rounded-2xl px-6 py-4 border text-center min-w-[126px] ${accent ? "bg-white/20 border-white/30" : "bg-white/15 border-white/25"
            }`}>
            <p className="text-[10px] font-semibold text-white/70 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-2xl font-bold text-white leading-none mb-1">{value}</p>
            <p className="text-xs text-white/80 font-medium">{sub}</p>
        </div>
    );
}

export function HeroBanner({
    city = "San Francisco, CA",
    aqi = 85,
    healthScore = 78,
    lungRisk = 32,
    airPurity = 91,
}: HeroBannerProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl mb-6 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #059669 0%, #10B981 55%, #14B8A6 100%)" }}
        >
            <div className="px-8 py-7 flex items-center justify-between gap-8">

                {/* Left — greeting */}
                <div className="flex-1 min-w-0">
                    {/* Location + live */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1.5 bg-white/20 border border-white/30 rounded-full px-3 py-1">
                            <MapPin className="w-3 h-3 text-white/80" />
                            <span className="text-xs text-white/90 font-medium">{city}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/20 border border-white/30 rounded-full px-3 py-1">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                            </span>
                            <span className="text-xs text-white font-medium">Live</span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-1">Good Morning, Dr. Sarah 👋</h1>
                    <p className="text-sm text-white/75 mb-6">3 active sensors online. Your environment is being monitored.</p>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-medium rounded-full px-4 py-2 transition">
                            <RefreshCw className="w-3.5 h-3.5" />
                            Refresh Data
                        </button>
                        <button className="flex items-center gap-2 bg-white text-emerald-700 text-sm font-semibold rounded-full px-4 py-2 hover:bg-emerald-50 transition shadow-md">
                            <FileCheck className="w-3.5 h-3.5" />
                            Full Health Report
                        </button>
                    </div>
                </div>

                {/* Right — stat chips */}
                <div className="flex items-center gap-3 shrink-0">
                    <StatChip label="Current AQI" value={aqi} sub={aqiLabel(aqi)} accent />
                    <StatChip label="Health Score" value={healthScore} sub="Good" />
                    <StatChip label="Lung Risk" value={lungRisk} sub="Low Risk" />
                    <StatChip label="Air Purity" value={`${airPurity}%`} sub="Excellent" />
                </div>
            </div>
        </motion.section>
    );
}
