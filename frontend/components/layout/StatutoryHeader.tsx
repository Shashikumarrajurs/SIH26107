"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles, Building2, Globe2, User, ExternalLink } from "lucide-react";
import { SystemStatusBadge } from "@/components/shared/SystemStatus";
import { useLanguage } from "@/context/LanguageContext";

interface StatutoryHeaderProps {
  currentLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

export const StatutoryHeader: React.FC<StatutoryHeaderProps> = ({
  currentLanguage,
  onLanguageChange
}) => {
  const { language, setLanguage, t, languages } = useLanguage();
  const activeLang = currentLanguage || language;

  const handleLanguageSelect = (newLang: string) => {
    setLanguage(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-navy-900 text-white shadow-md border-b-2 border-saffron">
      {/* Top Official Government Banner */}
      <div className="bg-navy-800 text-xs px-4 py-1.5 flex flex-wrap justify-between items-center border-b border-navy-700">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-saffron">{t("gov_india", "GOVERNMENT OF INDIA")}</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">{t("bis_title", "Bureau of Indian Standards (BIS)")}</span>
          <span className="hidden md:inline bg-saffron/20 text-saffron px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide border border-saffron/30">
            {t("demo_prototype", "DEMO DATA PROTOTYPE")}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <SystemStatusBadge />

          <div className="flex items-center space-x-1.5 text-slate-300 hover:text-white cursor-pointer">
            <Globe2 className="w-3.5 h-3.5 text-saffron" />
            <select
              value={activeLang}
              onChange={(e) => handleLanguageSelect(e.target.value)}
              className="bg-navy-900 text-xs text-slate-200 border border-slate-700 rounded px-1.5 py-0.5 focus:outline-none focus:border-saffron font-medium"
              title="Select Language / ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / भाषा चुनें"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName}
                </option>
              ))}
            </select>
          </div>
          <span className="text-slate-500">|</span>
          <a
            href="https://www.manakonline.in"
            target="_blank"
            rel="noreferrer"
            className="text-slate-300 hover:text-saffron flex items-center space-x-1 text-xs"
          >
            <span>{t("manakonline", "Manakonline")}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1700px] w-full mx-auto px-4 md:px-6 py-2.5 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center space-x-3 group shrink-0 min-w-0">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-trust to-navy-800 flex items-center justify-center border border-trust-light shadow-sm group-hover:scale-105 transition-transform shrink-0">
            <ShieldCheck className="w-6 h-6 text-saffron" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white font-sans">
                {t("app_title", "NexaStandards")}
              </span>
              <span className="bg-bisgreen/20 text-bisgreen border border-bisgreen/40 text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0">
                {t("app_badge", "SIH26107 Assistant")}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-normal truncate max-w-[260px] lg:max-w-xs xl:max-w-md hidden sm:block">
              {t("app_subtitle", "From scattered standards documents to trusted, actionable compliance support.")}
            </p>
          </div>
        </Link>

        <div className="hidden xl:flex items-center space-x-3.5 lg:space-x-4 shrink-0">
          <Link href="/assistant" className="text-xs lg:text-sm font-medium text-slate-200 hover:text-saffron flex items-center space-x-1.5 transition-colors shrink-0">
            <Sparkles className="w-4 h-4 text-saffron shrink-0" />
            <span>{t("nav_assistant", "AI Assistant")}</span>
          </Link>
          <Link href="/verify" className="text-xs lg:text-sm font-medium text-slate-200 hover:text-saffron flex items-center space-x-1 transition-colors shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse shrink-0"></span>
            <span>{t("nav_verify", "Verify Product")}</span>
          </Link>
          <Link href="/standards" className="text-xs lg:text-sm font-medium text-slate-200 hover:text-saffron transition-colors shrink-0">
            {t("nav_standards", "Standards & QCO")}
          </Link>
          <Link href="/compliance" className="text-xs lg:text-sm font-medium text-slate-200 hover:text-saffron transition-colors shrink-0">
            {t("nav_compliance", "Compliance Roadmap")}
          </Link>
          <Link href="/laboratories" className="text-xs lg:text-sm font-medium text-slate-200 hover:text-saffron transition-colors shrink-0">
            {t("nav_labs", "Testing Labs")}
          </Link>
          <Link href="/hallmarking" className="text-xs lg:text-sm font-medium text-slate-200 hover:text-saffron transition-colors shrink-0">
            {t("nav_hallmarking", "Hallmarking")}
          </Link>
          <Link href="/grievance" className="text-xs lg:text-sm font-medium text-slate-200 hover:text-saffron transition-colors shrink-0">
            {t("nav_grievance", "Consumer Grievance")}
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin"
            className="hidden lg:flex items-center space-x-1.5 bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded border border-navy-700 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-saffron" />
            <span>{t("nav_admin", "Admin Portal")}</span>
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
