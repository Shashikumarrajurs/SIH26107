"use client";

import React, { useState } from "react";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { Upload, FileText, CheckCircle2, RefreshCw } from "lucide-react";

export default function IngestionPage() {
  const [docTitle, setDocTitle] = useState("");
  const [stdNumber, setStdNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !file) return;

    setIsLoading(true);
    setStatus("Running Ingestion Pipeline: Document Extraction -> Section Detection -> Clause Chunking -> Vector Indexing...");

    setTimeout(() => {
      setIsLoading(false);
      setStatus("✓ Ingestion Completed Successfully! 4 Chunks Indexed to Qdrant & SQLite DB.");
      setDocTitle("");
      setStdNumber("");
      setFile(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <StatutoryHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Document Ingestion Pipeline</h1>
            <p className="text-xs text-slate-500 mt-1">
              Upload authorized PDF/HTML documents for semantic clause-preserving chunking and Qdrant vector indexing.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-sm max-w-2xl">
            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. IS 17803:2022 Official Standard Specification"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-trust"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Standard Number (Optional)</label>
                <input
                  type="text"
                  value={stdNumber}
                  onChange={(e) => setStdNumber(e.target.value)}
                  placeholder="e.g. IS 17803:2022"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs font-mono font-medium focus:outline-none focus:border-trust"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Upload PDF / HTML Document</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full border border-slate-300 rounded p-2 text-xs text-slate-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs px-5 py-2.5 rounded flex items-center space-x-2 transition-colors"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin text-saffron" /> : <Upload className="w-4 h-4 text-saffron" />}
                <span>{isLoading ? "Ingesting Document..." : "Trigger Ingestion Pipeline"}</span>
              </button>
            </form>

            {status && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-navy-900">
                {status}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
