"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles, Building2, Globe2, User, ExternalLink } from "lucide-react";
import { SystemStatusBadge } from "@/components/shared/SystemStatus";


interface StatutoryHeaderProps {
  currentLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

export const StatutoryHeader: React.FC<StatutoryHeaderProps> = ({
  currentLanguage = "en",
  onLanguageChange
}) => {
  return (
    <header className="w-full sticky top-0 z-50 bg-navy-900 text-white shadow-md border-b-2 border-saffron">
      {/* Top Official Government Banner */}
      <div className="bg-navy-800 text-xs px-4 py-1.5 flex flex-wrap justify-between items-center border-b border-navy-700">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-saffron">GOVERNMENT OF INDIA</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">Bureau of Indian Standards (BIS)</span>
          <span className="hidden md:inline bg-saffron/20 text-saffron px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide border border-saffron/30">
            DEMO DATA PROTOTYPE
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <SystemStatusBadge />

          <div className="flex items-center space-x-1.5 text-slate-300 hover:text-white cursor-pointer">
            <Globe2 className="w-3.5 h-3.5 text-saffron" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
              className="bg-navy-900 text-xs text-slate-200 border border-slate-700 rounded px-1.5 py-0.5 focus:outline-none focus:border-saffron"
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="ml">മലയാളം (Malayalam)</option>
            </select>
          </div>
          <span className="text-slate-500">|</span>
          <a
            href="https://www.manakonline.in"
            target="_blank"
            rel="noreferrer"
            className="text-slate-300 hover:text-saffron flex items-center space-x-1 text-xs"
          >
            <span>Manakonline</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-trust to-navy-800 flex items-center justify-center border border-trust-light shadow-sm group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-saffron" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white font-sans">
                NexaStandards
              </span>
              <span className="bg-bisgreen/20 text-bisgreen border border-bisgreen/40 text-[11px] px-2 py-0.5 rounded-full font-medium">
                SIH26107 Assistant
              </span>
            </div>
            <p className="text-xs text-slate-300 font-normal">
              From scattered standards documents to trusted, actionable compliance support.
            </p>
          </div>
        </Link>

        <div className="hidden xl:flex items-center space-x-5">
          <Link href="/assistant" className="text-sm font-medium text-slate-200 hover:text-saffron flex items-center space-x-1.5 transition-colors">
            <Sparkles className="w-4 h-4 text-saffron" />
            <span>AI Assistant</span>
          </Link>
          <Link href="/verify" className="text-sm font-medium text-slate-200 hover:text-saffron flex items-center space-x-1 transition-colors">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            <span>Verify Product</span>
          </Link>
          <Link href="/standards" className="text-sm font-medium text-slate-200 hover:text-saffron transition-colors">
            Standards & QCO
          </Link>
          <Link href="/compliance" className="text-sm font-medium text-slate-200 hover:text-saffron transition-colors">
            Compliance Roadmap
          </Link>
          <Link href="/laboratories" className="text-sm font-medium text-slate-200 hover:text-saffron transition-colors">
            Testing Labs
          </Link>
          <Link href="/hallmarking" className="text-sm font-medium text-slate-200 hover:text-saffron transition-colors">
            Hallmarking
          </Link>
          <Link href="/grievance" className="text-sm font-medium text-slate-200 hover:text-saffron transition-colors">
            Consumer Grievance
          </Link>
        </div>


        <div className="flex items-center space-x-3">
          <Link
            href="/admin"
            className="hidden lg:flex items-center space-x-1.5 bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded border border-navy-700 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-saffron" />
            <span>Admin Portal</span>
          </Link>
          <Link
            href="/profile"
            className="w-8 h-8 rounded-full bg-trust/30 border border-trust flex items-center justify-center text-slate-200 hover:text-white"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
