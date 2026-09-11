"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Clock, Wifi } from "lucide-react";

interface HealthData {
  status: string;
  version: string;
  database: string;
  uptime_seconds: number;
}

export function SystemStatusBadge() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        let data = null;
        try {
          const res = await fetch("/api/health", { cache: "no-store" });
          if (res.ok) data = await res.json();
        } catch {}
        
        if (!data) {
          try {
            const res = await fetch("http://127.0.0.1:8000/health", { cache: "no-store" });
            if (res.ok) data = await res.json();
          } catch {}
        }

        setHealth(data);
      } catch {
        setHealth(null);
      } finally {
        setLoading(false);
      }
    };
    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-1 text-[10px] text-slate-400">
        <Clock className="w-3 h-3 animate-spin" />
        <span>Checking...</span>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="flex items-center gap-1 text-[10px] text-amber-600">
        <Wifi className="w-3 h-3" />
        <span>API Offline</span>
      </div>
    );
  }

  const isHealthy = health.status === "HEALTHY";

  return (
    <div className={`flex items-center gap-1 text-[10px] font-semibold ${isHealthy ? "text-bisgreen" : "text-amber-600"}`}>
      {isHealthy ? (
        <CheckCircle2 className="w-3 h-3" />
      ) : (
        <AlertCircle className="w-3 h-3" />
      )}
      <span>API {health.status}</span>
      <span className="text-slate-400 font-normal">v{health.version}</span>
    </div>
  );
}
