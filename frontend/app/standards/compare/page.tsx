"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { compareStandards } from "@/lib/api";
import { 
  Layers, 
  ArrowRightLeft, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  FileCheck, 
  ArrowUpDown, 
  Loader2, 
  Info,
  ExternalLink,
  FlaskConical,
  Scale,
  Building2
} from "lucide-react";

const PRESET_PAIRS = [
  {
    title: "Stainless Steel Water Bottles & Domestic Flasks",
    badge: "DPIIT QCO 2023",
    s1: "IS 17803",
    s2: "IS 17526",
    desc: "Compare everyday commercial water bottles vs domestic vacuum flasks specifications"
  },
  {
    title: "IT Equipment Safety vs Harmonized AV/ICT Standard",
    badge: "MeitY CRS Scheme",
    s1: "IS 13252",
    s2: "IS/IEC 62368-1",
    desc: "Evaluate legacy IT safety standard vs next-gen hazard-based safety engineering standard"
  },
  {
    title: "Domestic Pressure Cookers (5th Rev vs 4th Rev)",
    badge: "QCO Revision",
    s1: "IS 2347:2017",
    s2: "IS 2347:2006",
    desc: "Examine statutory changes between Fourth and Fifth revisions under S.O. 1294(E)"
  },
  {
    title: "Lithium Batteries vs Host IT Device Scope",
    badge: "Sub-Assembly Scope",
    s1: "IS 16046 (Part 2)",
    s2: "IS 13252 (Part 1)",
    desc: "Secondary battery cell requirements vs end-product computing device compliance"
  },
  {
    title: "Cross-Sector: Vacuum Insulated Flasks vs Portland Cement",
    badge: "Scheme I ISI",
    s1: "IS 17803",
    s2: "IS 1489",
    desc: "Cross-sector contrast of consumer food-contact utensils vs structural construction materials"
  }
];

const SUGGESTED_STANDARDS = [
  "IS 17803:2022",
  "IS 17526:2021",
  "IS 2347:2017",
  "IS 2347:2006",
  "IS 13252 (Part 1):2010",
  "IS/IEC 62368-1:2023",
  "IS 16046 (Part 2):2018",
  "IS 16333 (Part 3):2022",
  "IS 302-2-15:2009",
  "IS 1417:2016",
  "IS 1489 (Part 1):2015",
  "IS 15658:2006",
  "IS 9873 (Part 1):2019",
  "IS 16102 (Part 1):2012",
  "IS 4151:2015"
];

export default function CompareStandardsPage() {
  const [std1, setStd1] = useState("IS 17803");
  const [std2, setStd2] = useState("IS 17526");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparison, setComparison] = useState<any>(null);

  const executeComparison = async (s1Query: string, s2Query: string) => {
    if (!s1Query.trim() || !s2Query.trim()) {
      setError("Please enter both Standard 1 and Standard 2 numbers to compare.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await compareStandards(s1Query, s2Query);
      setComparison(res);
    } catch (e: any) {
      setError(e.message || "Failed to compare standards. Please check the standard numbers and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Perform initial load comparison on mount
  useEffect(() => {
    executeComparison("IS 17803", "IS 17526");
  }, []);

  const handleSwap = () => {
    const temp = std1;
    setStd1(std2);
    setStd2(temp);
    executeComparison(std2, temp);
  };

  const handlePresetSelect = (p: { s1: string; s2: string }) => {
    setStd1(p.s1);
    setStd2(p.s2);
    executeComparison(p.s1, p.s2);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <StatutoryHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
          {/* Page Title & Statutory Context */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-navy-900 text-saffron text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                  Statutory Evaluation
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Evidence-Grounded • Source-Locked • Update-Aware
                </span>
              </div>
              <h1 className="text-2xl font-bold text-navy-900 mt-1 flex items-center gap-2">
                <Layers className="w-6 h-6 text-trust" />
                Standard Comparison Matrix
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Side-by-side technical evaluation of Indian Standards, scheme types, statutory QCO mandates, and required laboratory tests.
              </p>
            </div>
          </div>

          {/* Quick Presets Carousel / Chips */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-saffron" />
                Quick Statutory Presets
              </span>
              <span className="text-[11px] text-slate-400">Click to instantly evaluate standard pairs</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {PRESET_PAIRS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetSelect(preset)}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    (std1.includes(preset.s1) || preset.s1.includes(std1)) &&
                    (std2.includes(preset.s2) || preset.s2.includes(std2))
                      ? "border-trust bg-trust/5 ring-1 ring-trust"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-navy-900 font-mono">
                      {preset.s1} vs {preset.s2}
                    </span>
                    <span className="text-[9px] font-semibold text-saffron-dark bg-saffron/10 px-1.5 py-0.5 rounded">
                      {preset.badge}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 line-clamp-1">{preset.title}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{preset.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Search & Compare Input Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-5">
                <label className="block text-xs font-bold text-navy-900 mb-1 flex items-center justify-between">
                  <span>Standard 1 (Indian Standard / IS)</span>
                  <span className="text-[10px] text-slate-400 font-normal">e.g. IS 17803, IS 2347</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="standards-list"
                    value={std1}
                    onChange={(e) => setStd1(e.target.value)}
                    placeholder="Search or enter standard (e.g. IS 17803)"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-trust/30 focus:border-trust"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 flex justify-center pb-1">
                <button
                  type="button"
                  onClick={handleSwap}
                  title="Swap Standard 1 and Standard 2"
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-navy-900 transition-colors flex items-center justify-center shadow-xs"
                >
                  <ArrowUpDown className="w-4 h-4 text-trust" />
                </button>
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-bold text-navy-900 mb-1 flex items-center justify-between">
                  <span>Standard 2 (Indian Standard / IS)</span>
                  <span className="text-[10px] text-slate-400 font-normal">e.g. IS 17526, IS 1489</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="standards-list"
                    value={std2}
                    onChange={(e) => setStd2(e.target.value)}
                    placeholder="Search or enter standard (e.g. IS 17526)"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-trust/30 focus:border-trust"
                  />
                </div>
              </div>
            </div>

            {/* Datalist for fast selection */}
            <datalist id="standards-list">
              {SUGGESTED_STANDARDS.map((s, i) => (
                <option key={i} value={s} />
              ))}
            </datalist>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Info className="w-3.5 h-3.5 text-trust" />
                <span>You can enter IS numbers with or without revision years (e.g. <code className="text-navy-900 font-mono font-bold">17803</code> or <code className="text-navy-900 font-mono font-bold">IS 17526</code>)</span>
              </div>
              <button
                onClick={() => executeComparison(std1, std2)}
                disabled={loading}
                className="bg-navy-900 hover:bg-navy-800 disabled:bg-slate-400 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 text-saffron animate-spin" />
                    <span>Evaluating Standards...</span>
                  </>
                ) : (
                  <>
                    <ArrowRightLeft className="w-4 h-4 text-saffron" />
                    <span>Compare Standards</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Alert Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-800 flex items-start gap-3 shadow-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <div className="font-bold text-sm text-red-900">Comparison Failed</div>
                <div>{error}</div>
                <div className="pt-2">
                  <span className="font-semibold text-red-900">Try one of these indexed standards:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {["IS 17803:2022", "IS 17526:2021", "IS 2347:2017", "IS 13252 (Part 1)", "IS/IEC 62368-1", "IS 1489"].map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (error.includes("Standard 1")) setStd1(s);
                          else setStd2(s);
                          setError(null);
                        }}
                        className="bg-white border border-red-300 text-red-900 hover:bg-red-100 font-mono text-[10px] px-2 py-0.5 rounded transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Matrix Table */}
          {comparison && (
            <div className="space-y-6">
              {/* Standards Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden border-t-4 border-t-trust">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-trust uppercase tracking-wider">Standard 1</span>
                      <h2 className="text-lg font-bold text-navy-900 font-mono mt-0.5">
                        {comparison.standard_1.standard_number}
                      </h2>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {comparison.standard_1.is_mandatory ? "MANDATORY QCO" : "VOLUNTARY"}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mb-2">
                    {comparison.standard_1.title}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-3">
                    {comparison.standard_1.scope}
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-mono">ICS: {comparison.standard_1.ics_code || "97.040.60"}</span>
                    <Link
                      href={`/standards/${comparison.standard_1.id || 'std_17803'}`}
                      className="text-trust hover:underline font-bold inline-flex items-center gap-1"
                    >
                      <span>Full Specification</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden border-t-4 border-t-saffron">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-saffron-dark uppercase tracking-wider">Standard 2</span>
                      <h2 className="text-lg font-bold text-navy-900 font-mono mt-0.5">
                        {comparison.standard_2.standard_number}
                      </h2>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {comparison.standard_2.is_mandatory ? "MANDATORY QCO" : "VOLUNTARY"}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mb-2">
                    {comparison.standard_2.title}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-3">
                    {comparison.standard_2.scope}
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-mono">ICS: {comparison.standard_2.ics_code || "97.040.60"}</span>
                    <Link
                      href={`/standards/${comparison.standard_2.id || 'std_17526'}`}
                      className="text-trust hover:underline font-bold inline-flex items-center gap-1"
                    >
                      <span>Full Specification</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Comparison Table */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-trust" />
                    <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                      Technical & Regulatory Parameters
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {comparison.comparison_matrix?.length || 8} parameters evaluated
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-navy-900">
                        <th className="p-3.5 font-bold uppercase text-[11px] tracking-wider w-1/4">
                          Evaluation Parameter
                        </th>
                        <th className="p-3.5 font-bold font-mono text-trust text-sm w-[37.5%] border-l border-slate-200">
                          {comparison.standard_1.standard_number}
                        </th>
                        <th className="p-3.5 font-bold font-mono text-saffron-dark text-sm w-[37.5%] border-l border-slate-200">
                          {comparison.standard_2.standard_number}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {comparison.comparison_matrix.map((row: any, idx: number) => {
                        const isHighlightRow = 
                          row.parameter.includes("Mandatory") || 
                          row.parameter.includes("Technical Distinction") ||
                          row.parameter.includes("Mandatory Lab Testing");

                        return (
                          <tr 
                            key={idx} 
                            className={`transition-colors ${
                              isHighlightRow ? "bg-amber-50/30 hover:bg-amber-50/60" : "hover:bg-slate-50/80"
                            }`}
                          >
                            <td className="p-3.5 font-bold text-slate-700 bg-slate-50/50">
                              {row.parameter}
                            </td>
                            <td className="p-3.5 text-slate-800 border-l border-slate-200">
                              {row.parameter === "Mandatory Certification" ? (
                                <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                  {row.std1}
                                </span>
                              ) : row.parameter === "Conformity Assessment Scheme" ? (
                                <span className="inline-flex items-center gap-1 font-bold text-trust bg-trust/10 px-2 py-0.5 rounded text-[11px]">
                                  <ShieldCheck className="w-3 h-3 text-trust" />
                                  {row.std1}
                                </span>
                              ) : (
                                <span className="font-medium text-slate-800">{row.std1}</span>
                              )}
                            </td>
                            <td className="p-3.5 text-slate-800 border-l border-slate-200">
                              {row.parameter === "Mandatory Certification" ? (
                                <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                  {row.std2}
                                </span>
                              ) : row.parameter === "Conformity Assessment Scheme" ? (
                                <span className="inline-flex items-center gap-1 font-bold text-trust bg-trust/10 px-2 py-0.5 rounded text-[11px]">
                                  <ShieldCheck className="w-3 h-3 text-trust" />
                                  {row.std2}
                                </span>
                              ) : (
                                <span className="font-medium text-slate-800">{row.std2}</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detailed Testing Procedures Comparison */}
              {(comparison.standard_1.tests?.length > 0 || comparison.standard_2.tests?.length > 0) && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <FlaskConical className="w-4 h-4 text-trust" />
                    <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                      Mandated Laboratory Testing Parameters Breakdown
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2.5">
                      <div className="text-xs font-bold text-trust font-mono pb-1 border-b border-slate-200">
                        {comparison.standard_1.standard_number} Required Tests:
                      </div>
                      <div className="space-y-2">
                        {(comparison.standard_1.tests || []).map((t: any, i: number) => (
                          <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                            <div className="font-bold text-navy-900 flex items-center justify-between">
                              <span>{t.name}</span>
                              {t.clause && (
                                <span className="text-[10px] font-mono bg-trust/10 text-trust px-1.5 py-0.2 rounded">
                                  Clause {t.clause}
                                </span>
                              )}
                            </div>
                            {t.parameter && (
                              <div className="text-[11px] text-slate-600">
                                <span className="font-semibold">Parameter:</span> {t.parameter}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div className="text-xs font-bold text-saffron-dark font-mono pb-1 border-b border-slate-200">
                        {comparison.standard_2.standard_number} Required Tests:
                      </div>
                      <div className="space-y-2">
                        {(comparison.standard_2.tests || []).map((t: any, i: number) => (
                          <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                            <div className="font-bold text-navy-900 flex items-center justify-between">
                              <span>{t.name}</span>
                              {t.clause && (
                                <span className="text-[10px] font-mono bg-saffron/10 text-saffron-dark px-1.5 py-0.2 rounded">
                                  Clause {t.clause}
                                </span>
                              )}
                            </div>
                            {t.parameter && (
                              <div className="text-[11px] text-slate-600">
                                <span className="font-semibold">Parameter:</span> {t.parameter}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Statutory Advisory Notice */}
              <div className="bg-navy-900 text-white rounded-xl p-5 shadow-sm space-y-2">
                <div className="flex items-center space-x-2 text-saffron">
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Statutory Compliance Guidance
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Manufacturers must register with BIS under the exact Indian Standard applicable to their intended product category and commercial distribution. When Quality Control Orders (QCO) are notified by Central Ministries (e.g. DPIIT, MeitY, MoHFW), compliance and ISI/CRS marking become compulsory by law under Section 16 & 17 of the BIS Act, 2016.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-[11px] text-slate-300">
                  <span>• Scheme I: ISI Mark Certificate of Conformity</span>
                  <span>• Scheme II: Compulsory Registration Scheme (CRS)</span>
                  <span>• Scheme IV: Gold & Silver Jewellery Hallmarking</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
