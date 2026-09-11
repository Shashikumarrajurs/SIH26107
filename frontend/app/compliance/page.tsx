"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  CheckCircle2,
  Layers,
  FileText,
  Award,
  FlaskConical,
  Building2,
  MapPin,
  ExternalLink,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  ChevronRight
} from "lucide-react";

function ComplianceRoadmapContent() {
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get("product") || "Pressure Cooker";

  const [productName, setProductName] = useState(initialProduct);
  const [manufacturerType, setManufacturerType] = useState("MSME");
  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState<any>(null);

  const fetchRoadmap = async (prod: string, mType: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/compliance/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_name: prod, manufacturer_type: mType })
      });
      if (res.ok) {
        const data = await res.json();
        setRoadmapData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap(productName, manufacturerType);
  }, []);

  const sampleProducts = [
    { name: "Pressure Cooker", category: "Kitchen Appliances", standard: "IS 2347" },
    { name: "Stainless Steel Water Bottle", category: "Consumer Durables", standard: "IS 17803" },
    { name: "Electric Kettle", category: "Heating Appliances", standard: "IS 302-2-15" },
    { name: "USB Power Adapter", category: "IT Electronics", standard: "IS 13252 (CRS)" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <StatutoryHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* Header Section */}
          <div className="bg-navy-900 text-white p-6 md:p-8 rounded-2xl shadow-md border border-navy-800 space-y-3 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-trust/20 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center space-x-2 bg-trust/30 text-sky-300 border border-trust/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-saffron" />
              <span>Core Feature 4 · Take the Next Action</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              BIS Conformity & Compliance Roadmap Engine
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Generate a tailored, statutory 6-stage certification pathway for your manufacturing business.
              Distinguishes Scheme-I (ISI Mark) from Scheme-II (CRS), outlines mandatory testing matrices, and provides factory audit preparation checklists.
            </p>
          </div>

          {/* Product Selector Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                Select Your Product Profile
              </h3>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-500 font-semibold">Scale:</span>
                <select
                  value={manufacturerType}
                  onChange={(e) => {
                    setManufacturerType(e.target.value);
                    fetchRoadmap(productName, e.target.value);
                  }}
                  className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold text-navy-900"
                >
                  <option value="MSME">Micro, Small & Medium Enterprise (MSME)</option>
                  <option value="Startup">Recognized Startup (DPIIT)</option>
                  <option value="Large">Large Manufacturing Industry</option>
                  <option value="Importer">Authorized Importer</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sampleProducts.map((p) => {
                const isSelected = productName.toLowerCase() === p.name.toLowerCase();
                return (
                  <button
                    key={p.name}
                    onClick={() => {
                      setProductName(p.name);
                      fetchRoadmap(p.name, manufacturerType);
                    }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isSelected ? "bg-saffron text-navy-900" : "bg-slate-200 text-slate-800"}`}>
                      {p.standard}
                    </span>
                    <p className={`text-xs font-bold mt-1.5 truncate ${isSelected ? "text-white" : "text-navy-900"}`}>
                      {p.name}
                    </p>
                    <p className={`text-[11px] truncate ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                      {p.category}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Roadmap Stepper & Stages */}
          {roadmapData && (
            <div className="space-y-6">
              
              {/* Executive Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applicable Standard</span>
                  <p className="text-base font-extrabold text-navy-900">{roadmapData.applicable_standard}</p>
                  <span className="text-xs text-emerald-700 font-semibold inline-block">Mandatory QCO Enforced</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Certification Scheme</span>
                  <p className="text-base font-extrabold text-trust">{roadmapData.scheme}</p>
                  <span className="text-xs text-slate-500">Includes Factory Audit + Testing</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accredited Testing Labs</span>
                  <p className="text-base font-extrabold text-navy-900">{roadmapData.laboratories_count} BIS Recognized Labs</p>
                  <Link href={`/laboratories?product=${productName}`} className="text-xs text-saffron-high font-bold hover:underline flex items-center space-x-1">
                    <span>View Lab Contacts</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* 6-Stage Detailed Stepper */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-navy-900">
                      6-Stage Conformity Assessment Pathway
                    </h3>
                    <p className="text-xs text-slate-500">
                      Progressive workflow derived from BIS (Conformity Assessment) Regulations
                    </p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="hidden sm:flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-navy-900 bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Dossier</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {roadmapData.roadmap.map((stage: any) => (
                    <div
                      key={stage.stage_number}
                      className="border border-slate-200 rounded-xl p-5 hover:border-trust transition-all space-y-3 bg-slate-50/50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-3">
                          <span className="w-7 h-7 rounded-full bg-navy-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {stage.stage_number}
                          </span>
                          <h4 className="text-sm font-bold text-navy-900">
                            {stage.stage_name}
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-trust/10 text-trust self-start sm:self-auto">
                          {stage.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {stage.summary}
                      </p>

                      {/* Stage Specific Renders */}
                      {stage.stage_number === 4 && stage.details.testing_matrix && (
                        <div className="overflow-x-auto pt-2">
                          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                              <tr>
                                <th className="p-2.5">Mandatory Test</th>
                                <th className="p-2.5">Clause</th>
                                <th className="p-2.5">Key Parameter</th>
                                <th className="p-2.5">Acceptance Criteria</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                              {stage.details.testing_matrix.map((t: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/80">
                                  <td className="p-2.5 font-bold text-navy-900">{t.test_name}</td>
                                  <td className="p-2.5 text-slate-500 font-mono text-[11px]">{t.clause}</td>
                                  <td className="p-2.5 text-slate-700">{t.parameter}</td>
                                  <td className="p-2.5 text-emerald-800 font-medium">{t.acceptance_criteria}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {stage.stage_number === 5 && stage.details.checklist && (
                        <div className="space-y-1.5 pt-2">
                          <p className="text-[11px] font-bold text-navy-900 uppercase">Audit Documentation Checklist:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {stage.details.checklist.map((item: string, idx: number) => (
                              <label key={idx} className="flex items-start space-x-2 text-xs text-slate-700 bg-white p-2 rounded border border-slate-200/80 cursor-pointer">
                                <input type="checkbox" className="mt-0.5 text-trust rounded" />
                                <span>{item}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {stage.stage_number === 6 && (
                        <div className="pt-2 flex flex-col sm:flex-row gap-3">
                          <a
                            href={stage.details.portal_url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-saffron hover:bg-saffron-high text-navy-900 font-bold text-xs px-4 py-2 rounded-lg flex items-center justify-center space-x-1.5 shadow-sm"
                          >
                            <span>Open Manakonline Application Portal</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <Link
                            href={`/laboratories?product=${productName}`}
                            className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center justify-center space-x-1.5 shadow-sm"
                          >
                            <span>Contact Recognized Testing Labs</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}

                    </div>
                  ))}
                </div>

                {/* Fee Structure Summary */}
                {roadmapData.fee_summary && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <p className="font-extrabold text-navy-900 uppercase tracking-wider flex items-center space-x-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>Statutory Fee Estimate (Indicative for {manufacturerType})</span>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Application Fee</span>
                        <span className="font-bold text-navy-900">{roadmapData.fee_summary.application_fee}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Inspection Fee</span>
                        <span className="font-bold text-navy-900">{roadmapData.fee_summary.inspection_fee}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Testing Fee</span>
                        <span className="font-bold text-navy-900">{roadmapData.fee_summary.testing_fee}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Annual Fee</span>
                        <span className="font-bold text-navy-900">{roadmapData.fee_summary.marking_fee || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default function ComplianceRoadmapPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-100 text-xs font-bold text-slate-500">Loading Compliance Assistant...</div>}>
      <ComplianceRoadmapContent />
    </React.Suspense>
  );
}

