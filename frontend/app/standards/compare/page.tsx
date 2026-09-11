"use client";

import React, { useState } from "react";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { compareStandards } from "@/lib/api";
import { Layers, ArrowRightLeft, CheckCircle2 } from "lucide-react";

export default function CompareStandardsPage() {
  const [std1, setStd1] = useState("IS 17803");
  const [std2, setStd2] = useState("IS 1489");
  const [comparison, setComparison] = useState<any>({
    standard_1: {
      standard_number: "IS 17803:2022",
      title: "Stainless Steel Vacuum Insulated Flasks and Water Bottles",
      is_mandatory: true,
      scheme_type: "Scheme I (ISI Mark)",
      ics_code: "97.040.60"
    },
    standard_2: {
      standard_number: "IS 1489 (Part 1):2015",
      title: "Portland Pozzolana Cement (Fly Ash Based)",
      is_mandatory: true,
      scheme_type: "Scheme I (ISI Mark)",
      ics_code: "91.100.10"
    },
    comparison_matrix: [
      { parameter: "Mandatory Certification", std1: "YES (Mandatory Order)", std2: "YES (Mandatory Order)" },
      { parameter: "Conformity Assessment Scheme", std1: "Scheme I (ISI Mark)", std2: "Scheme I (ISI Mark)" },
      { parameter: "Target Industry", std1: "Consumer Goods / Utensils", std2: "Construction & Cement" },
      { parameter: "Mandatory Lab Testing", std1: "Lead leaching & Vacuum test", std2: "Compressive strength & Setting time" }
    ]
  });

  const handleCompare = async () => {
    try {
      const res = await compareStandards(std1, std2);
      setComparison(res);
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
            <h1 className="text-2xl font-bold text-navy-900">Standard Comparison Matrix</h1>
            <p className="text-xs text-slate-500 mt-1">
              Side-by-side technical evaluation of Indian Standards, scheme types, and statutory scopes.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Standard 1</label>
                <input
                  type="text"
                  value={std1}
                  onChange={(e) => setStd1(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs font-mono font-medium focus:outline-none focus:border-trust"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Standard 2</label>
                <input
                  type="text"
                  value={std2}
                  onChange={(e) => setStd2(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs font-mono font-medium focus:outline-none focus:border-trust"
                />
              </div>
            </div>

            <button
              onClick={handleCompare}
              className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs px-4 py-2 rounded flex items-center space-x-2 transition-colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-saffron" />
              <span>Compare Standards</span>
            </button>
          </div>

          {/* Matrix Table */}
          {comparison && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-navy-900">
                    <th className="p-3 font-bold uppercase text-[11px] tracking-wider w-1/3">Evaluation Parameter</th>
                    <th className="p-3 font-bold font-mono text-trust text-sm w-1/3">{comparison.standard_1.standard_number}</th>
                    <th className="p-3 font-bold font-mono text-trust text-sm w-1/3">{comparison.standard_2.standard_number}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-700">Standard Title</td>
                    <td className="p-3 font-medium text-navy-900">{comparison.standard_1.title}</td>
                    <td className="p-3 font-medium text-navy-900">{comparison.standard_2.title}</td>
                  </tr>
                  {comparison.comparison_matrix.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-700">{row.parameter}</td>
                      <td className="p-3 text-slate-800 font-medium">{row.std1}</td>
                      <td className="p-3 text-slate-800 font-medium">{row.std2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
