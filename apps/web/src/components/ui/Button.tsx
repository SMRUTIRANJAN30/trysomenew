import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "terracotta" | "pine" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "pine", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[var(--pine)] focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variantClasses = {
      terracotta: "btn-terracotta",
      pine: "btn-pine",
      secondary: "btn-secondary",
      ghost: "btn-ghost",
    };

    const sizeClasses = {
      sm: "h-8 px-3 text-xs rounded-[6px]",
      md: "h-10 px-4 text-sm rounded-[6px]",
      lg: "h-12 px-6 text-base font-semibold rounded-[6px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(baseClasses, variantClasses[variant], size === "lg" && variant !== "terracotta" ? sizeClasses[size] : "", className)}
        {...props}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
