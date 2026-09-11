"use client";

import React, { useState, useEffect } from "react";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { getCertificationGuide } from "@/lib/api";
import { Award, CheckCircle2, FileText, ArrowRight, ExternalLink } from "lucide-react";

export default function CertificationPage() {
  const [schemes, setSchemes] = useState<any[]>([]);

  useEffect(() => {
    getCertificationGuide()
      .then((res) => setSchemes(res.schemes || []))
      .catch(() => {
        setSchemes([
          {
            code: "ISI",
            name: "Scheme I - Product Certification Scheme",
            description: "Standard Mark (ISI) license for domestic and foreign manufacturers.",
            applicability: "Mandatory for 500+ products (steel, electronics, appliances, cement, water bottles)."
          },
          {
            code: "CRS",
            name: "Scheme II - Compulsory Registration Scheme",
            description: "Registration scheme for IT & Electronics goods based on self-declaration of conformity.",
            applicability: "Mandatory for 60+ electronics product categories."
          },
          {
            code: "HALLMARK",
            name: "BIS Hallmarking Scheme",
            description: "Purity certification for gold and silver jewellery.",
            applicability: "Mandatory for gold jewelers in notified districts."
          }
        ]);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <StatutoryHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">BIS Conformity Certification Guidance</h1>
            <p className="text-xs text-slate-500 mt-1">
              Official certification schemes, CML licensing procedures, and mandatory notification rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {schemes.map((sch) => (
              <div key={sch.code} className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <span className="font-mono text-xs font-bold bg-trust-light text-trust px-2 py-0.5 rounded border border-trust/30">
                    {sch.code} SCHEME
                  </span>
                  <h3 className="text-sm font-bold text-navy-900 mt-2">{sch.name}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{sch.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                  <span className="font-bold text-slate-700">Applicability:</span>
                  <p className="text-slate-600 mt-0.5">{sch.applicability}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stepper Guide */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-navy-900">General Step-by-Step CML Licensing Flow</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-trust">Step 1: Product Matching</span>
                <p className="text-slate-600 mt-1">Identify applicable Indian Standard & verify if under mandatory QCO order.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-trust">Step 2: Lab Sample Testing</span>
                <p className="text-slate-600 mt-1">Get samples tested at NABL accredited & BIS recognized laboratory.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-trust">Step 3: Manakonline Portal</span>
                <p className="text-slate-600 mt-1">Submit online application with factory QC details & lab test reports.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-trust">Step 4: Factory Audit</span>
                <p className="text-slate-600 mt-1">BIS inspecting officer audits manufacturing facility & grants CML license.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
