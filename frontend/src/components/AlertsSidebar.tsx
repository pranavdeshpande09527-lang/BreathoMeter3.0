"use client";

import { motion } from "framer-motion";
import { Bell, AlertTriangle, Cloud, CheckCircle, Lightbulb } from "lucide-react";

const alerts = [
    {
        id: 1, type: "alert-danger" as const,
        Icon: AlertTriangle, iconColor: "text-red-500",
        title: "High AQI Alert",
        desc: "Air quality reaching unhealthy levels. Reduce outdoor activities.",
        time: "15 min ago",
    },
    {
        id: 2, type: "alert-warning" as const,
        Icon: Cloud, iconColor: "text-amber-500",
        title: "Weather Update",
        desc: "Wind speeds increasing. Improvement expected by evening.",
        time: "1 hr ago",
    },
    {
        id: 3, type: "alert-success" as const,
        Icon: CheckCircle, iconColor: "text-emerald-500",
        title: "Health Check Complete",
        desc: "Daily lung health assessment shows positive trends.",
        time: "2 hrs ago",
    },
    {
        id: 4, type: "alert-info" as const,
        Icon: Lightbulb, iconColor: "text-indigo-500",
        title: "Pro Tip",
        desc: "Enable push notifications to get real-time AQI alerts instantly.",
        time: "",
    },
];

export function AlertsSidebar() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="w-[300px] shrink-0 card flex flex-col gap-0 p-0 overflow-hidden"
        >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-500" />
                    <p className="text-sm font-semibold text-gray-900">Alerts & Notifications</p>
                </div>
                <span className="flex items-center gap-1 badge badge-moderate">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                    3 Active
                </span>
            </div>

            {/* Alert items */}
            <div className="p-4 flex flex-col gap-3">
                {alerts.map((a, i) => {
                    const Icon = a.Icon;
                    return (
                        <motion.div
                            key={a.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 + i * 0.07 }}
                            className={`alert-item ${a.type}`}
                        >
                            <div className="flex items-start gap-3">
                                <Icon className={`w-4 h-4 ${a.iconColor} shrink-0 mt-0.5`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-800 mb-0.5">{a.title}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">{a.desc}</p>
                                    {a.time && (
                                        <p className="text-[10px] text-gray-400 mt-1.5">{a.time}</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
