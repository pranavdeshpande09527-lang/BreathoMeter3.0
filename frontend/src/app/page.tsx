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

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Dashboard");

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        notificationCount={3}
      />

      {/* Main content */}
      <main className="max-w-[1400px] mx-auto px-6 py-6">

        {/* Location sub-header (only on Dashboard) */}
        {activeTab === "Dashboard" && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Live Monitoring{" "}
              <span className="text-sm font-normal text-gray-400 ml-2">
                {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · Auto-refresh every 60s
              </span>
            </h2>
            <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:shadow transition">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <MapPin className="w-3 h-3 text-white" />
              </div>
              San Francisco, CA
              <span className="text-[10px] text-amber-500 font-medium bg-amber-50 rounded-full px-2 py-0.5">AQI 85 · Moderate</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === "Dashboard" && (
            <motion.div
              key="dashboard"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              {/* Hero Banner */}
              <HeroBanner />

              {/* Live Monitoring header */}
              <h3 className="text-base font-semibold text-gray-700 mb-3">Live Monitoring</h3>

              {/* Metric cards row */}
              <MetricCards />

              {/* Core cards: AQI | Lung | AI Insights */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <AQIGaugeCard />
                <LungHealthCard />
                <AIInsightsCard />
              </div>

              {/* Bottom row: Trend chart + Alerts */}
              <div className="flex gap-4">
                <AQITrendChart />
                <AlertsSidebar />
              </div>
            </motion.div>
          )}

          {activeTab === "History" && (
            <motion.div
              key="history"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <HistoryView />
            </motion.div>
          )}

          {activeTab === "Reports" && (
            <motion.div
              key="reports"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <ReportsView />
            </motion.div>
          )}

          {activeTab === "Alerts" && (
            <motion.div
              key="alerts"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <AlertsView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-100 py-6">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between text-xs text-gray-400">
          <span>© 2026 Breathometer AI. Production-grade from day one.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-600 transition">Privacy</a>
            <a href="#" className="hover:text-gray-600 transition">Terms</a>
            <a href="#" className="hover:text-gray-600 transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
