"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  UploadCloud,
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  calculateSHA256,
  createDocumentId,
  saveVerificationRecord,
  findVerificationRecordById,
  VerificationRecord,
} from "@/lib/crypto";
import { formatBytes } from "@/lib/utils";
import { ProcessingBadge } from "@/components/common/ProcessingBadge";

export default function VerifyHubPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"register" | "lookup">("register");

  // Registration state
  const [regFile, setRegFile] = useState<File | null>(null);
  const [regHash, setRegHash] = useState<string | null>(null);
  const [regDocId, setRegDocId] = useState<string | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Lookup state
  const [lookupId, setLookupId] = useState("");
  const [foundRecord, setFoundRecord] = useState<VerificationRecord | null>(null);
  const [lookupFile, setLookupFile] = useState<File | null>(null);
  const [lookupFileHash, setLookupFileHash] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<"match" | "mismatch" | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const handleRegisterFile = async (file: File | null) => {
    if (!file) return;
    setRegFile(file);
    setIsHashing(true);
    setRegHash(null);
    setRegDocId(null);

    try {
      const buffer = await file.arrayBuffer();
      const hash = await calculateSHA256(buffer);
      const docId = createDocumentId();

      const record: VerificationRecord = {
        id: docId,
        name: file.name,
        hash,
        fileSizeBytes: file.size,
        mimeType: file.type || "application/octet-stream",
        version: 1,
        issuedAt: new Date().toISOString(),
        issuer: "TrySomeNew Cryptographic Engine",
        verified: true,
      };

      saveVerificationRecord(record);
      setRegHash(hash);
      setRegDocId(docId);
      setIsHashing(false);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      console.error(err);
      setIsHashing(false);
    }
  };

  const handleLookup = () => {
    setLookupError(null);
    setMatchResult(null);
    setLookupFile(null);
    setLookupFileHash(null);

    if (!lookupId.trim()) {
      setLookupError("Please enter a valid Document ID (e.g. DOC-2026-XXXXXX).");
      return;
    }

    const rec = findVerificationRecordById(lookupId.trim());
    if (rec) {
      setFoundRecord(rec);
    } else {
      setFoundRecord(null);
      setLookupError(`Document ID "${lookupId}" not found in current cryptographic ledger.`);
    }
  };

  const handleVerifyAgainstFoundRecord = async (file: File | null) => {
    if (!file || !foundRecord) return;
    setLookupFile(file);

    try {
      const buffer = await file.arrayBuffer();
      const computed = await calculateSHA256(buffer);
      setLookupFileHash(computed);

      if (computed.toLowerCase() === foundRecord.hash.toLowerCase()) {
        setMatchResult("match");
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } else {
        setMatchResult("mismatch");
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Real NIST SHA-256 Cryptographic Verification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Document Integrity Platform
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Never rely on arbitrary checkmarks. Compute verifiable SHA-256 binary digests and validate document purity.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex justify-center">
        <div className="bg-[#0e1626] p-1.5 rounded-2xl border border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setActiveTab("register")}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "register"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Issue & Register Document Hash
          </button>
          <button
            onClick={() => setActiveTab("lookup")}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "lookup"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Verify Existing Document
          </button>
        </div>
      </div>

      {/* TAB 1: ISSUE & REGISTER HASH */}
      {activeTab === "register" && (
        <div className="space-y-6">
          <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-3xl p-10 text-center flex flex-col items-center justify-center cursor-pointer bg-[#0e1626]/60 hover:bg-slate-900/60 transition-all group">
            <input
              type="file"
              onChange={(e) => handleRegisterFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Select any file to generate verifiable cryptographic record
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Supports PDF, DOCX, Images, and all standard formats. Computed 100% locally.
            </p>
            <span className="mt-5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-500/20 transition-colors">
              Browse File for Verification
            </span>
          </label>

          {isHashing && (
            <div className="bg-[#0e1626] border border-emerald-500/30 rounded-2xl p-6 text-center text-xs text-emerald-400 animate-pulse">
              Computing WebCrypto SHA-256 byte digest...
            </div>
          )}

          {regDocId && regHash && regFile && (
            <div className="bg-[#0e1626] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Verifiable Record Created</h3>
                    <p className="text-xs text-slate-400">{regFile.name} ({formatBytes(regFile.size)})</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/verify/${regDocId}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                  >
                    <span>Public Verification Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Record Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[11px] mb-1 font-sans">Document ID</div>
                  <div className="text-cyan-400 font-bold text-sm flex items-center justify-between">
                    <span>{regDocId}</span>
                    <button
                      onClick={() => copyToClipboard(regDocId)}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Copy Document ID"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[11px] mb-1 font-sans">Integrity Status</div>
                  <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>UNCHANGED (Verified)</span>
                  </div>
                </div>
              </div>

              {/* True SHA-256 Hash */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[11px] flex items-center justify-between">
                  <span>SHA-256 Cryptographic Hash (256 bits):</span>
                  <button
                    onClick={() => copyToClipboard(regHash)}
                    className="text-blue-400 hover:text-blue-300 text-[10px] flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Hash</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-slate-200 break-all bg-slate-950 p-2.5 rounded border border-slate-800/80">
                  {regHash}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  Any modification to a single character or byte in this file will produce a completely different SHA-256 digest.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LOOKUP & VALIDATE INTEGRITY */}
      {activeTab === "lookup" && (
        <div className="space-y-6">
          <div className="bg-[#0e1626] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-white">Check Document by ID</h3>
            <p className="text-xs text-slate-400">
              Enter the unique Document ID issued by TrySomeNew (e.g. <code>DOC-2026-XXXXXX</code>) to view the cryptographic record.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="Enter Document ID (e.g. DOC-2026-F41A9B)"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
              <button
                onClick={handleLookup}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Lookup</span>
              </button>
            </div>

            {lookupError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{lookupError}</span>
              </div>
            )}
          </div>

          {/* Record Display & File Validation Upload */}
          {foundRecord && (
            <div className="bg-[#0e1626] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 font-bold">
                    {foundRecord.id}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{foundRecord.name}</h3>
                  <p className="text-xs text-slate-400">
                    Registered: {new Date(foundRecord.issuedAt).toLocaleString()} • {formatBytes(foundRecord.fileSizeBytes)}
                  </p>
                </div>

                <Link
                  href={`/verify/${foundRecord.id}`}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>Permalink</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Stored Hash */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[11px]">Registered Cryptographic Hash (SHA-256):</div>
                <div className="font-mono text-xs text-slate-200 break-all bg-slate-950 p-2.5 rounded border border-slate-800/80">
                  {foundRecord.hash}
                </div>
              </div>

              {/* Upload to verify against record */}
              <div className="border-t border-slate-800 pt-6 space-y-3">
                <h4 className="text-sm font-bold text-white">
                  Audit File Integrity Against This Record
                </h4>
                <p className="text-xs text-slate-400">
                  Upload the file you received. We will compute its hash in real-time and verify if it matches byte-for-byte.
                </p>

                <label className="border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all">
                  <input
                    type="file"
                    onChange={(e) => handleVerifyAgainstFoundRecord(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <UploadCloud className="w-6 h-6 text-blue-400 mb-2" />
                  <span className="text-xs font-semibold text-white">
                    {lookupFile ? lookupFile.name : "Select file to audit integrity"}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    Click to browse file
                  </span>
                </label>

                {/* Audit Result Banner */}
                {matchResult === "match" && (
                  <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-2xl p-5 text-emerald-300 text-xs space-y-1 animate-in zoom-in-95">
                    <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>CRYPTOGRAPHIC MATCH: UNCHANGED</span>
                    </div>
                    <p className="text-slate-300">
                      The file uploaded is 100% identical to the registered record. Not a single byte has been modified or corrupted.
                    </p>
                  </div>
                )}

                {matchResult === "mismatch" && (
                  <div className="bg-red-500/15 border border-red-500/40 rounded-2xl p-5 text-red-300 text-xs space-y-1 animate-in zoom-in-95">
                    <div className="flex items-center gap-2 font-bold text-sm text-red-400">
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span>INTEGRITY FAILURE: HASH MISMATCH</span>
                    </div>
                    <p className="text-slate-300">
                      The file uploaded does not match the registered cryptographic signature. The document has been modified, tampered with, or corrupted.
                    </p>
                    <div className="text-[11px] font-mono text-slate-400 pt-1">
                      Computed: {lookupFileHash}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
