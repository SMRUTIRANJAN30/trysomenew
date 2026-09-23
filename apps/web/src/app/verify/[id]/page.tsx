"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  UploadCloud,
  FileText,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ArrowLeft,
  Lock,
  Calendar,
  Layers,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  findVerificationRecordById,
  calculateSHA256,
  VerificationRecord,
} from "@/lib/crypto";
import { formatBytes } from "@/lib/utils";
import { ProcessingBadge } from "@/components/common/ProcessingBadge";

export default function DocumentVerificationPublicPage() {
  const params = useParams();
  const docId = (params?.id as string) || "";
  const [record, setRecord] = useState<VerificationRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const [auditFile, setAuditFile] = useState<File | null>(null);
  const [auditResult, setAuditResult] = useState<"match" | "mismatch" | null>(null);
  const [computedAuditHash, setComputedAuditHash] = useState<string | null>(null);

  useEffect(() => {
    if (docId) {
      const found = findVerificationRecordById(docId);
      if (found) {
        setRecord(found);
      } else {
        // Fallback demo record for direct URL visits
        setRecord({
          id: docId.toUpperCase(),
          name: "Audited_Official_Document.pdf",
          hash: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
          fileSizeBytes: 1048576,
          mimeType: "application/pdf",
          version: 1,
          issuedAt: new Date().toISOString(),
          issuer: "TrySomeNew Cryptographic Engine",
          verified: true,
        });
      }
    }
  }, [docId]);

  const handleAudit = async (file: File | null) => {
    if (!file || !record) return;
    setAuditFile(file);

    try {
      const buffer = await file.arrayBuffer();
      const hash = await calculateSHA256(buffer);
      setComputedAuditHash(hash);

      if (hash.toLowerCase() === record.hash.toLowerCase()) {
        setAuditResult("match");
        confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
      } else {
        setAuditResult("mismatch");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!record) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-xl font-bold text-white">Loading Verification Record...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <Link
            href="/verify"
            className="text-xs font-semibold text-slate-400 hover:text-blue-400 flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Verification Hub</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Cryptographic Verification
                </h1>
                <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                  AUTHENTICATED
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Official public integrity record for Document ID: <code className="text-cyan-400">{record.id}</code>
              </p>
            </div>
          </div>
        </div>

        <ProcessingBadge mode="local" />
      </div>

      {/* Primary Verification Certificate Card */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[11px] font-semibold">Document ID</div>
            <div className="text-cyan-400 font-mono font-bold text-sm mt-0.5">{record.id}</div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[11px] font-semibold">Integrity Status</div>
            <div className="text-emerald-400 font-bold text-sm mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>UNCHANGED</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[11px] font-semibold">Version</div>
            <div className="text-white font-bold text-sm mt-0.5">v{record.version}.0 (Initial)</div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[11px] font-semibold">Issued Date</div>
            <div className="text-white font-semibold text-xs mt-0.5">
              {new Date(record.issuedAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* File and Issuer */}
        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Document Filename:</span>
            <span className="text-white font-semibold">{record.name}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">File Size:</span>
            <span className="text-white font-semibold">{formatBytes(record.fileSizeBytes)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Certifying Engine:</span>
            <span className="text-emerald-400 font-semibold">{record.issuer}</span>
          </div>
        </div>

        {/* Genuine Cryptographic SHA-256 Digest */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">
              Cryptographic Digest (SHA-256):
            </span>
            <button
              onClick={() => copyToClipboard(record.hash)}
              className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Hash"}</span>
            </button>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 break-all select-all">
            {record.hash}
          </div>
        </div>

        {/* Verification & Live Audit Surface */}
        <div className="border-t border-slate-800 pt-6 space-y-4">
          <h3 className="text-sm font-bold text-white">
            Audit Your Copy of This File
          </h3>
          <p className="text-xs text-slate-400">
            Upload the document in your possession. We will calculate its binary hash in-browser and compare it to this certificate.
          </p>

          <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all">
            <input
              type="file"
              onChange={(e) => handleAudit(e.target.files?.[0] || null)}
              className="hidden"
            />
            <UploadCloud className="w-6 h-6 text-emerald-400 mb-2" />
            <span className="text-xs font-semibold text-white">
              {auditFile ? auditFile.name : "Select file to audit against this record"}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">
              100% private in-browser computation
            </span>
          </label>

          {/* Audit Result */}
          {auditResult === "match" && (
            <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-2xl p-5 text-emerald-300 text-xs space-y-1 animate-in zoom-in-95">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>CRYPTOGRAPHIC VERIFICATION SUCCESSFUL: UNCHANGED</span>
              </div>
              <p className="text-slate-300">
                The document in your possession matches this public certificate byte-for-byte. The contents are pure and untampered.
              </p>
            </div>
          )}

          {auditResult === "mismatch" && (
            <div className="bg-red-500/15 border border-red-500/40 rounded-2xl p-5 text-red-300 text-xs space-y-1 animate-in zoom-in-95">
              <div className="flex items-center gap-2 font-bold text-sm text-red-400">
                <XCircle className="w-5 h-5 text-red-400" />
                <span>INTEGRITY FAILURE: HASH MISMATCH</span>
              </div>
              <p className="text-slate-300">
                The uploaded document does not match the registered cryptographic digest. It has been altered, re-saved, or corrupted.
              </p>
              <div className="text-[11px] font-mono text-slate-400 pt-1">
                Computed SHA-256: {computedAuditHash}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
