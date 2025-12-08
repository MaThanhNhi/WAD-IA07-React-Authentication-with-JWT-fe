import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../hooks/useLogin";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  AlertCircle,
  Mail,
  Lock,
  ArrowLeft,
  LogIn as LogInIcon,
} from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Use custom React Query hook for login
  const { mutate, isPending, isSuccess, isError, error } = useLogin({
    onSuccess: async (data) => {
      console.log("Login successful:", data);
      console.log("Access token set, now refetching user data...");
      reset();
      // Refetch user data to update authentication state
      try {
        await refetchUser();
        console.log("User data refetched successfully, navigating to dashboard...");
        // Redirect to dashboard after successful login
        setTimeout(() => {
          console.log("Executing navigation to /dashboard");
          navigate("/dashboard");
        }, 800);
      } catch (error) {
        console.error("Failed to refetch user data:", error);
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] p-4">
      <div className="w-full max-w-md space-y-4 animate-fade-in">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>

        <Card className="border-[hsl(var(--border))]">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="w-14 h-14 bg-[hsl(var(--primary)/0.2)] border border-[hsl(var(--primary)/0.3)] rounded-full flex items-center justify-center mx-auto mb-2">
              <LogInIcon className="w-7 h-7 text-[hsl(var(--primary))]" />
            </div>
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-base">
              Sign in to your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {isSuccess && (
              <Alert variant="success" className="animate-slide-in">
                <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
                <AlertTitle className="font-semibold">Success!</AlertTitle>
                <AlertDescription>
                  Logged in successfully! Redirecting to dashboard...
                </AlertDescription>
              </Alert>
            )}

            {isError && (
              <Alert variant="destructive" className="animate-slide-in">
                <AlertCircle className="h-5 w-5 text-[hsl(var(--destructive))]" />
                <AlertTitle className="font-semibold">Login Failed</AlertTitle>
                <AlertDescription>
                  {error?.message || "An error occurred. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2 text-[hsl(var(--primary))]" />
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  disabled={isPending}
                  className="h-11 text-base"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="text-xs text-[hsl(var(--destructive))] flex items-center mt-1"
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <Lock className="w-4 h-4 mr-2 text-[hsl(var(--primary))]" />
                    Password
                  </span>
                  <button
                    type="button"
                    className="text-xs text-[hsl(var(--primary))] hover:text-[hsl(var(--primary-hover))] font-medium transition-colors"
                    onClick={() =>
                      alert(
                        "Password reset functionality would be implemented here",
                      )
                    }
                  >
                    Forgot?
                  </button>
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  disabled={isPending}
                  className="h-11 text-base"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                {errors.password && (
                  <p
                    id="password-error"
                    className="text-xs text-[hsl(var(--destructive))] flex items-center mt-1"
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                isLoading={isPending}
                disabled={isPending || isSuccess}
              >
                {isPending ? "Signing In..." : "Sign In"}
                {!isPending && <LogInIcon className="ml-2 w-5 h-5" />}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pb-6">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[hsl(var(--border))]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[hsl(var(--surface-elevated))] px-2 text-[hsl(var(--muted-foreground))]">
                  Don't have an account?
                </span>
              </div>
            </div>
            <Link to="/signup" className="w-full">
              <Button
                variant="outline"
                className="w-full h-11 text-base font-medium"
              >
                Create New Account
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
