"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  Download,
  ExternalLink,
  Store,
  Tag,
  Building2,
  Phone,
  Mail,
  Scale
} from "lucide-react";

function GrievanceContent() {
  const searchParams = useSearchParams();
  const initialLic = searchParams.get("lic") || "";

  const [productName, setProductName] = useState("Domestic Pressure Cooker");
  const [allegedLic, setAllegedLic] = useState(initialLic);
  const [sellerName, setSellerName] = useState("");
  const [sellerAddress, setSellerAddress] = useState("");
  const [purchasePlatform, setPurchasePlatform] = useState("Retail Shop");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [complaintType, setComplaintType] = useState("FAKE_ISI_MARK");
  const [description, setDescription] = useState(
    "The product packaging displays an ISI mark with an invalid or non-existent license number. When checked against the official BIS CARE registry, no operative record was found."
  );
  const [complainantName, setComplainantName] = useState("");
  const [complainantEmail, setComplainantEmail] = useState("");
  const [complainantPhone, setComplainantPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [dossierResult, setDossierResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialLic) {
      setAllegedLic(initialLic);
      if (initialLic.includes("9999999")) {
        setProductName("Counterfeit Pressure Cooker (Suspected Fake)");
        setSellerName("Super Bazaar Wholesale Mart");
        setSellerAddress("Shop 14, Commercial Market, New Delhi");
      }
    }
  }, [initialLic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/grievance/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: productName,
          alleged_license_number: allegedLic,
          seller_name: sellerName || "Unspecified Retailer",
          seller_address: sellerAddress,
          purchase_platform: purchasePlatform,
          invoice_number: invoiceNo,
          complaint_type: complaintType,
          description: description,
          complainant_name: complainantName || "Concerned Consumer",
          complainant_email: complainantEmail,
          complainant_phone: complainantPhone
        })
      });
      if (res.ok) {
        const data = await res.json();
        setDossierResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (dossierResult?.formatted_dossier) {
      navigator.clipboard.writeText(dossierResult.formatted_dossier);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <StatutoryHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* Header */}
          <div className="bg-navy-900 text-white p-6 md:p-8 rounded-2xl shadow-md border border-navy-800 space-y-3 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center space-x-2 bg-red-500/20 text-red-300 border border-red-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-saffron" />
              <span>Consumer Protection · BIS Act 2016</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              BIS Consumer Grievance & Counterfeit Assistance
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Encountered a fake ISI mark, expired license misuse, or substandard goods?
              Prepare a formal statutory legal complaint dossier citing Section 14, 15, and 29 of the Bureau of Indian Standards Act, 2016 for enforcement action.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Form: 7 Columns */}
            <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-navy-900">
                  Grievance Particulars Form
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in the vendor and product details to generate your statutory complaint.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="space-y-1">
                  <label className="font-bold text-navy-900 flex items-center space-x-1">
                    <Tag className="w-3 h-3 text-slate-500" />
                    <span>Product Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Domestic Pressure Cooker"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-trust focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-navy-900 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-slate-500" />
                    <span>Alleged CM/L or R-Number Printed on Box</span>
                  </label>
                  <input
                    type="text"
                    value={allegedLic}
                    onChange={(e) => setAllegedLic(e.target.value)}
                    placeholder="e.g. CM/L-9999999 or R-XXXXXXXX"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-mono focus:ring-2 focus:ring-trust focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-navy-900 flex items-center space-x-1">
                      <Store className="w-3 h-3 text-slate-500" />
                      <span>Vendor / Seller Name *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      placeholder="Shop or Seller Name"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-trust focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-navy-900">Purchase Mode</label>
                    <select
                      value={purchasePlatform}
                      onChange={(e) => setPurchasePlatform(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white focus:ring-2 focus:ring-trust focus:outline-none"
                    >
                      <option value="Retail Shop">Physical Retail Shop / Market</option>
                      <option value="E-Commerce">E-Commerce Marketplace (Amazon/Flipkart/etc)</option>
                      <option value="Wholesaler">Wholesaler / Distributor</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-navy-900">Seller Location / Address</label>
                  <input
                    type="text"
                    value={sellerAddress}
                    onChange={(e) => setSellerAddress(e.target.value)}
                    placeholder="e.g. Shop 14, Main Market, City, State"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-trust focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-navy-900">Complaint Category</label>
                    <select
                      value={complaintType}
                      onChange={(e) => setComplaintType(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-white focus:ring-2 focus:ring-trust focus:outline-none"
                    >
                      <option value="FAKE_ISI_MARK">Counterfeit / Fake ISI Mark</option>
                      <option value="EXPIRED_LICENSE">Misuse of Expired/Suspended License</option>
                      <option value="SUBSTANDARD_QUALITY">Hazardous / Sub-Standard Quality</option>
                      <option value="NO_MANDATORY_MARK">Missing Mandatory Mark under QCO</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-navy-900">Invoice / Bill Number</label>
                    <input
                      type="text"
                      value={invoiceNo}
                      onChange={(e) => setInvoiceNo(e.target.value)}
                      placeholder="Optional Bill No."
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-trust focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-navy-900">Narrative Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-trust focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-navy-900 hover:bg-navy-800 text-white font-extrabold py-3 rounded-lg text-xs flex items-center justify-center space-x-2 shadow-md transition-colors"
                >
                  <Scale className="w-4 h-4 text-saffron" />
                  <span>Generate Statutory Legal Complaint Dossier</span>
                </button>
              </form>
            </div>

            {/* Right Display: 6 Columns */}
            <div className="lg:col-span-6 space-y-4">
              {dossierResult ? (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Statutory Reference</span>
                        <p className="text-base font-extrabold text-navy-900">{dossierResult.complaint_ref_no}</p>
                      </div>
                      <button
                        onClick={handleCopy}
                        className="bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? "Copied!" : "Copy Dossier"}</span>
                      </button>
                    </div>

                    <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-[11px] leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap border border-slate-800 shadow-inner">
                      {dossierResult.formatted_dossier}
                    </div>

                    {/* Official Channels */}
                    <div className="space-y-2 pt-2 text-xs">
                      <p className="font-extrabold text-navy-900 uppercase tracking-wider text-[11px]">
                        Where to Submit This Dossier:
                      </p>
                      <div className="space-y-1.5">
                        {dossierResult.submission_channels?.map((ch: any, idx: number) => (
                          <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-navy-900">{ch.channel}</span>
                              <a href={ch.url} target="_blank" rel="noreferrer" className="text-trust hover:underline text-[11px] font-semibold flex items-center space-x-1">
                                <span>Open Portal</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            <p className="text-[11px] text-slate-600">{ch.method}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Framed under BIS Act 2016</span>
                    <span className="text-emerald-700 font-semibold">Enforcement Ready</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                  <Scale className="w-12 h-12 text-slate-300" />
                  <div className="space-y-1 max-w-sm">
                    <h4 className="text-base font-bold text-navy-900">No Dossier Generated Yet</h4>
                    <p className="text-xs text-slate-500">
                      Fill in the details on the left form and click "Generate Statutory Legal Complaint Dossier" to draft your formal submission for BIS enforcement.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

export default function GrievancePage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-100 text-xs font-bold text-slate-500">Loading Grievance Assistant...</div>}>
      <GrievanceContent />
    </React.Suspense>
  );
}

