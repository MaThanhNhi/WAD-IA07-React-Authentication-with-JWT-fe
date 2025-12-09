interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))]">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-[hsl(var(--primary)/0.3)] border-t-[hsl(var(--primary))] rounded-full animate-spin mx-auto"></div>
        <p className="text-[hsl(var(--muted-foreground))] text-sm">{message}</p>
      </div>
    </div>
  );
}
