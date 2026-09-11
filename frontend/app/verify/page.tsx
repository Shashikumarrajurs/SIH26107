"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
  FileText
} from "lucide-react";

export default function ProductVerificationPage() {
  const [loading, setLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("cml_hawkins");
  const [manualLic, setManualLic] = useState("");
  const [result, setResult] = useState<any>(null);

  const presets = [
    {
      id: "cml_hawkins",
      brand: "Hawkins",
      product: "Domestic Pressure Cooker",
      standard: "IS 2347:2017",
      license: "CM/L-8400192",
      expected: "VERIFIED"
    },
    {
      id: "cml_milton",
      brand: "Milton",
      product: "Thermosteel Water Bottle",
      standard: "IS 17803:2022",
      license: "CM/L-7123456",
      expected: "VERIFIED"
    },
    {
      id: "crs_samsung",
      brand: "Samsung",
      product: "45W USB-C Travel Adapter",
      standard: "IS 13252 (CRS)",
      license: "R-41012345",
      expected: "VERIFIED"
    },
    {
      id: "fake_counterfeit",
      brand: "SuperCooker",
      product: "Counterfeit Pressure Cooker",
      standard: "Fake Mark",
      license: "CM/L-9999999",
      expected: "NOT VERIFIED"
    },
    {
      id: "expired_kettle",
      brand: "QuickBoil",
      product: "Electric Kettle (Expired)",
      standard: "IS 302-2-15",
      license: "CM/L-5551234",
      expected: "EXPIRED"
    },
    {
      id: "invalid_format",
      brand: "Generic",
      product: "Malformed Digits Label",
      standard: "Damaged Mark",
      license: "CM/L-1234",
      expected: "INVALID FORMAT"
    },
    {
      id: "poor_quality",
      brand: "Unclear Photo",
      product: "Blurry / Glare Shelf Packaging",
      standard: "Low Contrast",
      license: "Unreadable",
      expected: "UNABLE TO READ"
    }
  ];

  const handleVerify = async (presetId?: string, manual?: string, simulateOffline?: boolean) => {
    setLoading(true);
    try {
      const payload: any = {};
      if (simulateOffline) {
        payload.simulate_registry_offline = true;
      } else if (manual && manual.trim()) {
        payload.license_number_manual = manual.trim();
      } else {
        payload.preset_id = presetId || selectedPreset;
      }

      const res = await fetch("/api/verify/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        console.error("Verification failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleVerify("cml_hawkins");
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <StatutoryHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* Header Banner */}
          <div className="bg-navy-900 text-white p-6 md:p-8 rounded-2xl shadow-md border border-navy-800 space-y-3 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5" />
              <span>Core Feature 3 · Verify Products Fast</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              BIS Product & Mark Verification Engine
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Upload shelf packaging photos or test sample labels. The system applies OpenCV image enhancement,
              extracts 7-digit ISI CM/L or 8-digit CRS R-numbers, and performs authoritative cross-checking against the BIS CARE registry.
            </p>
          </div>

          {/* Preset Test Selection */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                Select Demonstration Preset Packaging
              </h3>
              <span className="text-xs text-slate-500 font-medium">Click to instantly test OCR & Registry</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {presets.map((p) => {
                const isSelected = selectedPreset === p.id && !manualLic;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPreset(p.id);
                      setManualLic("");
                      handleVerify(p.id);
                    }}
                    className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        p.expected === "VERIFIED" ? "bg-emerald-100 text-emerald-800" :
                        p.expected === "EXPIRED" ? "bg-amber-100 text-amber-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {p.expected}
                      </span>
                      <p className={`text-xs font-bold mt-1.5 truncate ${isSelected ? "text-white" : "text-navy-900"}`}>
                        {p.brand}
                      </p>
                      <p className={`text-[11px] truncate ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        {p.license}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Manual License Input or File Upload */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={manualLic}
                onChange={(e) => setManualLic(e.target.value)}
                placeholder="Or enter CM/L or R-Number manually (e.g. CM/L-8400192)"
                className="flex-1 text-xs border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-trust"
              />
              <button
                onClick={() => handleVerify(undefined, manualLic)}
                disabled={loading}
                className="bg-trust hover:bg-trust-light text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center justify-center space-x-1.5 shadow-sm shrink-0"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>Verify Identifier</span>
              </button>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="space-y-6">
              
              {/* Statutory State Banner */}
              <div className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                result.state === "VERIFIED" ? "bg-emerald-50 border-emerald-300 text-emerald-950" :
                result.state === "INVALID FORMAT" ? "bg-amber-50 border-amber-300 text-amber-950" :
                result.state === "UNABLE TO READ" ? "bg-slate-100 border-slate-300 text-slate-900" :
                result.state === "REGISTRY CHECK UNAVAILABLE" ? "bg-amber-50 border-amber-300 text-amber-950" :
                "bg-red-50 border-red-300 text-red-950"
              }`}>
                <div className="flex items-start space-x-3.5">
                  <div className="pt-0.5">
                    {result.state === "VERIFIED" ? (
                      <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    ) : result.state === "INVALID FORMAT" ? (
                      <AlertTriangle className="w-7 h-7 text-amber-600" />
                    ) : result.state === "UNABLE TO READ" ? (
                      <HelpCircle className="w-7 h-7 text-slate-500" />
                    ) : result.state === "REGISTRY CHECK UNAVAILABLE" ? (
                      <RefreshCw className="w-7 h-7 text-amber-600" />
                    ) : (
                      <XCircle className="w-7 h-7 text-red-600" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        result.state === "VERIFIED" ? "bg-emerald-200 text-emerald-900" :
                        result.state === "INVALID FORMAT" ? "bg-amber-200 text-amber-900" :
                        result.state === "UNABLE TO READ" ? "bg-slate-200 text-slate-800" :
                        result.state === "REGISTRY CHECK UNAVAILABLE" ? "bg-amber-200 text-amber-900" :
                        "bg-red-200 text-red-900"
                      }`}>
                        {result.state_badge?.label || result.state}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {result.extraction?.extracted_number || "NO IDENTIFIER"}
                      </span>
                    </div>
                    <p className="text-sm font-semibold leading-tight">
                      {result.state_badge?.message || result.recommendation}
                    </p>
                    <p className="text-xs text-slate-600">
                      {result.recommendation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-center shrink-0">
                  {result.state === "UNABLE TO READ" && (
                    <button
                      onClick={() => handleVerify(selectedPreset)}
                      className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-1.5 shadow-sm"
                    >
                      <Camera className="w-3.5 h-3.5 text-saffron" />
                      <span>Retake Photo</span>
                    </button>
                  )}
                  {result.next_action && (
                    <Link
                      href={result.next_action.link}
                      className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center space-x-1.5 shadow-sm"
                    >
                      <span>{result.next_action.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-saffron" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Poor Quality / Unreadable Mark Guidance Box */}
              {result.state === "UNABLE TO READ" && result.retake_photo && (
                <div className="bg-white border-2 border-slate-300 rounded-xl p-5 space-y-3 shadow-sm">
                  <div className="flex items-center space-x-2 text-navy-900">
                    <Camera className="w-5 h-5 text-saffron" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wide">
                      I can't read the mark clearly — Photography Guidance
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The OpenCV filter detected high glare or insufficient contrast on the license label. To verify successfully:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {result.retake_photo.instructions?.map((inst: string, idx: number) => (
                      <li key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-trust shrink-0 mt-0.5" />
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Registry Offline Resilience Guidance */}
              {result.state === "REGISTRY CHECK UNAVAILABLE" && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 space-y-2 text-amber-950">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h3 className="text-sm font-bold">BIS Official Registry Service Notice</h3>
                  </div>
                  <p className="text-xs leading-relaxed">
                    The live BIS CARE database query is temporarily unreachable. The extracted mark structure is valid.
                    Verify directly on the official BIS portals:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href="https://www.services.bis.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center space-x-1"
                    >
                      <span>BIS Manakonline Portal</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Grid: OpenCV Pipeline Frames & Registry Report */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left: OpenCV Image Preprocessing Visualization */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <Camera className="w-4 h-4 text-trust" />
                      <h3 className="text-sm font-bold text-navy-900">
                        OpenCV Preprocessing Pipeline
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      4 Filter Stages
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">1. Original Image</p>
                      <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 aspect-video flex items-center justify-center">
                        <img src={result.opencv_pipeline.original} alt="Original" className="w-full h-full object-contain" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">2. Grayscale & Blur</p>
                      <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 aspect-video flex items-center justify-center">
                        <img src={result.opencv_pipeline.grayscale} alt="Grayscale" className="w-full h-full object-contain" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">3. Otsu Binarization</p>
                      <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 aspect-video flex items-center justify-center">
                        <img src={result.opencv_pipeline.binarized} alt="Binarized" className="w-full h-full object-contain" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">4. Detected Mark ROI</p>
                      <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 aspect-video flex items-center justify-center">
                        <img src={result.opencv_pipeline.annotated_roi} alt="Annotated ROI" className="w-full h-full object-contain" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-navy-900">Extracted OCR Metadata:</p>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Identifier Format:</span>
                      <span className="font-mono font-bold text-navy-900">{result.extraction?.type || "UNKNOWN"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Regex Check:</span>
                      <span className="font-bold text-emerald-700">{result.extraction?.is_valid_format ? "PASSED" : "FAILED"}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Authoritative Registry Verification Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-sm font-bold text-navy-900">
                          BIS CARE Official Registry Card
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold bg-trust/10 text-trust px-2 py-0.5 rounded">
                        Statutory Registry
                      </span>
                    </div>

                    {result.registry_record ? (
                      <div className="space-y-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Manufacturer / Licensee</p>
                          <p className="text-sm font-bold text-navy-900">{result.registry_record.manufacturer_name}</p>
                          <p className="text-slate-600 font-medium">{result.registry_record.brand_name} Brand · {result.registry_record.product_name}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-slate-600">
                          <div className="p-2.5 bg-slate-50 rounded border border-slate-200/60">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Standard Number</span>
                            <span className="font-bold text-navy-900 text-xs">{result.registry_record.standard_number}</span>
                          </div>
                          <div className="p-2.5 bg-slate-50 rounded border border-slate-200/60">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Regulatory Status</span>
                            <span className={`font-bold text-xs ${result.registry_record.status === 'OPERATIVE' ? 'text-emerald-700' : 'text-red-700'}`}>
                              {result.registry_record.status}
                            </span>
                          </div>
                          <div className="p-2.5 bg-slate-50 rounded border border-slate-200/60">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Valid From</span>
                            <span className="font-medium text-navy-900">{result.registry_record.valid_from || "Registered"}</span>
                          </div>
                          <div className="p-2.5 bg-slate-50 rounded border border-slate-200/60">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Valid Until</span>
                            <span className="font-medium text-navy-900">{result.registry_record.valid_to || "N/A"}</span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-slate-50 rounded border border-slate-200/60 space-y-1">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span>Registered Factory Location</span>
                          </span>
                          <p className="text-slate-700 text-xs leading-relaxed">{result.registry_record.factory_address || "Factory inspection certified by BIS Regional Office."}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center space-y-3 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                        <div>
                          <p className="text-sm font-bold text-navy-900">No Authoritative Registry Record Found</p>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                            The identifier was checked against the registered database of active BIS licenses and could not be verified.
                          </p>
                        </div>
                        <Link
                          href={`/grievance?lic=${result.extraction?.extracted_number || ""}`}
                          className="inline-flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Report Counterfeit Mark</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Source: Bureau of Indian Standards CARE Portal</span>
                    <span className="text-emerald-700 font-semibold">Zero-Hallucination Verified</span>
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
