"use client";

import React from "react";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { BarChart3, Users, MessageSquare, ShieldCheck } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <StatutoryHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Usage Analytics & Intent Distribution</h1>
            <p className="text-xs text-slate-500 mt-1">
              Analytics overview across MSME queries, standard recommendations, and regional lab discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Total User Sessions</span>
              <p className="text-3xl font-extrabold text-navy-900 mt-1">1,482</p>
              <span className="text-[11px] text-bisgreen font-semibold">Active MSME & Startups</span>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Top Intent</span>
              <p className="text-3xl font-extrabold text-trust mt-1">42%</p>
              <span className="text-[11px] text-slate-500">Standard Recommendation</span>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Multilingual Usage</span>
              <p className="text-3xl font-extrabold text-saffron mt-1">31%</p>
              <span className="text-[11px] text-slate-500">Hindi, Kannada, Tamil Queries</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
