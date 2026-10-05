"use client";

import { useState, useRef, useEffect } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Download, RefreshCw, PenTool, Check } from "lucide-react";

export default function DrawSignaturePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#0f172a");
  const [lineWidth, setLineWidth] = useState(3);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-signature.png";
    a.click();
  };

  return (
    <ToolShell
      title="Draw Digital Signature (Phase 3)"
      description="Create authentic hand-drawn signatures with mouse, pen, or touch and export with transparent background."
      actions={
        <div className="flex gap-2">
          <button onClick={clearCanvas} className="btn-secondary flex items-center gap-1.5 text-xs py-2">
            <RefreshCw size={13} /> Clear Pad
          </button>
          <button
            onClick={downloadPng}
            disabled={!hasDrawn}
            className="btn-primary flex items-center gap-1.5 text-xs py-2 disabled:opacity-50"
          >
            <Download size={13} /> Download Signature PNG
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Drawing Canvas */}
        <div className="glass rounded-3xl p-6 flex flex-col items-center">
          <div className="w-full max-w-2xl h-64 sm:h-72 bg-white rounded-2xl border-2 border-dashed border-slate-300 relative shadow-inner overflow-hidden cursor-crosshair touch-none">
            <canvas
              ref={canvasRef}
              width={700}
              height={300}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full"
            />
            {!hasDrawn && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400">
                <PenTool size={28} className="mb-2 opacity-50" />
                <span className="text-sm font-medium">Draw your signature here</span>
                <span className="text-xs opacity-75">Touch, stylus, or mouse supported</span>
              </div>
            )}
            <div className="absolute bottom-6 left-10 right-10 border-b border-slate-200 pointer-events-none" />
          </div>

          {/* Controls Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 w-full max-w-2xl text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[var(--muted)]">Ink Color:</span>
              {[
                { name: "Black", hex: "#0f172a" },
                { name: "Blue", hex: "#1d4ed8" },
                { name: "Red", hex: "#b91c1c" },
              ].map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    color === c.hex ? "scale-110 border-blue-500 shadow" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[var(--muted)]">Stroke Width:</span>
              {[2, 3, 5].map((w) => (
                <button
                  key={w}
                  onClick={() => setLineWidth(w)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                    lineWidth === w
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "border-[var(--border-subtle)] text-[var(--muted)]"
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
