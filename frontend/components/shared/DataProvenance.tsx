"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, ExternalLink } from "lucide-react";

interface ProvenanceProps {
  standard?: string;
  source?: string;
  sourceUrl?: string;
  lastVerified?: string;
  authorityLevel?: "AUTHORIZED_STATUTORY" | "DEMO_BENCHMARK" | "UNVERIFIED";
  isDemo?: boolean;
  compact?: boolean;
}

const AUTHORITY_CONFIG = {
  AUTHORIZED_STATUTORY: {
    bg: "bg-bisgreen-light border-bisgreen",
    text: "text-bisgreen-dark",
    icon: ShieldCheck,
    label: "Authorized Statutory Source",
    iconColor: "text-bisgreen"
  },
  DEMO_BENCHMARK: {
    bg: "bg-saffron-light border-saffron/50",
    text: "text-amber-800",
    icon: AlertTriangle,
    label: "SIH Demo Benchmark Data",
    iconColor: "text-saffron"
  },
  UNVERIFIED: {
    bg: "bg-red-50 border-red-300",
    text: "text-red-800",
    icon: AlertTriangle,
    label: "Unverified Source",
    iconColor: "text-red-600"
  }
};

export function DataProvenanceBanner({
  standard,
  source,
  sourceUrl,
  lastVerified,
  authorityLevel = "DEMO_BENCHMARK",
  isDemo = true,
  compact = false
}: ProvenanceProps) {
  const config = AUTHORITY_CONFIG[authorityLevel];
  const Icon = config.icon;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${config.bg} ${config.text}`}>
        <Icon className={`w-3 h-3 ${config.iconColor}`} />
        <span>{config.label}</span>
        {isDemo && <span className="opacity-70">· DEMO</span>}
      </div>
    );
  }

  return (
    <div className={`rounded-lg border p-3 space-y-1 ${config.bg}`}>
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1.5 text-xs font-bold ${config.text}`}>
          <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
          <span>DATA PROVENANCE · {config.label}</span>
        </div>
        {isDemo && (
          <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded font-bold tracking-wide">
            SIH PROTOTYPE DEMO
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] text-slate-600">
        {standard && (
          <span><strong className="text-slate-700">Standard:</strong> {standard}</span>
        )}
        {source && (
          <span><strong className="text-slate-700">Source:</strong> {source}</span>
        )}
        {lastVerified && (
          <span><strong className="text-slate-700">Last Verified:</strong> {lastVerified}</span>
        )}
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-trust flex items-center gap-0.5 hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Verify at BIS Portal
          </a>
        )}
      </div>

      {isDemo && (
        <p className="text-[10px] text-amber-700 italic border-t border-amber-300 pt-1">
          ⚠️ Data flagged as SIH Prototype Demo Benchmark. Verify all information against official BIS publications and Manakonline before commercial or regulatory decisions.
        </p>
      )}
    </div>
  );
}

interface CitationSourceBadgeProps {
  standard: string;
  clause: string;
  page?: number;
  relevanceScore?: number;
}

export function CitationSourceBadge({ standard, clause, page, relevanceScore }: CitationSourceBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 bg-trust/10 border border-trust/30 text-trust text-[10px] font-mono px-1.5 py-0.5 rounded">
      <ShieldCheck className="w-2.5 h-2.5" />
      {standard} · {clause}{page ? ` · p.${page}` : ""}
      {relevanceScore !== undefined && (
        <span className="text-bisgreen font-bold">
          {(relevanceScore * 100).toFixed(0)}%
        </span>
      )}
    </span>
  );
}
