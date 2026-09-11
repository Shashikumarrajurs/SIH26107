"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { getStandardsList } from "@/lib/api";
import {
  FileText,
  Search,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Filter,
  AlertTriangle,
  Layers,
  BookOpen,
  Calendar,
  Building2
} from "lucide-react";

export default function StandardsPage() {
  const [activeTab, setActiveTab] = useState<"standards" | "gazette">("standards");
  const [standards, setStandards] = useState<any[]>([]);
  const [gazetteOrders, setGazetteOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getStandardsList()
      .then((res) => setStandards(res.standards || []))
      .catch(() => {
        setStandards([
          {
            id: "std_2347",
            standard_number: "IS 2347:2017",
            title: "Domestic Pressure Cookers - Specification",
            is_mandatory: true,
            scheme_type: "Scheme I (ISI Mark)",
            scope: "Specifies requirements for material, construction, finish, bursting strength, operating pressure, and safety devices for domestic pressure cookers."
          },
          {
            id: "std_17803",
            standard_number: "IS 17803:2022",
            title: "Stainless Steel Vacuum Insulated Flasks and Water Bottles",
            is_mandatory: true,
            scheme_type: "Scheme I (ISI Mark)",
            scope: "Specifies requirements for double-walled stainless steel vacuum insulated flasks and water bottles."
          },
          {
            id: "std_302_2_15",
            standard_number: "IS 302-2-15:2009",
            title: "Safety of Household Electrical Liquid Heaters and Kettles",
            is_mandatory: true,
            scheme_type: "Scheme I / CRS",
            scope: "Safety specification for portable boiling water appliances operating up to 250V."
          },
          {
            id: "std_1417",
            standard_number: "IS 1417:2016",
            title: "Gold and Gold Alloys Jewellery - Fineness and Marking",
            is_mandatory: true,
            scheme_type: "Hallmarking Scheme",
            scope: "Specifies fineness levels (22K, 18K, 14K) and mandatory hallmarking marks."
          }
        ]);
      });

    // Fetch Gazette Orders
    fetch("/api/gazette")
      .then((res) => res.json())
      .then((data) => setGazetteOrders(data || []))
      .catch(() => {
        setGazetteOrders([
          {
            id: "qco_001",
            order_number: "S.O. 1294(E)",
            title: "Domestic Pressure Cooker (Quality Control) Order, 2023",
            ministry: "Ministry of Commerce and Industry (DPIIT)",
            date_of_notification: "2023-03-15",
            effective_date: "2023-09-01",
            status: "CURRENT",
            supersedes_order: "S.O. 3857(E)",
            affected_standards: "IS 2347:2017",
            mandatory_scheme: "Scheme I (ISI Mark)",
            has_supersession_notice: true
          },
          {
            id: "qco_002",
            order_number: "S.O. 3857(E)",
            title: "Domestic Pressure Cooker (Quality Control) Order, 2020",
            ministry: "Ministry of Consumer Affairs",
            date_of_notification: "2020-01-21",
            effective_date: "2020-08-01",
            status: "SUPERSEDED",
            superseded_by_order: "S.O. 1294(E)",
            affected_standards: "IS 2347:2017",
            mandatory_scheme: "Scheme I (ISI Mark)",
            has_supersession_notice: true
          },
          {
            id: "qco_003",
            order_number: "S.O. 4582(E)",
            title: "Stainless Steel Vacuum Insulated Flasks (Quality Control) Order, 2023",
            ministry: "Ministry of Commerce and Industry (DPIIT)",
            date_of_notification: "2023-10-20",
            effective_date: "2024-04-19",
            status: "CURRENT",
            affected_standards: "IS 17803:2022",
            mandatory_scheme: "Scheme I (ISI Mark)",
            has_supersession_notice: false
          }
        ]);
      });
  }, []);

  const filteredStandards = standards.filter(
    (s) =>
      s.standard_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGazette = gazetteOrders.filter(
    (g) =>
      g.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.affected_standards.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <StatutoryHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-navy-900">
                Indian Standards & Gazette QCO Explorer
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Core Feature 2 · Authoritative standards catalog, Quality Control Orders, and chronological supersession alerts.
              </p>
            </div>
            <Link
              href="/standards/compare"
              className="bg-navy-900 hover:bg-navy-800 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <Layers className="w-4 h-4 text-saffron" />
              <span>Side-by-Side Comparison</span>
            </Link>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-2">
            <button
              onClick={() => setActiveTab("standards")}
              className={`pb-3 px-4 text-xs font-extrabold transition-colors border-b-2 flex items-center space-x-2 ${
                activeTab === "standards"
                  ? "border-saffron text-navy-900"
                  : "border-transparent text-slate-500 hover:text-navy-900"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Indian Standards ({filteredStandards.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("gazette")}
              className={`pb-3 px-4 text-xs font-extrabold transition-colors border-b-2 flex items-center space-x-2 ${
                activeTab === "gazette"
                  ? "border-saffron text-navy-900"
                  : "border-transparent text-slate-500 hover:text-navy-900"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Gazette QCO Orders & Supersession Tracking ({filteredGazette.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={activeTab === "standards" ? "Search by IS number (e.g. IS 2347, IS 17803) or product title..." : "Search by QCO Order No (e.g. S.O. 1294(E)) or affected standard..."}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-trust text-navy-900 font-medium"
              />
            </div>
          </div>

          {/* TAB 1: STANDARDS CATALOG */}
          {activeTab === "standards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStandards.map((std) => (
                <div key={std.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-extrabold text-navy-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                        {std.standard_number}
                      </span>
                      {std.is_mandatory ? (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full">
                          MANDATORY QCO
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
                          VOLUNTARY
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-navy-900 leading-snug">{std.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{std.scope}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-trust bg-trust/10 px-2 py-0.5 rounded">
                      {std.scheme_type}
                    </span>
                    <Link
                      href={`/compliance?product=${encodeURIComponent(std.title.split('-')[0].trim())}`}
                      className="text-xs font-bold text-navy-900 hover:text-saffron flex items-center space-x-1"
                    >
                      <span>Get Roadmap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: GAZETTE NOTIFICATIONS & SUPERSESSION TRACKING */}
          {activeTab === "gazette" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-900 space-y-1">
                <p className="font-bold flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-trust" />
                  <span>Chronological Gazette & Supersession Intelligence</span>
                </p>
                <p className="text-blue-800">
                  NexaStandards tracks amendment histories and supersession notices so manufacturers never produce under outdated regulatory orders.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGazette.map((g) => (
                  <div
                    key={g.id}
                    className={`bg-white rounded-xl border p-5 space-y-3 shadow-sm ${
                      g.status === "SUPERSEDED" ? "border-amber-300 bg-amber-50/20" : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-extrabold text-navy-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                        {g.order_number}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        g.status === "CURRENT" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {g.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-navy-900 leading-snug">
                      {g.title}
                    </h4>

                    {/* Supersession Warning Banner */}
                    {g.status === "SUPERSEDED" && (
                      <div className="p-3 bg-amber-100/70 border border-amber-300 rounded-lg text-xs text-amber-900 flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">⚠️ Superseded Document Notice</p>
                          <p className="text-[11px] mt-0.5">
                            This earlier Quality Control Order was superseded by newer order <strong>{g.superseded_by_order}</strong>. Ensure compliance with the current active order.
                          </p>
                        </div>
                      </div>
                    )}

                    {g.supersedes_order && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                        <p className="font-semibold">
                          ✅ Supersedes Earlier Order: <span className="font-mono">{g.supersedes_order}</span>
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                      <div className="p-2 bg-slate-50 rounded">
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Affected Standard</span>
                        <span className="font-mono font-bold text-navy-900">{g.affected_standards}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded">
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Effective Date</span>
                        <span className="font-bold text-navy-900">{g.effective_date}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 italic">
                      Issuing Authority: {g.ministry}
                    </p>
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
