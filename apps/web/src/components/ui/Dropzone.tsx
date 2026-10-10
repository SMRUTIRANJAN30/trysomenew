"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, File, AlertCircle, Camera } from "lucide-react";
import { clsx } from "clsx";

export interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  className?: string;
}

export function Dropzone({
  onFilesSelected,
  accept,
  multiple = true,
  maxSizeMB = 100,
  label = "Choose files or drag and drop here",
  description,
  className,
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const validateAndForward = (fileList: FileList | File[]) => {
    setErrorMessage(null);
    const valid: File[] = [];
    const files = Array.from(fileList);

    for (const f of files) {
      if (f.size > maxSizeMB * 1024 * 1024) {
        setErrorMessage(`"${f.name}" exceeds the maximum limit of ${maxSizeMB} MB.`);
        return;
      }
      valid.push(f);
    }

    if (valid.length > 0) {
      onFilesSelected(valid);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndForward(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // Support clipboard paste (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        validateAndForward(e.clipboardData.files);
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [maxSizeMB]);

  return (
    <div className={clsx("w-full space-y-2", className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={clsx(
          "w-full min-h-[240px] p-8 bg-[var(--surface)] border-[1.5px] border-dashed rounded-[8px] flex flex-col items-center justify-center text-center cursor-pointer transition-colors select-none",
          isDragOver
            ? "border-[var(--pine)] bg-[var(--pine-tint)]/20"
            : "border-[var(--line)] hover:border-[var(--pine)]"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && validateAndForward(e.target.files)}
          className="hidden"
        />

        {/* Hidden Camera Input for Mobile */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => e.target.files && validateAndForward(e.target.files)}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-[6px] bg-[var(--sunken)] flex items-center justify-center text-[var(--pine)] mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-base font-semibold text-[var(--ink)] mb-1">{label}</p>

        <p className="text-sm text-[var(--muted)] max-w-sm mb-4">
          {description || `Support for drag & drop, paste from clipboard, or files up to ${maxSizeMB} MB.`}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            className="btn-pine text-sm h-9 px-4"
          >
            Select Files
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              cameraInputRef.current?.click();
            }}
            className="sm:hidden btn-secondary text-sm h-9 px-3 flex items-center gap-1.5"
          >
            <Camera className="w-4 h-4" />
            <span>Camera</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--error)] p-2.5 bg-[var(--error-tint)] rounded-[6px]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
