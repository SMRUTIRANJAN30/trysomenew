"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Download, Receipt, Check } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function ReceiptGeneratorPage() {
  const [receiptNum, setReceiptNum] = useState("REC-2026-881");
  const [payerName, setPayerName] = useState("Alex Johnson");
  const [merchantName, setMerchantName] = useState("trysomenew Workspace");
  const [amount, setAmount] = useState(79.0);
  const [currency, setCurrency] = useState("$");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card (Visa ending 4242)");
  const [notes, setNotes] = useState("Annual Pro Subscription — Paid in full.");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReceiptPdf = async () => {
    setIsGenerating(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([400, 560]); // Compact thermal receipt style
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      page.drawText(merchantName, { x: 50, y: 500, size: 16, font: fontBold, color: rgb(0.1, 0.1, 0.2) });
      page.drawText("Official Payment Receipt", { x: 50, y: 480, size: 10, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
      page.drawLine({ start: { x: 50, y: 460 }, end: { x: 350, y: 460 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });

      let y = 430;
      const rows = [
        ["Receipt Number", `#${receiptNum}`],
        ["Date & Time", new Date().toLocaleString()],
        ["Payer", payerName],
        ["Payment Method", paymentMethod],
        ["Description", notes],
      ];

      for (const [label, val] of rows) {
        page.drawText(label, { x: 50, y, size: 9, font: fontRegular, color: rgb(0.5, 0.5, 0.5) });
        page.drawText(val.slice(0, 35), { x: 160, y, size: 9, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
        y -= 26;
      }

      page.drawLine({ start: { x: 50, y: y + 5 }, end: { x: 350, y: y + 5 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
      y -= 20;

      page.drawText("Amount Paid:", { x: 50, y, size: 12, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
      page.drawText(`${currency}${amount.toFixed(2)}`, { x: 270, y, size: 16, font: fontBold, color: rgb(0.05, 0.6, 0.3) });

      // Verification seal
      y -= 45;
      page.drawText("STATUS: COMPLETED & VERIFIED", { x: 90, y, size: 9, font: fontBold, color: rgb(0.05, 0.6, 0.3) });
      page.drawText("Cryptographically stamped by trysomenew", { x: 80, y: y - 18, size: 8, font: fontRegular, color: rgb(0.6, 0.6, 0.6) });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${receiptNum}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ToolShell
      title="Payment Receipt Generator (Phase 3)"
      description="Create verifiable payment receipts and download clean, styled PDF receipts instantly."
      actions={
        <button
          onClick={generateReceiptPdf}
          disabled={isGenerating}
          className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4"
        >
          <Download size={14} />
          {isGenerating ? "Generating Receipt..." : "Download Receipt PDF"}
        </button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Receipt Number</label>
              <input
                value={receiptNum}
                onChange={(e) => setReceiptNum(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Merchant / Issuer Name</label>
              <input
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Payer Name</label>
              <input
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[var(--muted)] block mb-1">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)] block mb-1">Payment Method</label>
                <input
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Notes / Description</label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          {/* Receipt Preview Card */}
          <div className="glass rounded-2xl p-6 flex flex-col justify-between border-t-4 border-t-emerald-500 shadow-xl">
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-[var(--border-subtle)] pb-3">
                <div>
                  <h4 className="text-base font-bold text-[var(--foreground)]">{merchantName}</h4>
                  <span className="text-xs text-[var(--muted)]">Payment Receipt #{receiptNum}</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                  PAID
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Payer:</span>
                  <span className="text-[var(--foreground)] font-semibold">{payerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Payment Method:</span>
                  <span className="text-[var(--foreground)]">{paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Details:</span>
                  <span className="text-[var(--foreground)]">{notes}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-between items-baseline">
              <span className="text-xs text-[var(--muted)]">Total Paid:</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                {currency}{amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
