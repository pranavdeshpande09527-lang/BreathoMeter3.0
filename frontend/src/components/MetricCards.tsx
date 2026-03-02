"use client";

import { motion } from "framer-motion";
import { Thermometer, Droplets, Wind, Eye, TrendingUp, TrendingDown } from "lucide-react";

const metrics = [
    {
        id: "temp", label: "Temperature", value: "24°C", sub: "Feels like 22°C",
        change: "+2°", up: true,
        gradient: "from-orange-400 via-orange-500 to-amber-500",
        icon: Thermometer, iconBg: "bg-orange-300/30",
    },
    {
        id: "humidity", label: "Humidity", value: "68%", sub: "High moisture level",
        change: "-5%", up: false,
        gradient: "from-sky-400 via-sky-500 to-blue-500",
        icon: Droplets, iconBg: "bg-sky-300/30",
    },
    {
        id: "wind", label: "Wind Speed", value: "12 km/h", sub: "Southwest breeze",
        change: "+3 km/h", up: true,
        gradient: "from-emerald-400 via-emerald-500 to-teal-500",
        icon: Wind, iconBg: "bg-emerald-300/30",
    },
    {
        id: "visibility", label: "Visibility", value: "8.5 km", sub: "Clear conditions",
        change: "Good", up: true,
        gradient: "from-violet-400 via-violet-500 to-purple-600",
        icon: Eye, iconBg: "bg-violet-300/30",
    },
];

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function MetricCards() {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-4 gap-4 mb-6"
        >
            {metrics.map((m) => {
                const Icon = m.icon;
                return (
                    <motion.div
                        key={m.id}
                        variants={item}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${m.gradient} p-5 cursor-pointer shadow-card`}
                    >
                        {/* Background circle decoration */}
                        <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
                        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/5" />

                        <div className="relative">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-10 h-10 rounded-xl ${m.iconBg} flex items-center justify-center`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className={`flex items-center gap-1 glass-chip rounded-full px-2.5 py-1 text-xs font-semibold text-white`}>
                                    {m.up ? (
                                        <TrendingUp className="w-3 h-3" />
                                    ) : (
                                        <TrendingDown className="w-3 h-3" />
                                    )}
                                    {m.change}
                                </div>
                            </div>

                            <p className="text-3xl font-bold text-white mb-1">{m.value}</p>
                            <p className="text-sm font-semibold text-white/80">{m.label}</p>
                            <p className="text-xs text-white/60 mt-0.5">{m.sub}</p>
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
