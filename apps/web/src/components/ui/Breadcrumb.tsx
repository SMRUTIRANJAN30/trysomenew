import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--muted)] mb-4">
      <Link href="/" className="hover:text-[var(--pine)] flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={item.label + index}>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--line)]" />
            {isLast || !item.href ? (
              <span className="font-semibold text-[var(--ink)]" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-[var(--pine)] transition-colors">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
