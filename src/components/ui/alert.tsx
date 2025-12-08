import * as React from "react";
import { cn } from "../../lib/utils";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "warning";
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default:
        "bg-[hsl(var(--primary)/0.15)] border-[hsl(var(--primary)/0.5)] text-[hsl(var(--foreground))]",
      destructive:
        "bg-[hsl(var(--destructive)/0.15)] border-[hsl(var(--destructive)/0.5)] text-[hsl(var(--foreground))]",
      success:
        "bg-[hsl(var(--success)/0.15)] border-[hsl(var(--success)/0.5)] text-[hsl(var(--foreground))]",
      warning:
        "bg-[hsl(var(--warning)/0.15)] border-[hsl(var(--warning)/0.5)] text-[hsl(var(--foreground))]",
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-lg border p-4 transition-colors duration-200",
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-1 font-medium leading-tight text-[hsl(var(--foreground))]",
      className,
    )}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm text-[hsl(var(--muted-foreground))] [&_p]:leading-relaxed",
      className,
    )}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
