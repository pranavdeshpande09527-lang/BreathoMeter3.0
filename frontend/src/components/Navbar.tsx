"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Settings, ChevronDown } from "lucide-react";

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
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
            <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between gap-8">

                {/* Logo */}
                <div className="flex items-center gap-2.5 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5">
                            <path d="M2 10 Q5 5 10 10 Q15 15 18 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 leading-none">Breathometer AI</p>
                        <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Air Quality & Lung Health</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="flex items-center gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab)}
                            className={`relative px-4 py-1.5 rounded-full text-sm transition-colors ${activeTab === tab
                                    ? "text-emerald-700 font-semibold"
                                    : "text-gray-500 hover:text-gray-700 font-medium"
                                }`}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-emerald-50 border border-emerald-200 rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                                />
                            )}
                            <span className="relative">{tab}</span>
                        </button>
                    ))}
                </nav>

                {/* Right actions */}
                <div className="flex items-center gap-2">
                    <AnimatePresence>
                        {searchOpen ? (
                            <motion.input
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 180, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                autoFocus
                                onBlur={() => setSearchOpen(false)}
                                placeholder="Search location…"
                                className="outline-none border border-gray-200 rounded-full px-3 py-1.5 text-sm bg-white text-gray-700 placeholder-gray-400"
                            />
                        ) : (
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        )}
                    </AnimatePresence>

                    <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
                        <Bell className="w-4 h-4" />
                        {notificationCount > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white" />
                        )}
                    </button>

                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
                        <Settings className="w-4 h-4" />
                    </button>

                    <div className="w-px h-5 bg-gray-200 mx-1" />

                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-200">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold">
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
