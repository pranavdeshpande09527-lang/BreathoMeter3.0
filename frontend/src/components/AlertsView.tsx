"use client";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Bell } from "lucide-react";

const allAlerts = [
    { id: 1, type: "alert-danger", Icon: AlertTriangle, iconColor: "text-red-500", title: "High AQI Alert", desc: "PM2.5 exceeded 100 μg/m³ for 3 consecutive hours.", time: "15 min ago", status: "Active", badge: "badge-high" },
    { id: 2, type: "alert-warning", Icon: Bell, iconColor: "text-amber-500", title: "Weather Advisory", desc: "Wind speeds increasing significantly. Air purifier recommended.", time: "1 hr ago", status: "Active", badge: "badge-moderate" },
    { id: 3, type: "alert-success", Icon: CheckCircle, iconColor: "text-emerald-600", title: "Health Check Complete", desc: "Daily lung health assessment shows positive trends.", time: "2 hrs ago", status: "Resolved", badge: "badge-low" },
    { id: 4, type: "alert-danger", Icon: AlertTriangle, iconColor: "text-red-500", title: "AQI Spike Detected", desc: "AQI spiked to 143 during morning rush hour.", time: "Yesterday", status: "Resolved", badge: "badge-low" },
];

export function AlertsView() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-gray-900">System Alerts</h2>
                <button className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 hover:bg-emerald-100 transition">
                    Acknowledge All
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {allAlerts.map((a, i) => {
                    const Icon = a.Icon;
                    return (
                        <motion.div
                            key={a.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className={`alert-item ${a.type}`}
                        >
                            <div className="flex items-start gap-3">
                                <Icon className={`w-4 h-4 ${a.iconColor} shrink-0 mt-0.5`} />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between gap-3 mb-1">
                                        <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                                        <span className={`badge ${a.badge} shrink-0`}>{a.status}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed mb-1.5">{a.desc}</p>
                                    <p className="text-[10px] text-gray-400">{a.time}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
