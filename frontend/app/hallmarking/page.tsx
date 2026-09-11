"use client";

import React, { useState } from "react";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { queryHallmarking } from "@/lib/api";
import { Gem, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export default function HallmarkingPage() {
  const [query, setQuery] = useState("How does gold hallmarking work under IS 1417?");
  const [data, setData] = useState<any>({
    standard_number: "IS 1417:2016",
    title: "Gold and Gold Alloys Jewellery - Fineness and Marking",
    mandatory_marks: [
      { symbol: "BIS Triangular Logo", description: "Official BIS mark of purity authentication." },
      { symbol: "Fineness & Purity Mark", description: "22K916 (22 Karat 91.6%), 18K750 (18 Karat 75.0%), 14K585 (14 Karat 58.5%)." },
      { symbol: "6-Digit Alphanumeric HUID Code", description: "Hallmark Unique Identification laser-etched code for complete traceability." }
    ],
    assaying_center_requirements: "Only BIS-recognized Assaying and Hallmarking Centers (AHCs) are legally authorized to apply hallmarks after XRF / Fire Assay testing."
  });

  const handleQuery = async () => {
    try {
      const res = await queryHallmarking(query);
      setData(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <StatutoryHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Gold & Silver Hallmarking Portal</h1>
            <p className="text-xs text-slate-500 mt-1">
              Official regulatory rules for precious metal fineness grades, HUID laser etching, and Assaying Centers under IS 1417.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Hallmarking Query</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-xs font-medium focus:outline-none focus:border-trust"
              />
            </div>
            <button
              onClick={handleQuery}
              className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs px-4 py-2 rounded flex items-center space-x-2 transition-colors"
            >
              <Gem className="w-3.5 h-3.5 text-saffron" />
              <span>Query Hallmarking Rules</span>
            </button>
          </div>

          {/* 3 Mandatory Laser Marks */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-navy-900">3 Mandatory Laser Marks on Gold Jewellery</h2>
              <span className="font-mono text-xs font-bold text-trust bg-trust-light px-2.5 py-0.5 rounded">
                IS 1417:2016
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data?.mandatory_marks?.map((mark: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-xs font-bold text-saffron-high block">Mark {idx + 1}: {mark.symbol}</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{mark.description}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
