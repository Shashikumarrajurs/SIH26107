"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldAlert,
  Sparkles
} from "lucide-react";

export interface JourneyStep {
  step_number: number;
  title: string;
  status: "COMPLETED" | "IN_PROGRESS" | "ACTION_REQUIRED" | "PENDING" | string;
  summary: string;
  details: string;
}

export interface BISJourneyProps {
  journey?: {
    product_name?: string;
    current_stage?: number;
    is_mandatory_certification?: boolean;
    steps?: JourneyStep[];
  };
}

export const BISJourneyStepper: React.FC<BISJourneyProps> = ({ journey }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!journey || !journey.steps || journey.steps.length === 0) return null;

  const currentStep = journey.steps.find((s) => s.step_number === (journey.current_stage || 2)) || journey.steps[1] || journey.steps[0];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-6 h-6 rounded-md bg-trust/10 text-trust flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-trust" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-navy-900 truncate">
                Conformity Roadmap: {journey.product_name || "Applicable Standard"}
              </span>
              {journey.is_mandatory_certification && (
                <span className="hidden sm:inline-flex items-center space-x-1 bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
                  <ShieldAlert className="w-3 h-3 text-rose-600" />
                  <span>MANDATORY STATUTORY COMPLIANCE</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[11px] font-mono font-bold bg-trust/10 text-trust px-2.5 py-0.5 rounded border border-trust/20">
            Stage {journey.current_stage || 2} of {journey.steps.length} Active
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11px] text-slate-600 hover:text-navy-900 font-medium px-2 py-1 rounded hover:bg-slate-100 flex items-center space-x-1 transition-colors"
          >
            <span>{isExpanded ? "Compact" : "View All 6 Stages"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <Link
            href="/compliance"
            className="text-[11px] text-trust hover:text-trust-dark font-semibold px-2 py-1 rounded hover:bg-trust/5 flex items-center space-x-1"
            title="Open Full Compliance Roadmap"
          >
            <span className="hidden md:inline">Full Matrix</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Connected Horizontal Timeline (Always fits cleanly on any screen width) */}
      <div className="px-4 py-3 bg-white">
        <div className="flex items-center justify-between relative">
          {/* Background Connector Bar */}
          <div className="absolute left-4 right-4 top-3.5 h-0.5 bg-slate-200 z-0"></div>

          {journey.steps.map((step) => {
            const isDone = step.status === "COMPLETED";
            const isCurrent = step.status === "IN_PROGRESS" || step.step_number === (journey.current_stage || 2);

            return (
              <div
                key={step.step_number}
                className="flex flex-col items-center relative z-10 group cursor-pointer"
                onClick={() => setIsExpanded(true)}
              >
                {/* Node Circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all shadow-2xs ${
                    isDone
                      ? "bg-emerald-600 text-white ring-2 ring-emerald-100"
                      : isCurrent
                      ? "bg-trust text-white ring-4 ring-trust/20 animate-pulse scale-105"
                      : "bg-white border-2 border-slate-300 text-slate-400 group-hover:border-slate-400"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : isCurrent ? (
                    <Clock className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <span>0{step.step_number}</span>
                  )}
                </div>

                {/* Node Label (Short title) */}
                <span
                  className={`text-[10px] mt-1 font-medium text-center truncate max-w-[80px] hidden sm:block ${
                    isCurrent ? "font-bold text-trust" : isDone ? "text-slate-700" : "text-slate-400"
                  }`}
                >
                  {step.title.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Active Stage Callout Bar */}
        {currentStep && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2 text-slate-700">
              <span className="font-bold text-navy-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                Stage {currentStep.step_number}: {currentStep.title}
              </span>
              <span className="text-slate-500 truncate max-w-md hidden md:inline">
                {currentStep.summary} — {currentStep.details}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-trust bg-trust/10 px-2 py-0.5 rounded">
              {currentStep.status === "IN_PROGRESS" ? "Operative Active Stage" : currentStep.status}
            </span>
          </div>
        )}
      </div>

      {/* Expanded Grid (Only when user toggles 'View All 6 Stages') */}
      {isExpanded && (
        <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 animate-fadeIn">
          {journey.steps.map((step) => {
            const isDone = step.status === "COMPLETED";
            const isCurrent = step.status === "IN_PROGRESS" || step.step_number === (journey.current_stage || 2);

            return (
              <div
                key={step.step_number}
                className={`p-3 rounded-lg border text-xs flex flex-col justify-between transition-all bg-white shadow-xs ${
                  isDone
                    ? "border-emerald-300 bg-emerald-50/20"
                    : isCurrent
                    ? "border-trust ring-1 ring-trust/30 bg-trust/5"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase mb-1">
                    <span className={isCurrent ? "text-trust" : isDone ? "text-emerald-700" : "text-slate-400"}>
                      Step 0{step.step_number}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : isCurrent ? (
                      <Clock className="w-3.5 h-3.5 text-trust animate-pulse" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-slate-300" />
                    )}
                  </div>
                  <h4 className="font-bold text-navy-900 text-xs mb-1">{step.title}</h4>
                  <p className="text-[11px] text-slate-600">{step.summary}</p>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 font-mono">
                  {step.details}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
