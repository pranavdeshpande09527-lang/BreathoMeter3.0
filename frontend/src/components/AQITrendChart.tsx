"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ReferenceLine,
} from "recharts";

const timeRanges = ["1H", "6H", "24H", "7D"] as const;
type Range = (typeof timeRanges)[number];

const generate24H = () =>
    Array.from({ length: 24 }, (_, i) => ({
        time: `${String(i).padStart(2, "0")}:00`,
        AQI: Math.round(30 + Math.sin(i / 3) * 30 + Math.random() * 18),
        "PM2.5": Math.round(15 + Math.sin(i / 4) * 14 + Math.random() * 8),
        O3: Math.round(20 + Math.sin(i / 5) * 10 + Math.random() * 7),
    }));

const DATA: Record<Range, ReturnType<typeof generate24H>> = {
    "1H": generate24H().slice(23),
    "6H": generate24H().slice(18),
    "24H": generate24H(),
    "7D": generate24H(),
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="custom-tooltip">
            <p className="font-semibold text-gray-700 mb-1.5 text-xs">{label}</p>
            {payload.map((p: any) => (
                <p key={p.name} className="text-xs mb-0.5" style={{ color: p.color }}>
                    {p.name}: <span className="font-bold">{p.value}</span>
                </p>
            ))}
        </div>
    );
};

export function AQITrendChart() {
    const [range, setRange] = useState<Range>("24H");
    const data = DATA[range];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="card flex-1"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">AQI Trend</p>
                        <p className="text-xs text-gray-400">Real-time monitoring</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Legend */}
                    <div className="hidden sm:flex items-center gap-3">
                        {[["#10B981", "AQI"], ["#F97316", "PM2.5"], ["#6366F1", "O₃"]].map(([c, n]) => (
                            <span key={n} className="flex items-center gap-1.5 text-xs text-gray-500">
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c }} />
                                {n}
                            </span>
                        ))}
                    </div>

                    {/* Time range toggle */}
                    <div className="flex items-center bg-gray-100 rounded-full p-0.5 gap-0.5">
                        {timeRanges.map((r) => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-all ${range === r ? "text-emerald-700" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {range === r && (
                                    <motion.div
                                        layoutId="range-pill"
                                        className="absolute inset-0 bg-white shadow-sm rounded-full"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                                    />
                                )}
                                <span className="relative">{r}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                        <defs>
                            {[["aqi", "#10B981"], ["pm25", "#F97316"], ["o3", "#6366F1"]].map(([id, c]) => (
                                <linearGradient key={id} id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={c} stopOpacity={0.15} />
                                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                        <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} interval={3} />
                        <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <ReferenceLine y={100} stroke="#EF4444" strokeDasharray="4 4" label={{ value: "Unhealthy", position: "right", fontSize: 9, fill: "#EF4444" }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="AQI" stroke="#10B981" strokeWidth={2.5} fill="url(#aqi-g)" dot={false} activeDot={{ r: 4, fill: "#10B981" }} />
                        <Area type="monotone" dataKey="PM2.5" stroke="#F97316" strokeWidth={2} fill="url(#pm25-g)" dot={false} activeDot={{ r: 4, fill: "#F97316" }} />
                        <Area type="monotone" dataKey="O3" stroke="#6366F1" strokeWidth={2} fill="url(#o3-g)" dot={false} activeDot={{ r: 4, fill: "#6366F1" }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
