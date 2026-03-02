"use client";

import { motion } from "framer-motion";
import { Thermometer, Droplets, Wind, Eye, TrendingUp, TrendingDown } from "lucide-react";

const metrics = [
    {
        id: "temp", label: "Temperature", value: "24°C", sub: "Feels like 22°C",
        change: "+2°", up: true,
        iconColor: "text-orange-500", iconBg: "bg-orange-50",
        accentColor: "bg-orange-500", borderColor: "border-orange-100",
        Icon: Thermometer,
    },
    {
        id: "humidity", label: "Humidity", value: "68%", sub: "High moisture level",
        change: "-5%", up: false,
        iconColor: "text-sky-500", iconBg: "bg-sky-50",
        accentColor: "bg-sky-500", borderColor: "border-sky-100",
        Icon: Droplets,
    },
    {
        id: "wind", label: "Wind Speed", value: "12 km/h", sub: "Southwest breeze",
        change: "+3 km/h", up: true,
        iconColor: "text-emerald-600", iconBg: "bg-emerald-50",
        accentColor: "bg-emerald-500", borderColor: "border-emerald-100",
        Icon: Wind,
    },
    {
        id: "visibility", label: "Visibility", value: "8.5 km", sub: "Clear conditions",
        change: "Good", up: true,
        iconColor: "text-indigo-500", iconBg: "bg-indigo-50",
        accentColor: "bg-indigo-500", borderColor: "border-indigo-100",
        Icon: Eye,
    },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } } };

export function MetricCards() {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-4 gap-4 mb-6"
        >
            {metrics.map((m) => {
                const Icon = m.Icon;
                return (
                    <motion.div
                        key={m.id}
                        variants={item}
                        whileHover={{ y: -3 }}
                        className={`card border ${m.borderColor} hover:shadow-md transition-shadow cursor-pointer`}
                    >
                        {/* Icon + change badge */}
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-9 h-9 rounded-xl ${m.iconBg} flex items-center justify-center`}>
                                <Icon className={`w-4.5 h-4.5 ${m.iconColor}`} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${m.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                                }`}>
                                {m.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {m.change}
                            </div>
                        </div>

                        {/* Value */}
                        <p className="text-2xl font-bold text-gray-900 mb-0.5 tracking-tight">{m.value}</p>
                        <p className="text-sm font-semibold text-gray-600">{m.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{m.sub}</p>

                        {/* Bottom accent bar */}
                        <div className={`mt-4 h-1 rounded-full ${m.accentColor} w-12 opacity-70`} />
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
