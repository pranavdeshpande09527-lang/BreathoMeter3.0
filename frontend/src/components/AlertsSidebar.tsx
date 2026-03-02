"use client";

import { motion } from "framer-motion";
import { Bell, AlertTriangle, Cloud, CheckCircle, Lightbulb } from "lucide-react";

const alerts = [
    {
        id: 1, type: "danger", icon: AlertTriangle, iconBg: "bg-orange-100", iconColor: "text-orange-500",
        title: "High AQI Alert",
        desc: "Air quality reaching unhealthy levels. Reduce outdoor activities.",
        time: "15 min ago",
        linkColor: "text-orange-500",
    },
    {
        id: 2, type: "info", icon: Cloud, iconBg: "bg-sky-100", iconColor: "text-sky-500",
        title: "Weather Update",
        desc: "Wind speeds increasing. Improvement expected by evening.",
        time: "1 hr ago",
        linkColor: "text-sky-500",
    },
    {
        id: 3, type: "success", icon: CheckCircle, iconBg: "bg-emerald-100", iconColor: "text-emerald-500",
        title: "Health Check Complete",
        desc: "Daily lung health assessment shows positive trends.",
        time: "2 hrs ago",
        linkColor: "text-emerald-500",
    },
    {
        id: 4, type: "tip", icon: Lightbulb, iconBg: "bg-violet-100", iconColor: "text-violet-500",
        title: "Pro Tip",
        desc: "Enable push notifications to get real-time AQI alerts on your device instantly.",
        time: "",
        linkColor: "text-violet-500",
    },
];

export function AlertsSidebar() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="w-[320px] shrink-0 flex flex-col rounded-3xl overflow-hidden shadow-card"
        >
            {/* Orange header */}
            <div className="bg-gradient-to-r from-orange-400 to-amber-500 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <Bell className="w-4.5 h-4.5 text-white" />
                    <p className="text-sm font-semibold text-white">Alerts & Notifications</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-white bg-white/20 rounded-full px-2.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
                    3 Active
                </span>
            </div>

            {/* Alert cards */}
            <div className="bg-white flex-1 p-4 flex flex-col gap-3">
                {alerts.map((alert, i) => {
                    const Icon = alert.icon;
                    return (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.08 }}
                            className="bg-gray-50 rounded-2xl p-3.5 hover:bg-gray-100 transition cursor-pointer"
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-xl ${alert.iconBg} flex items-center justify-center shrink-0`}>
                                    <Icon className={`w-4 h-4 ${alert.iconColor}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-800 mb-0.5">{alert.title}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed mb-2">{alert.desc}</p>
                                    <div className="flex items-center justify-between">
                                        {alert.time && <span className="text-[10px] text-gray-400">{alert.time}</span>}
                                        <button className={`text-[10px] font-semibold ${alert.linkColor} ml-auto`}>
                                            Details →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
