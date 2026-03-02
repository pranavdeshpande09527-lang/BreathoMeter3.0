"use client";
import { motion } from "framer-motion";
import { FileText, BarChart2, Leaf } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const weeklyData = [
    { day: "Mon", aqi: 72, pm25: 28 }, { day: "Tue", aqi: 85, pm25: 35 },
    { day: "Wed", aqi: 48, pm25: 18 }, { day: "Thu", aqi: 115, pm25: 67 },
    { day: "Fri", aqi: 92, pm25: 44 }, { day: "Sat", aqi: 34, pm25: 12 },
    { day: "Sun", aqi: 143, pm25: 89 },
];

const reports = [
    { icon: FileText, title: "Weekly Summary", desc: "Overall air quality improved by 12% compared to last week. PM2.5 levels remained within safe limits on 5 out of 7 days.", bg: "bg-emerald-50", iconColor: "text-emerald-600", iconBg: "bg-emerald-100" },
    { icon: Leaf, title: "Environmental Analysis", desc: "Vegetation and green cover in your monitored area contributes to a 15% reduction in particulate matter during peak hours.", bg: "bg-sky-50", iconColor: "text-sky-600", iconBg: "bg-sky-100" },
];

export function ReportsView() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="flex flex-col gap-6">
            <h2 className="text-lg font-bold text-gray-900">AI-Generated Health Reports</h2>

            <div className="grid grid-cols-2 gap-4">
                {reports.map((r) => {
                    const Icon = r.icon;
                    return (
                        <div key={r.title} className={`${r.bg} rounded-2xl p-5`}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-9 h-9 ${r.iconBg} rounded-xl flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${r.iconColor}`} />
                                </div>
                                <p className="text-sm font-semibold text-gray-900">{r.title}</p>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">{r.desc}</p>
                        </div>
                    );
                })}
            </div>

            {/* Bar chart */}
            <div className="bg-white rounded-3xl p-6 shadow-card">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart2 className="w-4 h-4 text-violet-600" />
                    <p className="text-sm font-semibold text-gray-900">7-Day AQI & PM2.5 Comparison</p>
                </div>
                <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData} barCategoryGap="30%" barGap={4} margin={{ left: -20, right: 4 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontSize: 12 }} />
                            <Bar dataKey="aqi" fill="#10B981" radius={[4, 4, 0, 0]} name="AQI" />
                            <Bar dataKey="pm25" fill="#F97316" radius={[4, 4, 0, 0]} name="PM2.5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
}
