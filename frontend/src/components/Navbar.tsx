"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Settings, ChevronDown, Activity } from "lucide-react";

const tabs = ["Dashboard", "History", "Reports", "Alerts"] as const;
type Tab = (typeof tabs)[number];

interface NavbarProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
    notificationCount?: number;
}

export function Navbar({ activeTab, onTabChange, notificationCount = 3 }: NavbarProps) {
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
            <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between gap-6">

                {/* ─── Logo ──────────────────────────────── */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-700 text-gray-900 leading-tight font-bold">Breathometer AI</p>
                        <p className="text-[10px] text-emerald-600 font-medium leading-tight">Air Quality & Lung Health</p>
                    </div>
                </div>

                {/* ─── Navigation Tabs ───────────────────── */}
                <nav className="flex items-center gap-1 bg-gray-50 rounded-full p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab)}
                            className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === tab
                                    ? "text-emerald-700"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="active-tab"
                                    className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-full"
                                    transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                                />
                            )}
                            <span className="relative z-10">{tab}</span>
                        </button>
                    ))}
                </nav>

                {/* ─── Right Actions ─────────────────────── */}
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <AnimatePresence>
                        {searchOpen ? (
                            <motion.input
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 200, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                autoFocus
                                onBlur={() => setSearchOpen(false)}
                                placeholder="Search city, location…"
                                className="outline-none border border-emerald-200 rounded-full px-4 py-1.5 text-sm bg-white text-gray-700 placeholder-gray-400"
                            />
                        ) : (
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition"
                            >
                                <Search className="w-4.5 h-4.5" />
                            </button>
                        )}
                    </AnimatePresence>

                    {/* Notifications */}
                    <button className="relative w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition">
                        <Bell className="w-4.5 h-4.5" />
                        {notificationCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-400 border-2 border-white" />
                        )}
                    </button>

                    {/* Settings */}
                    <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition">
                        <Settings className="w-4.5 h-4.5" />
                    </button>

                    {/* Profile */}
                    <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 transition border border-emerald-100">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                            D
                        </div>
                        <span className="text-sm font-medium text-gray-700">Dr. Sarah</span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                </div>
            </div>
        </header>
    );
}
