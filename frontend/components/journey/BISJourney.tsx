"use client";

import React from "react";
import { CheckCircle2, Clock, AlertCircle, ArrowRight, ShieldCheck, Factory, FlaskConical, Building } from "lucide-react";

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
  if (!journey || !journey.steps || journey.steps.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-navy-900">Dynamic BIS Conformity Journey</h3>
            {journey.is_mandatory_certification && (
              <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-300">
                MANDATORY STATUTORY CERTIFICATION
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tailored road map for <span className="font-semibold text-navy-900">{journey.product_name || "Your Product"}</span>
          </p>
        </div>
        <span className="text-xs font-mono font-semibold bg-trust-light text-trust px-2.5 py-1 rounded">
          Stage {journey.current_stage || 2} of 6 Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {journey.steps.map((step) => {
          const isDone = step.status === "COMPLETED";
          const isCurrent = step.status === "IN_PROGRESS";
          const isAction = step.status === "ACTION_REQUIRED";

          return (
            <div
              key={step.step_number}
              className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${
                isDone
                  ? "bg-bisgreen-light/40 border-bisgreen/40 text-navy-900"
                  : isCurrent
                  ? "bg-trust-light border-trust text-navy-900 shadow-sm"
                  : isAction
                  ? "bg-saffron-light border-saffron text-navy-900"
                  : "bg-slate-50 border-slate-200 text-slate-500"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-1">
                  <span>Step 0{step.step_number}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-bisgreen" />
                  ) : isCurrent ? (
                    <Clock className="w-3.5 h-3.5 text-trust animate-pulse" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <h4 className="text-xs font-bold leading-tight line-clamp-2">{step.title}</h4>
                <p className="text-[11px] font-medium text-slate-700 mt-1 line-clamp-2">{step.summary}</p>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-200/60 line-clamp-2">
                {step.details}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
