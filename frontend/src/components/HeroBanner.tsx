"use client";

import { motion } from "framer-motion";
import { MapPin, RefreshCw, Shield } from "lucide-react";

interface HeroBannerProps {
    city?: string;
    aqi?: number;
    healthScore?: number;
    lungRisk?: number;
    airPurity?: number;
    isLive?: boolean;
}

const stats = (aqi: number, healthScore: number, lungRisk: number, airPurity: number) => [
    { label: "Current AQI", value: aqi, sub: getRiskLabel(aqi), color: getRiskColor(aqi) },
    { label: "Health Score", value: healthScore, sub: "Good", color: "text-white" },
    { label: "Lung Risk", value: lungRisk, sub: "Low Risk", color: "text-white" },
    { label: "Air Purity", value: `${airPurity}%`, sub: "Excellent", color: "text-white" },
];

function getRiskLabel(aqi: number) {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy (Sensitive)";
    if (aqi <= 200) return "Unhealthy";
    return "Hazardous";
}

function getRiskColor(aqi: number) {
    if (aqi <= 50) return "text-emerald-200";
    if (aqi <= 100) return "text-yellow-300";
    if (aqi <= 150) return "text-orange-300";
    return "text-red-300";
}

export function HeroBanner({
    city = "San Francisco, CA",
    aqi = 85,
    healthScore = 78,
    lungRisk = 32,
    airPurity = 91,
    isLive = true,
}: HeroBannerProps) {
    const statItems = stats(aqi, healthScore, lungRisk, airPurity);

    return (
        <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-hero-gradient p-8 mb-6"
        >
            {/* Background orb decorations */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-teal-400/20 blur-2xl" />

            <div className="relative flex items-start justify-between gap-8">
                {/* Left: Greeting */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1.5 glass-chip rounded-full px-3 py-1.5">
                            <MapPin className="w-3.5 h-3.5 text-white/80" />
                            <span className="text-xs text-white/90 font-medium">{city}</span>
                        </div>
                        {isLive && (
                            <div className="flex items-center gap-1.5 glass-chip rounded-full px-3 py-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                                </span>
                                <span className="text-xs text-white/90 font-medium">Live</span>
                            </div>
                        )}
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-1">
                        Good Morning, Dr. Sarah 👋
                    </h1>
                    <p className="text-emerald-100 text-sm mb-6">
                        Your environment is being monitored. 3 active sensors online.
                    </p>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 glass-chip rounded-full px-5 py-2.5 text-white text-sm font-medium hover:bg-white/20 transition">
                            <RefreshCw className="w-4 h-4" />
                            Refresh Data
                        </button>
                        <button className="flex items-center gap-2 bg-white text-emerald-700 rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg hover:bg-emerald-50 transition">
                            <Shield className="w-4 h-4" />
                            Full Health Report
                        </button>
                    </div>
                </div>

                {/* Right: Stat chips */}
                <div className="flex-shrink-0 grid grid-cols-2 gap-3">
                    {statItems.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + i * 0.08 }}
                            className="glass-chip rounded-2xl px-5 py-4 text-center min-w-[120px]"
                        >
                            <p className="text-[10px] text-white/70 font-medium uppercase tracking-wide mb-1">{stat.label}</p>
                            <p className={`text-3xl font-bold text-white mb-0.5`}>{stat.value}</p>
                            <p className={`text-xs font-medium ${stat.color}`}>{stat.sub}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
