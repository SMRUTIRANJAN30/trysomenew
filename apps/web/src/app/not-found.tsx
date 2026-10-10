import React from "react";
import Link from "next/link";
import { ArrowLeft, Search, Grid, Radio } from "lucide-react";
import { Logo } from "@/components/common/Logo";

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-[8px] bg-[var(--sunken)] border border-[var(--line)] flex items-center justify-center mx-auto text-xl font-mono font-bold text-[var(--pine)]">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--ink)]">
            Page Not Found
          </h1>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            The page or tool URL you requested does not exist or has been moved.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/" className="btn-terracotta text-sm h-10 px-5 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link href="/tools" className="btn-secondary text-sm h-10 px-4 flex items-center gap-2">
            <Grid className="w-4 h-4" />
            <span>All Tools</span>
          </Link>
          <Link href="/beam" className="btn-secondary text-sm h-10 px-4 flex items-center gap-2">
            <Radio className="w-4 h-4" />
            <span>Beam Sync</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
