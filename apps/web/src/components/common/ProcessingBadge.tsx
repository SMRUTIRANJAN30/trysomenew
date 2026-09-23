import React from "react";
import { ShieldCheck, Lock } from "lucide-react";

interface ProcessingBadgeProps {
  mode?: "local" | "secure";
  className?: string;
}

export function ProcessingBadge({ mode = "local", className = "" }: ProcessingBadgeProps) {
  if (mode === "local") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-sm shadow-sm ${className}`}
        title="Your file is processed 100% locally in your browser. No document data is sent across the network."
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Processing locally</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 backdrop-blur-sm shadow-sm ${className}`}
      title="Encrypted in-transit and in-memory. Zero document retention."
    >
      <Lock className="w-3.5 h-3.5 text-blue-400" />
      <span>Processing securely</span>
    </div>
  );
}
