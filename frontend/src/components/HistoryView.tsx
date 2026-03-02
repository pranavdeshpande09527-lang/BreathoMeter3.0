"use client";
import { motion } from "framer-motion";
import { Clock, TrendingDown, TrendingUp } from "lucide-react";

const historyData = [
    { date: "Mar 2, 2026", aqi: 85, peak25: 35.2, risk: "Moderate", riskColor: "badge-moderate" },
    { date: "Mar 1, 2026", aqi: 72, peak25: 28.1, risk: "Moderate", riskColor: "badge-moderate" },
    { date: "Feb 29, 2026", aqi: 48, peak25: 18.4, risk: "Low", riskColor: "badge-low" },
    { date: "Feb 28, 2026", aqi: 115, peak25: 67.2, risk: "High", riskColor: "badge-high" },
    { date: "Feb 27, 2026", aqi: 92, peak25: 44.3, risk: "Moderate", riskColor: "badge-moderate" },
    { date: "Feb 26, 2026", aqi: 34, peak25: 12.1, risk: "Low", riskColor: "badge-low" },
    { date: "Feb 25, 2026", aqi: 143, peak25: 89.7, risk: "High", riskColor: "badge-high" },
];

export function HistoryView() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: "Highest AQI", value: "143", sub: "Feb 25", icon: TrendingUp, color: "text-red-500", bg: "bg-red-50" },
                    { label: "Lowest AQI", value: "34", sub: "Feb 26", icon: TrendingDown, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Average AQI", value: "84", sub: "Last 7 days", icon: Clock, color: "text-sky-500", bg: "bg-sky-50" },
                ].map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card flex items-center gap-4">
                            <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                                <Icon className={`w-6 h-6 ${s.color}`} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">{s.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                                <p className="text-xs text-gray-400">{s.sub}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-card overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Historical AQI Data</h3>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 text-xs text-gray-400 font-medium uppercase tracking-wide">
                            <th className="px-6 py-3 text-left">Date</th>
                            <th className="px-6 py-3 text-left">AQI</th>
                            <th className="px-6 py-3 text-left">Peak PM2.5</th>
                            <th className="px-6 py-3 text-left">Risk Level</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {historyData.map((row, i) => (
                            <motion.tr
                                key={row.date}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="hover:bg-gray-50 transition"
                            >
                                <td className="px-6 py-3 text-sm text-gray-600">{row.date}</td>
                                <td className="px-6 py-3 text-sm font-bold text-gray-900">{row.aqi}</td>
                                <td className="px-6 py-3 text-sm text-gray-600">{row.peak25} μg/m³</td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${row.riskColor}`}>
                                        {row.risk}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
