"use client";

import React from "react";
import Link from "next/link";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { History, MessageSquare, ArrowRight } from "lucide-react";

export default function ConversationsPage() {
  const conversations = [
    {
      id: "conv_001",
      title: "I manufacture stainless steel water bottles...",
      product: "Stainless Steel Water Bottle",
      standard: "IS 17803:2022",
      date: "2026-09-10",
      messages_count: 4
    },
    {
      id: "conv_002",
      title: "Safety tests required for electric kettles",
      product: "Electric Kettle",
      standard: "IS 302-2-15:2009",
      date: "2026-09-09",
      messages_count: 2
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <StatutoryHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Saved Conversations & History</h1>
            <p className="text-xs text-slate-500 mt-1">
              Resume past product inquiry sessions and review retrieved evidence citations.
            </p>
          </div>

          <div className="space-y-3">
            {conversations.map((c) => (
              <div key={c.id} className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-trust" />
                    <h3 className="text-sm font-bold text-navy-900">{c.title}</h3>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                    <span>Product: <strong className="text-navy-900">{c.product}</strong></span>
                    <span>•</span>
                    <span className="font-mono">{c.standard}</span>
                    <span>•</span>
                    <span>{c.date}</span>
                  </div>
                </div>

                <Link
                  href="/assistant"
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center space-x-1"
                >
                  <span>Open Session</span>
                  <ArrowRight className="w-3.5 h-3.5 text-saffron" />
                </Link>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
