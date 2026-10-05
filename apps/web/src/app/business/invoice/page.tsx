"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Plus, Trash2, Download, Receipt, FileText, Check } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface InvoiceItem {
  id: string;
  desc: string;
  qty: number;
  price: number;
}

export default function InvoiceGeneratorPage() {
  const [invoiceNum, setInvoiceNum] = useState("INV-2026-001");
  const [senderName, setSenderName] = useState("trysomenew Inc.");
  const [senderEmail, setSenderEmail] = useState("billing@trysomenew.com");
  const [clientName, setClientName] = useState("Acme Corporation");
  const [clientEmail, setClientEmail] = useState("accounts@acme.com");
  const [currency, setCurrency] = useState("$");
  const [taxRate, setTaxRate] = useState(10);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", desc: "Local-First Workspace License (Enterprise)", qty: 5, price: 120 },
    { id: "2", desc: "Cryptographic Integrity Setup & Verification", qty: 1, price: 350 },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const addItem = () => {
    setItems([
      ...items,
      { id: Math.random().toString(36).substring(7), desc: "Service item", qty: 1, price: 50 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, updates: Partial<InvoiceItem>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax;

  const generatePdf = async () => {
    setIsGenerating(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Title & Header
      page.drawText("INVOICE", { x: 50, y: 780, size: 24, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
      page.drawText(`#${invoiceNum}`, { x: 50, y: 755, size: 12, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });

      // Sender Info (Right aligned)
      page.drawText(senderName, { x: 380, y: 780, size: 12, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
      page.drawText(senderEmail, { x: 380, y: 765, size: 10, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
      page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 380, y: 750, size: 10, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });

      // Client Info
      page.drawText("Billed To:", { x: 50, y: 700, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
      page.drawText(clientName, { x: 50, y: 685, size: 11, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });
      page.drawText(clientEmail, { x: 50, y: 670, size: 10, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });

      // Table Header
      let y = 620;
      page.drawRectangle({ x: 50, y: y - 5, width: 495, height: 25, color: rgb(0.95, 0.96, 0.98) });
      page.drawText("Description", { x: 60, y: y + 3, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.3) });
      page.drawText("Qty", { x: 340, y: y + 3, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.3) });
      page.drawText("Unit Price", { x: 400, y: y + 3, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.3) });
      page.drawText("Total", { x: 480, y: y + 3, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.3) });

      // Table Rows
      y -= 25;
      for (const item of items) {
        page.drawText(item.desc.slice(0, 45), { x: 60, y: y, size: 10, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });
        page.drawText(item.qty.toString(), { x: 345, y: y, size: 10, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
        page.drawText(`${currency}${item.price.toFixed(2)}`, { x: 400, y: y, size: 10, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
        page.drawText(`${currency}${(item.qty * item.price).toFixed(2)}`, { x: 480, y: y, size: 10, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });
        y -= 20;
      }

      // Totals
      y -= 20;
      page.drawLine({ start: { x: 340, y: y + 10 }, end: { x: 545, y: y + 10 }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
      page.drawText("Subtotal:", { x: 380, y: y - 5, size: 10, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
      page.drawText(`${currency}${subtotal.toFixed(2)}`, { x: 480, y: y - 5, size: 10, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });

      page.drawText(`Tax (${taxRate}%):`, { x: 380, y: y - 25, size: 10, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
      page.drawText(`${currency}${tax.toFixed(2)}`, { x: 480, y: y - 25, size: 10, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });

      page.drawText("Total Due:", { x: 380, y: y - 50, size: 12, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
      page.drawText(`${currency}${total.toFixed(2)}`, { x: 480, y: y - 50, size: 12, font: fontBold, color: rgb(0.1, 0.2, 0.4) });

      // Footer note
      page.drawText("Generated locally by trysomenew — One Fast Workspace for Documents & Devices", {
        x: 100,
        y: 40,
        size: 8,
        font: fontRegular,
        color: rgb(0.6, 0.6, 0.6),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoiceNum}.pdf`;
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
      title="Professional Invoice Generator (Phase 3)"
      description="Create beautiful, customized client invoices and download high-resolution A4 PDFs instantly in your browser."
      actions={
        <button
          onClick={generatePdf}
          disabled={isGenerating}
          className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4"
        >
          <Download size={14} />
          {isGenerating ? "Rendering PDF..." : "Export A4 Invoice PDF"}
        </button>
      }
    >
      <div className="space-y-6">
        {/* Invoice Info */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Invoice Number</label>
              <input
                value={invoiceNum}
                onChange={(e) => setInvoiceNum(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2 text-xs text-[var(--foreground)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Currency Symbol</label>
              <input
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2 text-xs text-[var(--foreground)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Tax Rate (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2 text-xs text-[var(--foreground)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[var(--border-subtle)]">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[var(--foreground)] block">Your Details</span>
              <input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Company / Sender name"
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2 text-xs text-[var(--foreground)]"
              />
              <input
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="Sender email"
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2 text-xs text-[var(--foreground)]"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-[var(--foreground)] block">Billed To (Client)</span>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client Name"
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2 text-xs text-[var(--foreground)]"
              />
              <input
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="Client Email"
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2 text-xs text-[var(--foreground)]"
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">Line Items</h3>
            <button onClick={addItem} className="btn-secondary py-1 px-3 text-xs flex items-center gap-1">
              <Plus size={13} /> Add Item
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-2 items-center bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-[var(--border-subtle)] text-xs"
              >
                <input
                  value={item.desc}
                  onChange={(e) => updateItem(item.id, { desc: e.target.value })}
                  placeholder="Item description"
                  className="col-span-6 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-2.5 py-1.5"
                />
                <input
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) })}
                  className="col-span-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-2.5 py-1.5"
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, { price: Number(e.target.value) })}
                  className="col-span-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-2.5 py-1.5"
                />
                <button onClick={() => removeItem(item.id)} className="col-span-1 text-red-400 hover:text-red-300 flex justify-end">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end">
            <div className="w-56 space-y-1.5 text-xs text-[var(--foreground)]">
              <div className="flex justify-between text-[var(--muted)]">
                <span>Subtotal:</span>
                <span>{currency}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[var(--muted)]">
                <span>Tax ({taxRate}%):</span>
                <span>{currency}{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-2 border-t border-[var(--border-subtle)] text-cyan-400">
                <span>Total:</span>
                <span>{currency}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
