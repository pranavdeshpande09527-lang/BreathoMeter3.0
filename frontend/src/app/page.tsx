"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/HeroBanner";
import { MetricCards } from "@/components/MetricCards";
import { AQIGaugeCard } from "@/components/AQIGaugeCard";
import { LungHealthCard } from "@/components/LungHealthCard";
import { AIInsightsCard } from "@/components/AIInsightsCard";
import { AQITrendChart } from "@/components/AQITrendChart";
import { AlertsSidebar } from "@/components/AlertsSidebar";
import { HistoryView } from "@/components/HistoryView";
import { ReportsView } from "@/components/ReportsView";
import { AlertsView } from "@/components/AlertsView";
import { MapPin, ChevronDown } from "lucide-react";

type Tab = "Dashboard" | "History" | "Reports" | "Alerts";

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2 },
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Dashboard");

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} notificationCount={3} />

      <main className="max-w-[1400px] mx-auto px-6 py-6">

        {/* Page sub-header (Dashboard only) */}
        {activeTab === "Dashboard" && (
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Live Monitoring</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                {" · "}Auto-refresh every 60s
              </p>
            </div>
            <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition shadow-sm">
              <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <MapPin className="w-2.5 h-2.5 text-emerald-600" />
              </div>
              San Francisco, CA
              <span className="badge badge-moderate ml-1">AQI 85</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === "Dashboard" && (
            <motion.div key="dashboard" {...fade}>
              {/* Hero */}
              <HeroBanner />

              {/* Metric cards */}
              <MetricCards />

              {/* 3-column core cards — equal width */}
              <div className="grid grid-cols-3 gap-5 mb-5">
                <AQIGaugeCard />
                <LungHealthCard />
                <AIInsightsCard />
              </div>

              {/* Bottom row: chart fills, sidebar fixed */}
              <div className="flex gap-5">
                <AQITrendChart />
                <AlertsSidebar />
              </div>
            </motion.div>
          )}

          {activeTab === "History" && (
            <motion.div key="history" {...fade}>
              <HistoryView />
            </motion.div>
          )}

          {activeTab === "Reports" && (
            <motion.div key="reports" {...fade}>
              <ReportsView />
            </motion.div>
          )}

          {activeTab === "Alerts" && (
            <motion.div key="alerts" {...fade}>
              <AlertsView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-100 py-5">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <p className="text-xs text-gray-400">© 2026 Breathometer AI. Production-grade from day one.</p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Support"].map(l => (
              <a key={l} href="#" className="text-xs text-gray-400 hover:text-gray-600 transition">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
