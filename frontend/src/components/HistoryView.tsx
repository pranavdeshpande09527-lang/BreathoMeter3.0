"use client";
import { motion } from "framer-motion";
import { Clock, TrendingDown, TrendingUp } from "lucide-react";

const historyData = [
    { date: "Mar 2, 2026", aqi: 85, peak25: 35.2, risk: "Moderate", badge: "badge-moderate" },
    { date: "Mar 1, 2026", aqi: 72, peak25: 28.1, risk: "Moderate", badge: "badge-moderate" },
    { date: "Feb 29, 2026", aqi: 48, peak25: 18.4, risk: "Low", badge: "badge-low" },
    { date: "Feb 28, 2026", aqi: 115, peak25: 67.2, risk: "High", badge: "badge-high" },
    { date: "Feb 27, 2026", aqi: 92, peak25: 44.3, risk: "Moderate", badge: "badge-moderate" },
    { date: "Feb 26, 2026", aqi: 34, peak25: 12.1, risk: "Low", badge: "badge-low" },
    { date: "Feb 25, 2026", aqi: 143, peak25: 89.7, risk: "High", badge: "badge-high" },
];

const statCards = [
    { label: "Highest AQI", value: "143", sub: "Feb 25", Icon: TrendingUp, iconColor: "text-red-500", iconBg: "bg-red-50" },
    { label: "Lowest AQI", value: "34", sub: "Feb 26", Icon: TrendingDown, iconColor: "text-emerald-600", iconBg: "bg-emerald-50" },
    { label: "Average AQI", value: "84", sub: "Last 7 days", Icon: Clock, iconColor: "text-indigo-500", iconBg: "bg-indigo-50" },
];

export function HistoryView() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {statCards.map((s) => {
                    const Icon = s.Icon;
                    return (
                        <div key={s.label} className="card flex items-center gap-4">
                            <div className={`w-11 h-11 ${s.iconBg} rounded-2xl flex items-center justify-center shrink-0`}>
                                <Icon className={`w-5 h-5 ${s.iconColor}`} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">{s.label}</p>
                                <p className="text-2xl font-bold text-gray-900 tracking-tight">{s.value}</p>
                                <p className="text-xs text-gray-400">{s.sub}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Table */}
            <div className="card p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Historical AQI Data</h3>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            {["Date", "AQI", "Peak PM2.5", "Risk Level"].map(h => (
                                <th key={h} className="px-6 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {historyData.map((row, i) => (
                            <motion.tr
                                key={row.date}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-3.5 text-sm text-gray-600">{row.date}</td>
                                <td className="px-6 py-3.5 text-sm font-bold text-gray-900">{row.aqi}</td>
                                <td className="px-6 py-3.5 text-sm text-gray-600">{row.peak25} μg/m³</td>
                                <td className="px-6 py-3.5">
                                    <span className={`badge ${row.badge}`}>{row.risk}</span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
