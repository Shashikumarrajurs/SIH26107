"use client";

import React from "react";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { User, Building, Mail, Shield, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <StatutoryHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">User Profile & Business Details</h1>
            <p className="text-xs text-slate-500 mt-1">
              Registered MSME enterprise profile and BIS Manakonline integration account.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-sm max-w-2xl">
            <div className="flex items-center space-x-4 border-b border-slate-100 pb-4">
              <div className="w-16 h-16 rounded-full bg-navy-900 text-saffron flex items-center justify-center text-xl font-bold border-2 border-saffron">
                RS
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900">Rajesh Sharma</h2>
                <p className="text-xs text-slate-500">Sharma Metalcrafts Pvt Ltd (MSME Unit)</p>
                <span className="inline-block mt-1 bg-bisgreen-light text-bisgreen-dark border border-bisgreen/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Verified MSME Account
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 font-medium block">Email Address:</span>
                  <span className="font-bold text-navy-900 mt-0.5 block">demo@msme.in</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 font-medium block">User Category:</span>
                  <span className="font-bold text-navy-900 mt-0.5 block">MSME Manufacturer</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 font-medium block">Manufacturing Unit Location:</span>
                <span className="font-bold text-navy-900 mt-0.5 block">Plot 45, Industrial Area Phase 2, Noida, Uttar Pradesh</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
