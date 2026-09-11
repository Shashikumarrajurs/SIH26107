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
  Sparkles,
  HelpCircle,
  Award,
  Layers,
  FlaskConical,
  Building,
  FileCheck2,
  FileText
} from "lucide-react";

export interface JourneyStep {
  step_number: number;
  short_label?: string;
  title: string;
  status: "COMPLETED" | "IN_PROGRESS" | "ACTION_REQUIRED" | "PENDING" | string;
  summary: string;
  details: string;
  mark?: string;
  plain_language?: string;
}

export interface BISJourneyProps {
  journey?: {
    product_name?: string;
    current_stage?: number;
    is_mandatory_certification?: boolean;
    steps?: JourneyStep[];
  };
}

const STEP_FALLBACK_LABELS: Record<number, string> = {
  1: "1. Scope",
  2: "2. Standard",
  3: "3. Scheme",
  4: "4. Testing",
  5: "5. Find Labs",
  6: "6. BIS License"
};

const STEP_ICONS: Record<number, React.ReactNode> = {
  1: <Layers className="w-3.5 h-3.5" />,
  2: <FileText className="w-3.5 h-3.5" />,
  3: <Award className="w-3.5 h-3.5" />,
  4: <FlaskConical className="w-3.5 h-3.5" />,
  5: <Building className="w-3.5 h-3.5" />,
  6: <FileCheck2 className="w-3.5 h-3.5" />
};

export const BISJourneyStepper: React.FC<BISJourneyProps> = ({ journey }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showPlainLanguage, setShowPlainLanguage] = useState(true);

  if (!journey || !journey.steps || journey.steps.length === 0) return null;

  const currentStep =
    journey.steps.find((s) => s.step_number === (journey.current_stage || 2)) ||
    journey.steps[1] ||
    journey.steps[0];

  const handleStepNodeClick = (stepNum: number) => {
    setIsExpanded(true);
    setTimeout(() => {
      const el = document.getElementById(`journey-step-card-${stepNum}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 80);
  };

  // Sleek compact bar when collapsed
  if (isCollapsed) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 shadow-xs flex items-center justify-between gap-2 text-xs transition-all">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-5 h-5 rounded bg-trust/10 text-trust flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3 text-trust" />
          </div>
          <span className="font-bold text-navy-900 text-xs truncate">
            Conformity Roadmap: <span className="text-trust">{journey.product_name || "Applicable Standard"}</span>
          </span>
          <span className="hidden sm:inline text-[10px] font-mono bg-trust/10 text-trust px-2 py-0.5 rounded font-semibold shrink-0">
            Stage {journey.current_stage || 2} of {journey.steps.length} Active
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-[11px] font-bold text-trust hover:text-navy-900 flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
          >
            <span>Show Stepper</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <Link
            href="/compliance"
            className="text-[11px] text-slate-500 hover:text-navy-900 flex items-center space-x-1 px-1.5 py-1"
            title="Open Full Compliance Roadmap"
          >
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="px-3.5 py-2 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-5 h-5 rounded bg-trust/10 text-trust flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3 text-trust" />
          </div>
          <div className="min-w-0 flex items-center space-x-2">
            <span className="text-xs font-bold text-navy-900 truncate">
              Conformity Roadmap: {journey.product_name || "Applicable Standard"}
            </span>
            {journey.is_mandatory_certification && (
              <span className="hidden md:inline-flex items-center space-x-1 bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200 shrink-0">
                <ShieldAlert className="w-3 h-3 text-rose-600" />
                <span>MANDATORY STATUTORY</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[10px] sm:text-[11px] font-mono font-bold bg-trust/10 text-trust px-2 py-0.5 rounded border border-trust/20">
            Stage {journey.current_stage || 2} of {journey.steps.length} Active
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11px] text-slate-600 hover:text-navy-900 font-medium px-2 py-0.5 rounded hover:bg-slate-100 flex items-center space-x-1 transition-colors"
          >
            <span>{isExpanded ? "Compact" : "View All 6"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsCollapsed(true)}
            className="text-[11px] text-slate-400 hover:text-navy-900 font-medium px-1.5 py-0.5 rounded hover:bg-slate-100"
            title="Minimize Roadmap Banner"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <Link
            href="/compliance"
            className="text-[11px] text-trust hover:text-trust-dark font-semibold px-1.5 py-0.5 rounded hover:bg-trust/5 flex items-center space-x-0.5"
            title="Open Full Compliance Roadmap"
          >
            <span className="hidden md:inline">Matrix</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Connected Horizontal Timeline with Clean, Wrap-Safe Labels */}
      <div className="px-3 py-2.5 bg-white">
        <div className="flex items-start justify-between relative px-1">
          {/* Background Connector Line */}
          <div className="absolute left-6 right-6 top-3 h-0.5 bg-slate-200 z-0"></div>

          {journey.steps.map((step) => {
            const isDone = step.status === "COMPLETED";
            const isCurrent =
              step.status === "IN_PROGRESS" || step.step_number === (journey.current_stage || 2);
            
            // Concise fallback label to prevent any horizontal collisions
            const fallbackLabel = STEP_FALLBACK_LABELS[step.step_number] || `${step.step_number}. Step`;
            const rawLabel = step.short_label || fallbackLabel;
            const displayLabel = rawLabel.length > 15 ? fallbackLabel : rawLabel;

            return (
              <div
                key={step.step_number}
                className="flex-1 min-w-0 max-w-[90px] sm:max-w-[110px] flex flex-col items-center relative z-10 group cursor-pointer px-0.5"
                onClick={() => handleStepNodeClick(step.step_number)}
                title={`Click to view Stage ${step.step_number}: ${step.title}`}
              >
                {/* Node Circle */}
                <div
                  className={`w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-2xs shrink-0 ${
                    isDone
                      ? "bg-emerald-600 text-white ring-2 ring-emerald-100"
                      : isCurrent
                      ? "bg-trust text-white ring-4 ring-trust/20 scale-105"
                      : "bg-white border-2 border-slate-300 text-slate-400 group-hover:border-slate-400"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  ) : isCurrent ? (
                    <Clock className="w-3 h-3 text-white" />
                  ) : (
                    <span>0{step.step_number}</span>
                  )}
                </div>

                {/* Clean Legible Label that never overlaps neighbors */}
                <span
                  className={`text-[10px] sm:text-[11px] mt-1 font-semibold text-center leading-tight block w-full truncate sm:whitespace-normal break-words ${
                    isCurrent ? "font-bold text-trust" : isDone ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {displayLabel}
                </span>
              </div>
            );
          })}
        </div>

        {/* Active Stage Callout Bar */}
        {currentStep && (
          <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5 text-xs">
            <div className="flex items-center space-x-2 text-slate-700 min-w-0">
              <span className="font-bold text-navy-900 bg-slate-100 px-2 py-0.5 rounded text-[10px] sm:text-[11px] shrink-0">
                Stage {currentStep.step_number}: {currentStep.title}
              </span>
              <span className="text-slate-600 truncate hidden md:inline text-[11px]">
                {currentStep.plain_language || currentStep.summary}
              </span>
            </div>
            <span className="text-[10px] font-bold text-trust bg-trust/10 px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
              {currentStep.status === "IN_PROGRESS" ? "Active In Progress" : currentStep.status}
            </span>
          </div>
        )}
      </div>

      {/* Expanded 6-Stage Grid with Plain-Language Guidance for Everyday Citizens - SCROLLABLE */}
      {isExpanded && (
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3 animate-fadeIn max-h-[46vh] sm:max-h-[420px] overflow-y-auto pr-2 scroll-smooth">
          <div className="flex items-center justify-between sticky top-0 bg-slate-50/95 backdrop-blur-xs py-1 z-10 border-b border-slate-200/60 mb-2">
            <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium">
              <HelpCircle className="w-3.5 h-3.5 text-trust" />
              <span>Step-by-step guidance explained in simple terms for citizens, MSMEs, and startups.</span>
            </div>
            <button
              onClick={() => setShowPlainLanguage(!showPlainLanguage)}
              className="text-[11px] text-trust hover:underline font-bold"
            >
              {showPlainLanguage ? "Show Official Details" : "Show Plain English Summary"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {journey.steps.map((step) => {
              const isDone = step.status === "COMPLETED";
              const isCurrent =
                step.status === "IN_PROGRESS" || step.step_number === (journey.current_stage || 2);

              return (
                <div
                  id={`journey-step-card-${step.step_number}`}
                  key={step.step_number}
                  className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between transition-all bg-white shadow-xs scroll-mt-3 ${
                    isDone
                      ? "border-emerald-300 bg-emerald-50/15"
                      : isCurrent
                      ? "border-trust ring-2 ring-trust/20 bg-trust/5 shadow-sm"
                      : "border-slate-200 text-slate-500"
                  }`}
                >
                  <div className="space-y-2">
                    {/* Card Header */}
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md ${
                          isDone
                            ? "bg-emerald-100 text-emerald-800"
                            : isCurrent
                            ? "bg-trust text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {STEP_ICONS[step.step_number]}
                        <span>Step 0{step.step_number}</span>
                      </span>

                      <span className="text-[10px] uppercase font-bold flex items-center gap-1">
                        {isDone ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        ) : isCurrent ? (
                          <span className="text-trust flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 animate-pulse" />
                            In Progress
                          </span>
                        ) : (
                          <span className="text-slate-400">Next Action</span>
                        )}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h4 className="font-bold text-navy-900 text-xs">
                      {step.title}
                    </h4>

                    {/* Plain Language Box (For Common People) */}
                    {showPlainLanguage && step.plain_language && (
                      <div className="p-2 bg-amber-50/70 border border-amber-200/70 rounded-lg text-[11px] text-amber-950 leading-snug">
                        <span className="font-bold text-amber-900 block text-[10px] uppercase tracking-wider mb-0.5">
                          💡 What this means for you:
                        </span>
                        {step.plain_language}
                      </div>
                    )}

                    {/* Official Requirement */}
                    <div className="text-[11px] font-medium text-navy-900 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        BIS Requirement:
                      </span>
                      {step.summary}
                    </div>
                  </div>

                  {/* Technical Procedure / Mark */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      {step.details}
                    </p>
                    {step.mark && (
                      <div className="pt-1">
                        <span className="inline-block bg-trust/10 text-trust text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                          {step.mark}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Scroll Assistance Bar */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/80 sticky bottom-0 bg-slate-50/95 backdrop-blur-xs py-1">
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <span>↕️ Scroll to view all 6 stages (Stages 4–6: Testing, NABL Labs & License Grant)</span>
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-trust hover:underline font-bold text-[11px]"
            >
              Collapse to Compact View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
