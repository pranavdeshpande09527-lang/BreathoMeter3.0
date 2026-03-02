"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ReferenceLine, Legend
} from "recharts";

const timeRanges = ["1H", "6H", "24H", "7D"] as const;
type Range = (typeof timeRanges)[number];

// Simulated data
const generate24H = () =>
    Array.from({ length: 24 }, (_, i) => ({
        time: `${String(i).padStart(2, "0")}:00`,
        AQI: Math.round(30 + Math.sin(i / 3) * 30 + Math.random() * 20),
        "PM2.5": Math.round(15 + Math.sin(i / 4) * 15 + Math.random() * 10),
        O3: Math.round(20 + Math.sin(i / 5) * 10 + Math.random() * 8),
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
        <div className="custom-tooltip text-xs">
            <p className="font-semibold text-gray-700 mb-1">{label}</p>
            {payload.map((p: any) => (
                <p key={p.name} style={{ color: p.color }}>
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
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-6 shadow-card flex-1"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">AQI Trend</p>
                        <p className="text-xs text-gray-400">Real-time monitoring</p>
                    </div>
                </div>

                {/* Legend + Time range */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> AQI</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" /> PM2.5</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-violet-400 inline-block" /> O₃</span>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-50 rounded-full p-1">
                        {timeRanges.map((r) => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={`relative px-3 py-1 rounded-full text-xs font-medium transition ${range === r ? "text-white" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {range === r && (
                                    <motion.div
                                        layoutId="range-bg"
                                        className="absolute inset-0 bg-emerald-500 rounded-full"
                                        transition={{ type: "spring", bounce: 0.25 }}
                                    />
                                )}
                                <span className="relative">{r}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="aqi-grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="pm25-grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="o3-grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                        <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} interval={3} />
                        <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <ReferenceLine y={100} stroke="#EF4444" strokeDasharray="4 4" label={{ value: "Unhealthy threshold", position: "right", fontSize: 9, fill: "#EF4444" }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="AQI" stroke="#10B981" strokeWidth={2.5} fill="url(#aqi-grad)" dot={false} activeDot={{ r: 4 }} />
                        <Area type="monotone" dataKey="PM2.5" stroke="#F97316" strokeWidth={2} fill="url(#pm25-grad)" dot={false} activeDot={{ r: 4 }} />
                        <Area type="monotone" dataKey="O3" stroke="#8B5CF6" strokeWidth={2} fill="url(#o3-grad)" dot={false} activeDot={{ r: 4 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
