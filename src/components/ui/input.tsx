import * as React from "react";
import { cn } from "../../lib/utils";
import { Eye, EyeOff } from "lucide-react";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      <input
        type={isPassword && showPassword ? "text" : type}
        className={cn(
          "flex h-10 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--surface-elevated))] px-3 py-2 text-base text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))] focus-visible:border-[hsl(var(--primary))] hover:border-[hsl(var(--border-hover))] disabled:cursor-not-allowed disabled:opacity-50",
          isPassword && "pr-10", // Add padding for the eye icon
          className,
        )}
        ref={ref}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors duration-200 focus:outline-none focus:text-[hsl(var(--primary))]"
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
