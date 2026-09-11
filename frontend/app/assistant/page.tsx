"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { ConfidenceBadge } from "@/components/shared/Badges";
import { VoiceInput } from "@/components/shared/Controls";
import { ProductProfileCard } from "@/components/assistant/ProductProfile";
import { EvidencePanel, EvidenceItem } from "@/components/assistant/EvidencePanel";
import { BISJourneyStepper } from "@/components/journey/BISJourney";
import { sendMessage } from "@/lib/api";
import {
  Send,
  Sparkles,
  Bot,
  User,
  RefreshCw,
  Camera,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  Sliders,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  X
} from "lucide-react";

export default function AssistantPage() {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [viewLevel, setViewLevel] = useState<"level1" | "level2">("level1");

  // Panel collapse/expand states for clean, unconstrained layout
  const [showProfile, setShowProfile] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);

  const [messages, setMessages] = useState<any[]>([
    {
      id: "msg_welcome",
      sender: "assistant",
      content: "Namaste! I am NexaStandards, your evidence-grounded AI assistant for Indian Standards and BIS services (SIH 2026 · Problem SIH26107). Ask about any product (e.g., 'mobile', 'pressure cooker', 'water bottle'), standard, testing parameter, or Gazette order to receive verified, clause-grounded regulatory guidance.",
      confidence: 1.0,
      evidence_status: "GROUNDED",
      payload: null
    }
  ]);

  const [productProfile, setProductProfile] = useState<any>({
    product: "Mobile Phones & Consumer Electronics",
    material: "Electronic Sub-assemblies",
    intended_use: "Telecommunication & Information Processing",
    target_user: "Consumer / Enterprise",
    industry: "Electronics & IT Goods",
    market: "India"
  });

  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([
    {
      id: "chk_13252_1",
      document_id: "doc_13252",
      document_title: "IS 13252 (Part 1):2010 IT Equipment Safety Specification",
      standard_number: "IS 13252 (Part 1):2010",
      clause: "Clause 1.2 & MeitY Order",
      page: 4,
      text: "Compulsory Registration Scheme (CRS): Equipment must be tested for electrical safety, electric shock protection, insulation resistance, and dielectric strength under MeitY Gazette notification.",
      source: "DEMO DATA - SIH PROTOTYPE (BIS Official Repository)",
      relevance_score: 0.98
    },
    {
      id: "chk_16046_1",
      document_id: "doc_16046",
      document_title: "IS 16046 (Part 2):2018 Secondary Cells and Lithium Batteries",
      standard_number: "IS 16046 (Part 2):2018",
      clause: "Clause 8.1",
      page: 12,
      text: "Rechargeable Lithium-ion battery packs incorporated in mobile telephone handsets must independently possess valid BIS registration under Scheme II.",
      source: "DEMO DATA - SIH PROTOTYPE (BIS Official Repository)",
      relevance_score: 0.95
    }
  ]);

  const [currentJourney, setCurrentJourney] = useState<any>({
    product_name: "Mobile Phone",
    current_stage: 2,
    is_mandatory_certification: true,
    steps: [
      { step_number: 1, title: "Product Definition", status: "COMPLETED", summary: "Mobile Phones / Smartphones", details: "Market: India" },
      { step_number: 2, title: "Standards Identification", status: "COMPLETED", summary: "IS 13252 (Part 1):2010 Matched", details: "CRS Mandatory Scheme II" },
      { step_number: 3, title: "Scheme Selection", status: "IN_PROGRESS", summary: "Scheme II (CRS R-Number)", details: "Third-party lab test report required" },
      { step_number: 4, title: "Mandatory Testing", status: "PENDING", summary: "Electrical Safety & Lithium Battery", details: "IS 13252 & IS 16046" },
      { step_number: 5, title: "Recognized Lab Matching", status: "PENDING", summary: "NABL BIS Recognized Labs", details: "MeitY CRS Recognized" },
      { step_number: 6, title: "CRS Portal Registration", status: "PENDING", summary: "Grant of Registration (R-Number)", details: "Valid for 2 years" }
    ]
  });

  // Check URL query on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      if (q) {
        handleSend(q);
      }
    }
  }, []);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsgObj = {
      id: `usr_${Date.now()}`,
      sender: "user",
      content: textToSend
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await sendMessage(textToSend, conversationId, language);
      
      if (response.conversation_id) setConversationId(response.conversation_id);
      if (response.product_profile) setProductProfile(response.product_profile);
      if (response.evidence) {
        setEvidenceList(response.evidence);
        // Automatically reveal evidence if relevant citations exist
        if (response.evidence.length > 0 && window.innerWidth >= 1440) {
          setShowEvidence(true);
        }
      }
      if (response.bis_journey) setCurrentJourney(response.bis_journey);

      const assistantMsgObj = {
        id: `asst_${Date.now()}`,
        sender: "assistant",
        content: response.answer,
        confidence: response.confidence,
        evidence_status: response.evidence_status,
        payload: response
      };

      setMessages((prev) => [...prev, assistantMsgObj]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: "assistant",
          content: "I could not verify this information from the available official BIS sources. I don't want to provide potentially incorrect regulatory information. Please provide more details or check the official BIS source.",
          confidence: 0.4,
          evidence_status: "LOW_EVIDENCE"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: "📱 Mobile Phone (Compliance Graph)", query: "mobile" },
    { label: "❓ Is BIS mandatory for mobile?", query: "Is BIS mandatory for mobile phones?" },
    { label: "🔄 Latest Changes (Mobile)", query: "Show latest changes for mobile phones." },
    { label: "📜 Historical IS 13252:2003", query: "old mobile standard IS 13252:2003" },
    { label: "🍲 Pressure Cooker (IS 2347)", query: "What standard applies to domestic pressure cookers?" },
    { label: "✨ Gold Hallmarking HUID", query: "How does 6-digit HUID hallmarking work for gold jewellery?" },
    { label: "💧 Water Bottle (IS 17803)", query: "What standard applies to stainless steel water bottles?" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <StatutoryHeader currentLanguage={language} onLanguageChange={(l) => setLanguage(l)} />

      <div className="flex-1 flex w-full overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 flex overflow-hidden min-w-0 h-[calc(100vh-85px)]">
          
          {/* OPTIONAL LEFT DRAWER: Product Profile & Trust Specs (Collapsible) */}
          {showProfile && (
            <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col p-4 space-y-4 shrink-0 overflow-y-auto animate-fadeIn z-20">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">Product Intelligence</span>
                <button
                  onClick={() => setShowProfile(false)}
                  className="p-1 rounded hover:bg-slate-200 text-slate-500"
                  title="Close Profile Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ProductProfileCard
                profile={productProfile}
                onUpdate={(updated) => setProductProfile(updated)}
              />

              {/* Statutory Trust Architecture */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5 shadow-xs">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>Trust Architecture</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-trust" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-[11px] font-semibold text-navy-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>SOURCE VERIFIED (Gazette / BIS)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] font-semibold text-navy-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>CURRENT VERSION CHECKED</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] font-semibold text-navy-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>CONFIDENCE GATED (≥ 0.75)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] font-semibold text-navy-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>ZERO-HALLUCINATION FALLBACK</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HERO CENTER PANEL: Spacious Main Chat Area */}
          <div className="flex-1 min-w-0 flex flex-col bg-white overflow-hidden">
            
            {/* Top Interactive Toolbar */}
            <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center space-x-2">
                {/* Toggle Profile Button */}
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all border ${
                    showProfile
                      ? "bg-navy-900 text-white border-navy-900 shadow-xs"
                      : "bg-white text-slate-700 hover:text-navy-900 border-slate-300 hover:bg-slate-100"
                  }`}
                  title="Toggle Product Profile and Trust Attributes"
                >
                  {showProfile ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
                  <span>Product Profile</span>
                </button>

                <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>

                {/* Status Pills */}
                <span className="hidden lg:inline-flex items-center space-x-1 text-[11px] font-medium text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  <span>SIH26107 Statutory Grounding</span>
                </span>
              </div>

              {/* View Switcher and Evidence Toggle */}
              <div className="flex items-center space-x-2">
                {/* Level 1 / Level 2 Switcher */}
                <div className="flex items-center bg-white border border-slate-300 p-0.5 rounded-lg shadow-2xs">
                  <button
                    onClick={() => setViewLevel("level1")}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      viewLevel === "level1"
                        ? "bg-navy-900 text-white shadow-xs"
                        : "text-slate-600 hover:text-navy-900"
                    }`}
                    title="Plain-language summary for consumers"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Level 1: Consumer</span>
                  </button>
                  <button
                    onClick={() => setViewLevel("level2")}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      viewLevel === "level2"
                        ? "bg-trust text-white shadow-xs"
                        : "text-slate-600 hover:text-navy-900"
                    }`}
                    title="Technical clauses, lab testing matrices, and Gazette citations"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Level 2: Technical</span>
                  </button>
                </div>

                {/* Evidence Drawer Toggle */}
                <button
                  onClick={() => setShowEvidence(!showEvidence)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all border ${
                    showEvidence
                      ? "bg-trust text-white border-trust shadow-xs"
                      : "bg-white text-slate-700 hover:text-navy-900 border-slate-300 hover:bg-slate-100"
                  }`}
                  title="Toggle Official BIS Evidence Drawer"
                >
                  {showEvidence ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
                  <span>Evidence ({evidenceList.length})</span>
                </button>
              </div>
            </div>

            {/* BIS Conformity Journey Banner (Dedicated full-width row) */}
            <div className="p-3 bg-slate-50/70 border-b border-slate-200">
              <BISJourneyStepper journey={currentJourney} />
            </div>

            {/* Quick Scenario Queries Bar (Horizontal scrollable chips) */}
            <div className="px-4 py-2 bg-white border-b border-slate-100 flex items-center space-x-2 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-saffron" />
                <span>Quick Prompts:</span>
              </span>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.query)}
                  className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-trust/10 text-slate-700 hover:text-trust border border-slate-200 text-xs font-medium whitespace-nowrap transition-colors shadow-2xs"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Chat Stream Messages (Spacious & High-Contrast) */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-3xl lg:max-w-4xl rounded-xl p-4 md:p-5 space-y-3 text-xs leading-relaxed transition-all shadow-xs ${
                      msg.sender === "user"
                        ? "bg-navy-900 text-white rounded-br-none shadow-sm"
                        : "bg-slate-50 border border-slate-200 text-navy-900 rounded-bl-none"
                    }`}
                  >
                    {/* Message Header */}
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/50">
                      <div className="flex items-center space-x-2 font-bold">
                        {msg.sender === "user" ? (
                          <>
                            <User className="w-3.5 h-3.5 text-saffron" />
                            <span>User Query</span>
                          </>
                        ) : (
                          <>
                            <Bot className="w-3.5 h-3.5 text-saffron" />
                            <span>NexaStandards Regulatory Engine</span>
                          </>
                        )}
                      </div>
                      {msg.sender === "assistant" && (
                        <div className="flex items-center space-x-2">
                          <ConfidenceBadge confidence={msg.confidence || 0.95} status={msg.evidence_status || "GROUNDED"} />
                          <span className="text-[10px] font-mono text-slate-400">
                            {msg.confidence >= 0.75 ? "SOURCE-LOCKED" : "UNVERIFIED"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Level 1 View Content */}
                    {msg.sender === "assistant" && viewLevel === "level1" && msg.payload?.level1_consumer_view ? (
                      <div className="space-y-3">
                        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-lg text-emerald-950">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                            Plain-Language Consumer Guidance:
                          </span>
                          <p className="text-xs leading-relaxed font-normal">
                            {msg.payload.level1_consumer_view.summary}
                          </p>
                        </div>
                        {msg.payload.level1_consumer_view.what_to_look_for && (
                          <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                            <strong className="text-navy-900">What to look for on packaging:</strong>{" "}
                            {msg.payload.level1_consumer_view.what_to_look_for}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Main Raw Answer Text */
                      <div className="prose prose-sm max-w-none font-normal whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                    )}

                    {/* Level 2 Technical Clauses & Citations */}
                    {msg.sender === "assistant" && viewLevel === "level2" && msg.payload?.level2_technical_view && (
                      <div className="mt-3 pt-3 border-t border-slate-200 space-y-3">
                        <div className="flex items-center justify-between bg-trust/10 p-2 rounded text-trust font-bold text-xs">
                          <span>Level 2 Technical Regulatory Evidence</span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Scheme: {msg.payload.level2_technical_view.certification_scheme || "Scheme I / II"}
                          </span>
                        </div>

                        {/* Evidence Citations */}
                        {msg.payload.level2_technical_view.evidence_citations?.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                              Official Clauses Cited:
                            </span>
                            {msg.payload.level2_technical_view.evidence_citations.map((cit: any, i: number) => (
                              <div key={i} className="text-[11px] bg-white p-2.5 rounded border border-slate-200 font-mono flex items-center justify-between">
                                <span>{cit.document} · <strong>{cit.clause}</strong></span>
                                <span className="text-trust font-bold text-[10px]">Relevance: {cit.relevance}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Product Compliance Graph Inline Preview */}
                    {msg.payload?.compliance_graph && (
                      <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                        <div className="flex items-center space-x-1.5 text-xs font-extrabold text-navy-900">
                          <GitBranch className="w-3.5 h-3.5 text-trust" />
                          <span>Product Compliance Graph:</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[11px]">
                          {/* Currently Applicable */}
                          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg space-y-1">
                            <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">
                              Currently Applicable:
                            </span>
                            {msg.payload.compliance_graph.currently_applicable?.map((s: any) => (
                              <div key={s.standard_number} className="font-mono font-bold text-navy-900">
                                {s.standard_number}
                                <span className="text-[10px] font-normal text-slate-600 block">{s.title}</span>
                              </div>
                            ))}
                          </div>

                          {/* Related & Supporting */}
                          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg space-y-1">
                            <span className="text-[10px] font-extrabold text-blue-800 uppercase block">
                              Related / Supporting:
                            </span>
                            {msg.payload.compliance_graph.related_supporting?.map((s: any) => (
                              <div key={s.standard_number} className="font-mono font-bold text-navy-900">
                                {s.standard_number}
                                <span className="text-[10px] font-normal text-slate-600 block">{s.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Upcoming Transition Warning if present */}
                        {msg.payload.compliance_graph.upcoming?.length > 0 && (
                          <div className="bg-amber-50 border border-amber-300 p-3 rounded-lg text-amber-900 text-xs flex items-start space-x-2">
                            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block">Upcoming Standard Transition Scheduled:</strong>
                              {msg.payload.compliance_graph.upcoming.map((u: any) => (
                                <span key={u.standard_number} className="block mt-0.5">
                                  {u.standard_number} — {u.title} (Effective from: <strong>{u.effective_date}</strong>)
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actionable Next Steps */}
                    {msg.payload?.actionable_next_steps?.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1.5">
                        <p className="font-bold text-[10px] uppercase tracking-wider text-saffron">
                          Recommended Actions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {msg.payload.actionable_next_steps.map((act: any, idx: number) => (
                            <Link
                              key={idx}
                              href={act.link}
                              className="bg-white hover:bg-slate-100 text-navy-900 border border-slate-300 font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-xs transition-all"
                            >
                              <span>{act.label}</span>
                              <ChevronRight className="w-3 h-3 text-saffron" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex items-center space-x-2 text-slate-500">
                    <RefreshCw className="w-4 h-4 animate-spin text-trust" />
                    <span>Orchestrating RAG retrieval & verifying BIS evidence citations...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 md:p-4 border-t border-slate-200 bg-slate-50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center space-x-2"
              >
                <VoiceInput onSpeechResult={(text) => setInputMessage(text)} />
                <Link
                  href="/verify"
                  className="p-2.5 rounded-lg border bg-white hover:bg-slate-100 text-slate-700 border-slate-300 transition-all flex items-center justify-center shrink-0 shadow-2xs"
                  title="Upload Product / Shelf Photo (OpenCV + OCR)"
                >
                  <Camera className="w-4 h-4 text-emerald-700" />
                </Link>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask any natural language question about Indian Standards, BIS schemes, testing, or QCOs..."
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-trust text-navy-900 font-medium shadow-2xs"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-navy-900 hover:bg-navy-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
                >
                  <span>Ask AI</span>
                  <Send className="w-3.5 h-3.5 text-saffron" />
                </button>
              </form>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Evidence-Grounded • Source-Locked • Update-Aware (SIH 2026 · Problem SIH26107)</span>
                <span className="hidden sm:inline font-mono">FastAPI + Next.js RAG Engine</span>
              </div>
            </div>

          </div>

          {/* RIGHT DRAWER: Evidence Inspector (Collapsible & Spacious) */}
          {showEvidence && (
            <div className="w-80 lg:w-96 bg-white border-l border-slate-200 p-4 shrink-0 overflow-y-auto hidden md:flex flex-col space-y-3 animate-fadeIn z-20">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">Authoritative Provenance</span>
                <button
                  onClick={() => setShowEvidence(false)}
                  className="p-1 rounded hover:bg-slate-100 text-slate-500"
                  title="Close Evidence Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <EvidencePanel evidence={evidenceList} />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
