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
  ChevronDown,
  Layers,
  FlaskConical,
  Award,
  BookOpen,
  Camera,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  Sliders
} from "lucide-react";

export default function AssistantPage() {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [viewLevel, setViewLevel] = useState<"level1" | "level2">("level1");
  
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

  const [showMobileEvidence, setShowMobileEvidence] = useState(false);

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
      if (response.evidence) setEvidenceList(response.evidence);
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <StatutoryHeader currentLanguage={language} onLanguageChange={(l) => setLanguage(l)} />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        {/* 3-Panel Main Layout */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-85px)]">
          
          {/* LEFT PANEL: Product Profile & Conversation Quick Prompts */}
          <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 flex flex-col p-4 space-y-4 shrink-0 overflow-y-auto hidden md:flex">
            <ProductProfileCard
              profile={productProfile}
              onUpdate={(updated) => setProductProfile(updated)}
            />

            {/* Statutory Trust Badges */}
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

            {/* Quick Demo Prompts */}
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 shadow-xs">
              <p className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-saffron" />
                <span>Quick Scenario Queries</span>
              </p>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => handleSend("mobile")}
                  className="w-full text-left p-2 rounded bg-slate-50 hover:bg-trust/10 hover:text-trust border border-slate-200 font-medium transition-colors font-mono"
                >
                  "mobile" (Full Compliance Graph)
                </button>
                <button
                  onClick={() => handleSend("Is BIS mandatory for mobile phones?")}
                  className="w-full text-left p-2 rounded bg-slate-50 hover:bg-trust/10 hover:text-trust border border-slate-200 font-medium transition-colors"
                >
                  Is BIS mandatory for mobile phones?
                </button>
                <button
                  onClick={() => handleSend("Show latest changes for mobile phones.")}
                  className="w-full text-left p-2 rounded bg-slate-50 hover:bg-trust/10 hover:text-trust border border-slate-200 font-medium transition-colors"
                >
                  Show latest changes for mobile phones
                </button>
                <button
                  onClick={() => handleSend("old mobile standard IS 13252:2003")}
                  className="w-full text-left p-2 rounded bg-slate-50 hover:bg-trust/10 hover:text-trust border border-slate-200 font-medium transition-colors font-mono"
                >
                  old mobile standard IS 13252:2003
                </button>
                <button
                  onClick={() => handleSend("What standard applies to domestic pressure cookers?")}
                  className="w-full text-left p-2 rounded bg-slate-50 hover:bg-trust/10 hover:text-trust border border-slate-200 font-medium transition-colors"
                >
                  Domestic Pressure Cooker (IS 2347)
                </button>
                <button
                  onClick={() => handleSend("How does 6-digit HUID hallmarking work for gold jewellery?")}
                  className="w-full text-left p-2 rounded bg-slate-50 hover:bg-trust/10 hover:text-trust border border-slate-200 font-medium transition-colors"
                >
                  Gold Hallmarking HUID (IS 1417)
                </button>
              </div>
            </div>
          </div>

          {/* CENTER PANEL: Main Chat Stream */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            
            {/* BIS Journey Stepper & View Mode Switcher Header */}
            <div className="p-3 border-b border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <BISJourneyStepper journey={currentJourney} />
                
                {/* Dual-Mode View Switcher (Level 1 vs Level 2) */}
                <div className="flex items-center bg-white border border-slate-300 p-0.5 rounded-lg shadow-2xs shrink-0">
                  <button
                    onClick={() => setViewLevel("level1")}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center space-x-1 ${
                      viewLevel === "level1"
                        ? "bg-navy-900 text-white shadow-xs"
                        : "text-slate-600 hover:text-navy-900"
                    }`}
                    title="Plain-language summary for consumers"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Level 1: Consumer</span>
                  </button>
                  <button
                    onClick={() => setViewLevel("level2")}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center space-x-1 ${
                      viewLevel === "level2"
                        ? "bg-trust text-white shadow-xs"
                        : "text-slate-600 hover:text-navy-900"
                    }`}
                    title="Technical clauses, lab matrices, and Gazette citations for professionals"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Level 2: Technical</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Stream Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-3xl rounded-xl p-4 space-y-3 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-navy-900 text-white rounded-br-none shadow-sm"
                        : "bg-slate-50 border border-slate-200 text-navy-900 rounded-bl-none shadow-xs"
                    }`}
                  >
                    {/* Message Header */}
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/50">
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
                      <div className="space-y-2.5">
                        <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-lg text-emerald-950">
                          <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 block mb-1">
                            Plain-Language Consumer Guidance:
                          </span>
                          <p className="text-xs leading-relaxed">
                            {msg.payload.level1_consumer_view.summary}
                          </p>
                        </div>
                        {msg.payload.level1_consumer_view.what_to_look_for && (
                          <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                            <strong>What to look for:</strong> {msg.payload.level1_consumer_view.what_to_look_for}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Main Raw Answer Text */
                      <div className="prose prose-sm font-normal whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                    )}

                    {/* Level 2 Technical Clauses & Citations */}
                    {msg.sender === "assistant" && viewLevel === "level2" && msg.payload?.level2_technical_view && (
                      <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 bg-white p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-trust">
                            Level 2 Technical Regulatory Evidence
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Scheme: {msg.payload.level2_technical_view.certification_scheme || "Scheme I / II"}
                          </span>
                        </div>

                        {/* Evidence Citations */}
                        {msg.payload.level2_technical_view.evidence_citations?.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-700">Official Clauses Cited:</span>
                            {msg.payload.level2_technical_view.evidence_citations.map((cit: any, i: number) => (
                              <div key={i} className="text-[11px] bg-slate-50 p-2 rounded border border-slate-200 font-mono flex items-center justify-between">
                                <span>{cit.document} · <strong>{cit.clause}</strong></span>
                                <span className="text-trust font-bold text-[10px]">Score: {cit.relevance}</span>
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          {/* Currently Applicable */}
                          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg space-y-1">
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
                          <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-lg space-y-1">
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
                          <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-lg text-amber-900 text-[11px] flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <strong>Scheduled Future Standard Transition:</strong>{" "}
                              {msg.payload.compliance_graph.upcoming.map((u: any) => `${u.standard_number} (${u.user_status_label})`).join(", ")}
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
                              className="bg-white hover:bg-slate-100 text-navy-900 border border-slate-300 font-bold text-[11px] px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-xs transition-all"
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
            <div className="p-3 border-t border-slate-200 bg-slate-50">
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
                  className="p-2 rounded-full border bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 transition-all flex items-center justify-center shrink-0"
                  title="Upload Product / Shelf Photo (OpenCV + OCR)"
                >
                  <Camera className="w-4 h-4 text-emerald-700" />
                </Link>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask any natural language question about Indian Standards or BIS services..."
                  className="flex-1 bg-white border border-slate-300 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-trust text-navy-900 font-medium"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-navy-900 hover:bg-navy-800 text-white px-4 py-2 rounded-md text-xs font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <span>Ask AI</span>
                  <Send className="w-3.5 h-3.5 text-saffron" />
                </button>
              </form>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Evidence-Grounded • Source-Locked • Update-Aware (SIH 2026 · Problem SIH26107)</span>
                <button
                  onClick={() => setShowMobileEvidence(!showMobileEvidence)}
                  className="md:hidden text-trust font-bold flex items-center space-x-1"
                >
                  <span>Evidence Drawer ({evidenceList.length})</span>
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Evidence Inspector */}
          <div className="w-full md:w-96 bg-white border-l border-slate-200 p-4 shrink-0 overflow-y-auto hidden md:block">
            <EvidencePanel evidence={evidenceList} />
          </div>

        </main>
      </div>
    </div>
  );
}
