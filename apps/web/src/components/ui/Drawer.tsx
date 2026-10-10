import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: "left" | "right";
}

export function Drawer({ isOpen, onClose, title, children, position = "left" }: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-none animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className={`fixed inset-y-0 ${
          position === "left" ? "left-0" : "right-0"
        } max-w-full flex pl-10`}
      >
        <div className="w-screen max-w-xs sm:max-w-sm bg-[var(--surface)] border-r border-[var(--line)] p-6 shadow-[var(--shadow-modal)] flex flex-col justify-between animate-in slide-in-from-left duration-200">
          <div>
            {title && (
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--line)]">
                <h3 className="text-base font-semibold text-[var(--ink)]">{title}</h3>
                <button
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="p-1 rounded-[6px] hover:bg-[var(--sunken)] text-[var(--muted)] hover:text-[var(--ink)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
