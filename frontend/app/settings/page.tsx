"use client";

import React, { useState } from "react";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { Settings, Cpu, Database, Save, Check } from "lucide-react";

export default function SettingsPage() {
  const [llmProvider, setLlmProvider] = useState("Ollama / Qwen (Local)");
  const [modelName, setModelName] = useState("qwen2.5:7b");
  const [embeddingModel, setEmbeddingModel] = useState("bge-m3 (Multilingual 384d)");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <StatutoryHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">System Preferences & LLM Configuration</h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure local LLM inference parameters, Qdrant vector database connection, and language defaults.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-sm max-w-2xl">
            <div className="space-y-4 text-xs">
              <h2 className="text-sm font-bold text-navy-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Cpu className="w-4 h-4 text-trust" />
                <span>LLM Engine Abstraction Layer</span>
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Local LLM Option</label>
                <select
                  value={llmProvider}
                  onChange={(e) => setLlmProvider(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-trust"
                >
                  <option value="Ollama / Qwen (Local)">Ollama / Qwen2.5 (Primary Local Option)</option>
                  <option value="Local Grounded Synthesizer">Local Grounded Synthesizer (Fallback Mode)</option>
                  <option value="Custom Model Provider API">Custom Model Provider API</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Model Name</label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs font-mono font-medium focus:outline-none focus:border-trust"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Multilingual Embedding Model</label>
                <input
                  type="text"
                  value={embeddingModel}
                  onChange={(e) => setEmbeddingModel(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs font-mono font-medium focus:outline-none focus:border-trust"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs px-5 py-2.5 rounded flex items-center space-x-2 transition-colors"
            >
              {saved ? <Check className="w-4 h-4 text-bisgreen" /> : <Save className="w-4 h-4 text-saffron" />}
              <span>{saved ? "Preferences Saved!" : "Save Configuration"}</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
