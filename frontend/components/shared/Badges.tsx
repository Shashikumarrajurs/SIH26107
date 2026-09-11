"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";

interface ConfidenceBadgeProps {
  confidence: number;
  status: "GROUNDED" | "LOW_EVIDENCE" | "UNVERIFIED" | string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence, status }) => {
  const percent = Math.round(confidence * 100);
  
  if (status === "GROUNDED") {
    return (
      <div className="inline-flex items-center space-x-1.5 bg-bisgreen-light border border-bisgreen/30 text-bisgreen-dark px-2.5 py-1 rounded-full text-xs font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5 text-bisgreen" />
        <span>Grounded Evidence ({percent}%)</span>
      </div>
    );
  }
  
  if (status === "UNVERIFIED") {
    return (
      <div className="inline-flex items-center space-x-1.5 bg-saffron-light border border-saffron/40 text-saffron-high px-2.5 py-1 rounded-full text-xs font-semibold">
        <AlertTriangle className="w-3.5 h-3.5 text-saffron" />
        <span>Partial Grounding ({percent}%)</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center space-x-1.5 bg-rose-50 border border-rose-200 text-rose-700 px-2.5 py-1 rounded-full text-xs font-semibold">
      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
      <span>Low Evidence Warning</span>
    </div>
  );
};

interface CitationBadgeProps {
  standardNumber: string;
  clause?: string;
  onClick?: () => void;
}

export const CitationBadge: React.FC<CitationBadgeProps> = ({ standardNumber, clause, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-navy-900 px-2 py-0.5 rounded text-xs font-mono font-medium transition-colors"
    >
      <FileText className="w-3 h-3 text-trust" />
      <span>{standardNumber}</span>
      {clause && <span className="text-slate-500 font-sans">({clause})</span>}
    </button>
  );
};
