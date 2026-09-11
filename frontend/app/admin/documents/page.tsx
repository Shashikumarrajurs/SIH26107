"use client";

import React, { useState, useEffect } from "react";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { getAdminDocuments } from "@/lib/api";
import { FileText, CheckCircle2, AlertTriangle, Layers } from "lucide-react";

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    getAdminDocuments()
      .then((res) => setDocs(res.documents || []))
      .catch(() => {
        setDocs([
          {
            id: "doc_17803",
            title: "IS 17803:2022 Official Gazette Standard Document",
            standard_number: "IS 17803:2022",
            document_type: "STANDARD",
            source: "DEMO DATA - SIH PROTOTYPE",
            version: "2022.1",
            status: "CURRENT",
            chunk_count: 4
          },
          {
            id: "doc_302_2_15",
            title: "IS 302-2-15:2009 Safety Specification",
            standard_number: "IS 302-2-15:2009",
            document_type: "STANDARD",
            source: "DEMO DATA - SIH PROTOTYPE",
            version: "2009.2",
            status: "CURRENT",
            chunk_count: 2
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
            <h1 className="text-2xl font-bold text-navy-900">Document Registry & Versioning</h1>
            <p className="text-xs text-slate-500 mt-1">
              Audit knowledge versions, document statuses (Current, Superseded, Needs Review), and indexed clause counts.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-navy-900">
                  <th className="p-3 font-bold">Standard Number</th>
                  <th className="p-3 font-bold">Document Title</th>
                  <th className="p-3 font-bold">Type</th>
                  <th className="p-3 font-bold">Version</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold">Chunks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {docs.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-trust">{d.standard_number}</td>
                    <td className="p-3 font-semibold text-navy-900">{d.title}</td>
                    <td className="p-3 font-mono text-slate-600">{d.document_type}</td>
                    <td className="p-3 text-slate-700">{d.version}</td>
                    <td className="p-3">
                      <span className="bg-bisgreen-light text-bisgreen-dark border border-bisgreen/30 font-bold px-2 py-0.5 rounded text-[10px]">
                        {d.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-navy-900">{d.chunk_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
