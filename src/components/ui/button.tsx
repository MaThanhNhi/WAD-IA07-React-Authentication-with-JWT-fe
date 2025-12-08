import * as React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
    size?: "default" | "sm" | "lg";
    isLoading?: boolean;
  }
>(
  (
    {
      className,
      variant = "default",
      size = "default",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))] disabled:pointer-events-none disabled:opacity-50";
    const variants = {
      default:
        "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-hover))] border border-[hsl(var(--primary))]",
      outline:
        "border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--foreground))] hover:bg-[hsl(var(--surface-elevated))] hover:border-[hsl(var(--border-hover))]",
      secondary:
        "bg-[hsl(var(--surface-elevated))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--surface-hover))] border border-[hsl(var(--border))]",
      ghost:
        "hover:bg-[hsl(var(--surface-elevated))] hover:text-[hsl(var(--foreground))] text-[hsl(var(--muted-foreground))]",
      destructive:
        "bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:opacity-90 border border-[hsl(var(--destructive))]",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3 text-xs",
      lg: "h-11 rounded-md px-8",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button };
