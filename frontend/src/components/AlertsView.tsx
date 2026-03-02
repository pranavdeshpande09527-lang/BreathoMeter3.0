"use client";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Bell } from "lucide-react";

const allAlerts = [
    { id: 1, title: "High AQI Alert", desc: "PM2.5 exceeded 100 μg/m³ for 3 consecutive hours.", time: "15 min ago", status: "Active", statusColor: "badge-high", icon: AlertTriangle, iconBg: "bg-orange-100", iconColor: "text-orange-500" },
    { id: 2, title: "Weather Advisory", desc: "Wind speeds increasing significantly. Air purifier recommended.", time: "1 hr ago", status: "Active", statusColor: "badge-moderate", icon: Bell, iconBg: "bg-amber-100", iconColor: "text-amber-500" },
    { id: 3, title: "Health Check Complete", desc: "Daily lung health assessment shows positive trends.", time: "2 hrs ago", status: "Resolved", statusColor: "badge-low", icon: CheckCircle, iconBg: "bg-emerald-100", iconColor: "text-emerald-500" },
    { id: 4, title: "AQI Spike Detected", desc: "AQI spiked to 143 during morning rush hour.", time: "Yesterday", status: "Resolved", statusColor: "badge-low", icon: AlertTriangle, iconBg: "bg-red-100", iconColor: "text-red-500" },
];

export function AlertsView() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">System Alerts</h2>
                <button className="text-sm font-semibold text-emerald-600 bg-emerald-50 rounded-full px-4 py-2 hover:bg-emerald-100 transition">
                    Acknowledge All
                </button>
            </div>
            <div className="flex flex-col gap-3">
                {allAlerts.map((alert, i) => {
                    const Icon = alert.icon;
                    return (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="bg-white rounded-2xl p-5 shadow-card flex items-start gap-4"
                        >
                            <div className={`w-10 h-10 ${alert.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                                <Icon className={`w-5 h-5 ${alert.iconColor}`} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${alert.statusColor}`}>
                                        {alert.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">{alert.desc}</p>
                                <p className="text-[10px] text-gray-400">{alert.time}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
