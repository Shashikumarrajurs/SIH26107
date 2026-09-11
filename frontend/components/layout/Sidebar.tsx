"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  FileText,
  Award,
  FlaskConical,
  MapPin,
  Gem,
  ShieldCheck,
  Bookmark,
  History,
  User,
  Settings,
  Database,
  BarChart3,
  CheckCircle2,
  Layers
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const pillar1Items = [
    { label: "AI Conversational Assistant", href: "/assistant", icon: MessageSquare, badge: "Multimodal" },
  ];

  const pillar2Items = [
    { label: "Standards & QCO Explorer", href: "/standards", icon: FileText },
    { label: "Standard Comparison Matrix", href: "/standards/compare", icon: Layers },
    { label: "Certification Schemes", href: "/certification", icon: Award },
    { label: "Testing Requirements", href: "/testing", icon: FlaskConical },
  ];

  const pillar3Items = [
    { label: "Product Verification (OCR)", href: "/verify", icon: ShieldCheck, badge: "OpenCV" },
    { label: "Gold Hallmarking & HUID", href: "/hallmarking", icon: Gem },
  ];

  const pillar4Items = [
    { label: "Compliance Roadmap", href: "/compliance", icon: CheckCircle2, badge: "Action" },
    { label: "Testing Laboratory Matcher", href: "/laboratories", icon: MapPin },
    { label: "BIS Grievance Assistant", href: "/grievance", icon: ShieldCheck },
  ];

  const adminItems = [
    { label: "Knowledge Specs & RAG", href: "/admin", icon: Database },
    { label: "Document Registry & Ingestion", href: "/admin/documents", icon: FileText },
  ];

  const renderNavGroup = (title: string, items: any[]) => (
    <div>
      <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
        {title}
      </p>
      <nav className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-navy-900 text-white shadow-sm font-semibold"
                  : "text-slate-700 hover:bg-slate-100 hover:text-navy-900"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-saffron" : "text-slate-500"}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  item.badge === "OpenCV" ? "bg-emerald-100 text-emerald-800" :
                  item.badge === "Action" ? "bg-blue-100 text-blue-800" :
                  "bg-saffron/20 text-saffron border border-saffron/30"
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-[calc(100vh-85px)] sticky top-[85px]">
      <div className="p-4 border-b border-slate-100">
        <div className="bg-navy-900 text-white rounded-lg p-3 shadow-inner">
          <p className="text-[10px] text-saffron font-bold uppercase tracking-wider">SIH Problem Statement 26107</p>
          <p className="text-sm font-bold truncate">NexaStandards Engine</p>
          <span className="inline-block mt-1 text-[11px] bg-white/10 text-slate-200 font-medium px-2 py-0.5 rounded">
            Ask · Understand · Verify · Act
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {renderNavGroup("1. Ask in One Place", pillar1Items)}
        {renderNavGroup("2. Understand BIS Docs", pillar2Items)}
        {renderNavGroup("3. Verify Products Fast", pillar3Items)}
        {renderNavGroup("4. Take the Next Action", pillar4Items)}
        {renderNavGroup("Administration", adminItems)}
      </div>


      <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-1">
        <Link
          href="/profile"
          className="flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200/60 rounded-md"
        >
          <User className="w-4 h-4 text-slate-500" />
          <span>User Profile</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200/60 rounded-md"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Settings & LLM</span>
        </Link>
      </div>
    </aside>
  );
};
