"use client";

import React from "react";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { Bookmark, FileText, Share2 } from "lucide-react";

export default function SavedAnswersPage() {
  const savedItems = [
    {
      id: "sav_01",
      title: "IS 17803 Food Grade SS 304 Material Clause 4.1",
      question: "What material is required for inner liner of stainless steel water bottle?",
      standard: "IS 17803:2022 Clause 4.1",
      date: "2026-09-10"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <StatutoryHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Bookmarked Answers & Regulatory Citations</h1>
            <p className="text-xs text-slate-500 mt-1">
              Persistent repository of verified Indian Standard clauses and compliance requirements.
            </p>
          </div>

          <div className="space-y-3">
            {savedItems.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-5 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-trust bg-trust-light px-2 py-0.5 rounded">
                    {item.standard}
                  </span>
                  <span className="text-[11px] text-slate-400">{item.date}</span>
                </div>
                <h3 className="text-sm font-bold text-navy-900">{item.title}</h3>
                <p className="text-xs text-slate-600 font-medium">Q: "{item.question}"</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
