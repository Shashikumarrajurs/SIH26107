"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { getStandardDetail } from "@/lib/api";
import { FileText, ArrowLeft, ShieldCheck, CheckCircle2, Layers, BookOpen } from "lucide-react";

export default function StandardDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "std_17803";
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getStandardDetail(id)
      .then((res) => setData(res))
      .catch(() => {
        setData({
          standard: {
            standard_number: "IS 17803:2022",
            title: "Stainless Steel Vacuum Insulated Flasks and Water Bottles - Specification",
            scope: "This standard specifies requirements for double-walled stainless steel vacuum insulated flasks, bottles, and food containers intended for everyday consumer use.",
            is_mandatory: true,
            scheme_type: "Scheme I (ISI Mark)",
            ics_code: "97.040.60",
            revision_year: "2022"
          },
          testing_requirements: [
            {
              test_name: "Heavy Metal Migration & Lead Limit",
              clause: "Clause 4.1",
              parameter: "Lead (Pb) < 0.01%, SS Grade 304/316 verification",
              acceptance_criteria: "Zero detectable lead leach into liquid stimulant."
            },
            {
              test_name: "Thermal Retention & Vacuum Efficiency",
              clause: "Clause 5.3",
              parameter: "Water temperature drop over 6 hours from 95°C initial.",
              acceptance_criteria: "Final temperature must remain ≥ 65°C."
            }
          ]
        });
      });
  }, [id]);

  const std = data?.standard || {
    standard_number: "IS 17803:2022",
    title: "Stainless Steel Vacuum Insulated Flasks and Water Bottles",
    scope: "Specifies requirements for double-walled stainless steel vacuum insulated flasks and water bottles.",
    is_mandatory: true,
    scheme_type: "Scheme I (ISI Mark)"
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <StatutoryHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <Link href="/standards" className="text-xs font-bold text-trust hover:underline flex items-center space-x-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Standards Catalog</span>
          </Link>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="font-mono text-base font-extrabold text-navy-900 bg-slate-100 px-3 py-1 rounded border border-slate-300">
                  {std.standard_number}
                </span>
                <h1 className="text-xl font-bold text-navy-900 mt-2">{std.title}</h1>
              </div>
              <span className="bg-bisgreen-light text-bisgreen-dark border border-bisgreen/30 text-xs font-bold px-3 py-1 rounded-full">
                {std.scheme_type}
              </span>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Standard Scope</h3>
              <p className="text-xs text-slate-700 leading-relaxed">{std.scope}</p>
            </div>

            {/* Clause Graph / Structure */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-trust" />
                <span>Statutory Testing Clauses</span>
              </h3>

              <div className="space-y-3">
                {data?.testing_requirements?.map((req: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1 text-xs">
                    <div className="flex justify-between items-center font-bold text-navy-900">
                      <span>{req.test_name}</span>
                      <span className="font-mono text-trust">{req.clause}</span>
                    </div>
                    <p className="text-slate-600"><span className="font-semibold text-slate-700">Parameter:</span> {req.parameter}</p>
                    <p className="text-slate-600"><span className="font-semibold text-slate-700">Acceptance Criteria:</span> {req.acceptance_criteria}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
