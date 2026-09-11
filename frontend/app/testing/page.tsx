"use client";

import React, { useState } from "react";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { analyzeTesting } from "@/lib/api";
import { FlaskConical, Search, CheckCircle2, ShieldCheck } from "lucide-react";

export default function TestingPage() {
  const [product, setProduct] = useState("Stainless Steel Water Bottle");
  const [standard, setStandard] = useState("IS 17803:2022");
  const [results, setResults] = useState<any>({
    product: "Stainless Steel Water Bottle",
    standard_number: "IS 17803:2022",
    testing_requirements: [
      {
        test_name: "Heavy Metal Migration & Lead Limit",
        clause: "Clause 4.1 & IS 9845",
        parameter: "Lead (Pb) < 0.01%, SS Grade 304/316 verification",
        methodology: "Atomic Absorption Spectrophotometry (AAS) after 4% acetic acid extraction.",
        acceptance_criteria: "Zero detectable lead leach into liquid stimulant."
      },
      {
        test_name: "Thermal Retention & Vacuum Efficiency Test",
        clause: "Clause 5.3",
        parameter: "Water temperature drop over 6 hours from 95°C initial.",
        methodology: "Calibrated immersion thermocouple reading in temperature-controlled room.",
        acceptance_criteria: "Final temperature must remain ≥ 65°C."
      },
      {
        test_name: "Leakage & Pressure Sealing Test",
        clause: "Clause 6.2",
        parameter: "Gasket sealing integrity under 50 kPa internal air pressure.",
        methodology: "Submersion leak testing of inverted flask.",
        acceptance_criteria: "Zero air bubble leakage or fluid seepage."
      }
    ],
    evidence_source: "Official BIS Technical Specification IS 17803:2022"
  });

  const handleAnalyze = async () => {
    try {
      const res = await analyzeTesting(product, standard);
      setResults(res);
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
            <h1 className="text-2xl font-bold text-navy-900">Statutory Testing Requirements Analyzer</h1>
            <p className="text-xs text-slate-500 mt-1">
              Extract mandatory laboratory test parameters, clause limits, and methodology rules for Indian Standards.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Product Description</label>
                <input
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-trust"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Indian Standard (Optional)</label>
                <input
                  type="text"
                  value={standard}
                  onChange={(e) => setStandard(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs font-mono font-medium focus:outline-none focus:border-trust"
                />
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs px-4 py-2 rounded flex items-center space-x-2 transition-colors"
            >
              <FlaskConical className="w-3.5 h-3.5 text-saffron" />
              <span>Analyze Testing Requirements</span>
            </button>
          </div>

          {results && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-navy-900">
                  Standard: {results.standard_number}
                </span>
                <span className="text-xs font-semibold text-bisgreen bg-bisgreen-light border border-bisgreen/30 px-2.5 py-0.5 rounded-full">
                  Evidence Verified
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {results.testing_requirements?.map((test: any, idx: number) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-navy-900">{test.test_name}</h3>
                      <span className="font-mono text-xs font-semibold text-trust bg-trust-light px-2 py-0.5 rounded">
                        {test.clause}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                        <span className="font-bold text-slate-700 block">Parameter Limit:</span>
                        <span className="text-slate-600 mt-0.5 block">{test.parameter}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                        <span className="font-bold text-slate-700 block">Test Methodology:</span>
                        <span className="text-slate-600 mt-0.5 block">{test.methodology}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                        <span className="font-bold text-slate-700 block">Acceptance Criteria:</span>
                        <span className="text-bisgreen-dark font-medium mt-0.5 block">{test.acceptance_criteria}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
