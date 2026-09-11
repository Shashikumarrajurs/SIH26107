"use client";

import React, { useState } from "react";
import { FileText, Copy, Check, ShieldCheck, ChevronRight, BookOpen } from "lucide-react";

export interface EvidenceItem {
  id: string;
  document_id: string;
  document_title: string;
  standard_number: string;
  clause: string;
  page: number;
  text: string;
  source: string;
  version?: string;
  relevance_score?: number;
}

interface EvidencePanelProps {
  evidence: EvidenceItem[];
  onSelectEvidence?: (item: EvidenceItem) => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ evidence, onSelectEvidence }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCitation = (item: EvidenceItem) => {
    const citationText = `[Citation] ${item.standard_number}, ${item.clause}, Page ${item.page}. Source: ${item.document_title}`;
    navigator.clipboard.writeText(citationText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!evidence || evidence.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-300 rounded-lg">
        <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
        <p className="text-xs font-medium">No retrieved evidence for current query.</p>
        <p className="text-[11px] text-slate-400 mt-1">Ask standard-specific or product questions to view citations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-1.5 text-navy-900 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-trust" />
          <span>Retrieved BIS Evidence ({evidence.length})</span>
        </div>
        <span className="text-[11px] text-bisgreen font-semibold bg-bisgreen-light px-2 py-0.5 rounded-full border border-bisgreen/30">
          Source Traceable
        </span>
      </div>

      <div className="space-y-2.5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
        {evidence.map((item, idx) => (
          <div
            key={item.id || idx}
            className="bg-slate-50 border-l-4 border-l-trust border border-slate-200 rounded-r-lg p-3 hover:shadow-xs transition-shadow space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-navy-900 bg-slate-200 px-2 py-0.5 rounded tracking-tight">
                  {item.standard_number}
                </span>
                <span className="text-xs font-bold text-trust">{item.clause}</span>
              </div>
              <button
                onClick={() => handleCopyCitation(item)}
                className="text-slate-400 hover:text-navy-900 p-1 rounded hover:bg-slate-200 transition-colors shrink-0"
                title="Copy Citation"
              >
                {copiedId === item.id ? (
                  <Check className="w-3.5 h-3.5 text-bisgreen" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <p className="text-xs font-medium text-slate-700 leading-relaxed italic break-words">
              "{item.text}"
            </p>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 gap-2">
              <span className="truncate flex-1 min-w-0" title={`Page ${item.page} | ${item.document_title}`}>
                Page {item.page} · {item.document_title}
              </span>
              {item.relevance_score && (
                <span className="font-mono font-bold text-saffron bg-saffron/15 border border-saffron/30 px-1.5 py-0.5 rounded text-[10px] shrink-0">
                  Score: {Math.round(item.relevance_score * 100)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
