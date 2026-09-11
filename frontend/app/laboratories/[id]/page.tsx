"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { MapPin, ArrowLeft, Phone, Mail, CheckCircle2, ShieldCheck } from "lucide-react";

export default function LaboratoryDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "lab_001";

  const lab = {
    id: id,
    lab_code: "BIS-LAB-DEL-01",
    name: "Central Laboratory Bureau of Indian Standards - Sahibabad",
    location: "Plot 20/9, Site IV, Industrial Area, Sahibabad",
    city: "Ghaziabad / Delhi NCR",
    state: "Uttar Pradesh",
    address: "Site IV Sahibabad Industrial Area, Ghaziabad, UP 201010",
    contact_email: "cl-sahibabad@bis.gov.in",
    contact_phone: "+91-120-2895000",
    accreditation_status: "NABL ACCREDITED (ISO/IEC 17025)",
    is_bis_recognized: true,
    capabilities: [
      { standard: "IS 17803:2022", scope: "Stainless Steel Water Bottles & Vacuum Flasks", valid_until: "2028-12-31" },
      { standard: "IS 302-2-15:2009", scope: "Household Electrical Liquid Heaters & Kettles", valid_until: "2028-09-30" }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <StatutoryHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <Link href="/laboratories" className="text-xs font-bold text-trust hover:underline flex items-center space-x-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Laboratories Directory</span>
          </Link>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-navy-900 bg-slate-100 px-2.5 py-1 rounded">
                  {lab.lab_code}
                </span>
                <h1 className="text-xl font-bold text-navy-900 mt-2">{lab.name}</h1>
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-saffron" />
                  <span>{lab.address}</span>
                </div>
              </div>

              <span className="bg-bisgreen-light text-bisgreen-dark border border-bisgreen/30 text-xs font-bold px-3 py-1 rounded-full">
                {lab.accreditation_status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1">
                <span className="font-bold text-slate-700">Official Contact Email:</span>
                <p className="text-trust font-medium">{lab.contact_email}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1">
                <span className="font-bold text-slate-700">Telephone Line:</span>
                <p className="text-navy-900 font-medium">{lab.contact_phone}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3">
                Accredited Testing Capabilities
              </h3>
              <div className="space-y-2">
                {lab.capabilities.map((cap, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono font-bold text-navy-900">{cap.standard}</span>
                      <p className="text-slate-600 font-medium">{cap.scope}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Valid Until: {cap.valid_until}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
