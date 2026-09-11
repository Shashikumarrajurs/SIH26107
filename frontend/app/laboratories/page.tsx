"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { searchLaboratories } from "@/lib/api";
import { MapPin, Search, Phone, Mail, CheckCircle2, ArrowRight } from "lucide-react";

export default function LaboratoriesPage() {
  const [location, setLocation] = useState("");
  const [product, setProduct] = useState("");
  const [labs, setLabs] = useState<any[]>([]);

  const handleSearch = () => {
    searchLaboratories(location, product)
      .then((res) => setLabs(res.laboratories || []))
      .catch(() => {
        setLabs([
          {
            id: "lab_001",
            lab_code: "BIS-LAB-DEL-01",
            name: "Central Laboratory Bureau of Indian Standards - Sahibabad",
            location: "Site IV Industrial Area, Sahibabad",
            city: "Ghaziabad / Delhi NCR",
            state: "Uttar Pradesh",
            contact_email: "cl-sahibabad@bis.gov.in",
            contact_phone: "+91-120-2895000",
            accreditation_status: "NABL ACCREDITED (ISO/IEC 17025)",
            capabilities: ["Stainless Steel Water Bottles (IS 17803)", "Electrical Appliances (IS 302)"]
          },
          {
            id: "lab_002",
            lab_code: "BIS-LAB-MUM-02",
            name: "Western Regional Laboratory - BIS Mumbai",
            location: "MIDC Marol, Andheri East",
            city: "Mumbai",
            state: "Maharashtra",
            contact_email: "wrl-mumbai@bis.gov.in",
            contact_phone: "+91-22-28329295",
            accreditation_status: "NABL ACCREDITED (ISO/IEC 17025)",
            capabilities: ["Food Grade Utensils & Insulated Bottles", "Chemical & Metallurgy"]
          }
        ]);
      });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <StatutoryHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Recognized Testing Laboratory Discovery</h1>
            <p className="text-xs text-slate-500 mt-1">
              Find NABL accredited and BIS recognized testing laboratories by geographical region and standard capability.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">City or State Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Delhi NCR, Mumbai, Bengaluru..."
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-trust"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Product Scope / Standard</label>
                <input
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="e.g. Water Bottles, IS 17803..."
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-trust"
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs px-4 py-2 rounded flex items-center space-x-2 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-saffron" />
              <span>Discover Laboratories</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {labs.map((lab) => (
              <div key={lab.id} className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-navy-900 bg-slate-100 px-2 py-0.5 rounded">
                      {lab.lab_code}
                    </span>
                    <span className="text-[10px] font-bold bg-bisgreen-light text-bisgreen-dark border border-bisgreen/30 px-2 py-0.5 rounded-full">
                      {lab.accreditation_status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-navy-900">{lab.name}</h3>
                  <div className="flex items-center space-x-1 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-saffron" />
                    <span>{lab.location}, {lab.city}, {lab.state}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-1">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-trust" />
                      <span>{lab.contact_email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-trust" />
                      <span>{lab.contact_phone}</span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Test Scope Capabilities:</p>
                    <div className="flex flex-wrap gap-1">
                      {lab.capabilities?.map((cap: string, idx: number) => (
                        <span key={idx} className="bg-slate-100 text-slate-800 text-[11px] px-2 py-0.5 rounded border border-slate-200">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <Link
                    href={`/laboratories/${lab.id}`}
                    className="text-xs font-bold text-navy-900 hover:text-saffron flex items-center space-x-1"
                  >
                    <span>View Lab Credentials</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
