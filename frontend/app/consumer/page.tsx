"use client";

import React, { useState } from "react";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { queryConsumer } from "@/lib/api";
import { ShieldCheck, Search, Smartphone, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ConsumerPage() {
  const [cml, setCml] = useState("8500192");
  const [data, setData] = useState<any>({
    how_to_verify_isi_mark: [
      "Check for the standard ISI mark logo on the product packaging.",
      "Verify the CML (Certificate of Manufacturer License) 7-digit number printed below the logo.",
      "Enter the CML number in BIS Care App 'Verify License' option to verify manufacturer name, address, valid scope, and expiration date."
    ],
    how_to_verify_huid: [
      "Locate 6-digit alphanumeric code laser-etched on gold jewellery.",
      "Open BIS Care App -> 'Verify HUID' feature.",
      "View registered jeweller details, AHC center name, hallmarking date, and purity grade."
    ],
    complaint_redressal: "Consumers can lodge statutory quality complaints directly via BIS Care App or email consumer@bis.gov.in."
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <StatutoryHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Consumer Verification & Authenticity Portal</h1>
            <p className="text-xs text-slate-500 mt-1">
              Verify ISI marks, CML licenses, 6-digit HUID gold hallmarking codes, and lodge quality complaints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ISI Mark Verification Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <ShieldCheck className="w-5 h-5 text-bisgreen" />
                <h2 className="text-base font-bold text-navy-900">Verify ISI Mark / CML License</h2>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Enter CML License Number (7-digits)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cml}
                    onChange={(e) => setCml(e.target.value)}
                    className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-trust"
                  />
                  <button className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs px-3 py-1.5 rounded">
                    Verify
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-600">
                <p className="font-bold text-navy-900">Verification Steps:</p>
                <ul className="space-y-1.5 list-disc pl-4">
                  {data?.how_to_verify_isi_mark?.map((step: string, idx: number) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* BIS Care App Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Smartphone className="w-5 h-5 text-trust" />
                <h2 className="text-base font-bold text-navy-900">BIS Care Official Mobile App</h2>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Download the official BIS Care app for instant mobile verification of ISI marks, CRS registrations, HUID jewellery codes, and lodging quality complaints.
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-1">
                <span className="font-bold text-navy-900 block">Statutory Redressal:</span>
                <p className="text-slate-600">{data?.complaint_redressal}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
