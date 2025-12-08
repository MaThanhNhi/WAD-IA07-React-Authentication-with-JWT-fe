import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "../hooks/useRegister";
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
  UserPlus,
} from "lucide-react";
import { z } from "zod";

const registerSchema = z
  .object({
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain a special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Use custom React Query hook for registration
  const { mutate, isPending, isSuccess, isError, error } = useRegister({
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      reset();
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    // Only send email and password to API (not confirmPassword)
    mutate({
      email: data.email,
      password: data.password,
    });
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
              <UserPlus className="w-7 h-7 text-[hsl(var(--primary))]" />
            </div>
            <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-base">
              Join us today and get started
            </CardDescription>
          </CardHeader>{" "}
          <CardContent className="space-y-6">
            {" "}
            {isSuccess && (
              <Alert variant="success" className="animate-slide-in">
                <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
                <AlertTitle className="font-semibold">Success!</AlertTitle>
                <AlertDescription>
                  Your account has been created successfully! Redirecting...
                </AlertDescription>
              </Alert>
            )}
            {isError && (
              <Alert variant="destructive" className="animate-slide-in">
                <AlertCircle className="h-5 w-5 text-[hsl(var(--destructive))]" />
                <AlertTitle className="font-semibold">
                  Registration Failed
                </AlertTitle>
                <AlertDescription>
                  {error?.message || "An error occurred. Please try again."}
                </AlertDescription>
              </Alert>
            )}{" "}
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
                  className="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center"
                >
                  <Lock className="w-4 h-4 mr-2 text-[hsl(var(--primary))]" />
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 8 characters"
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
                    className="text-xs text-[hsl(var(--destructive))] flex items-start mt-1"
                  >
                    <AlertCircle className="w-3 h-3 mr-1 mt-0.5" />
                    <span>{errors.password.message}</span>
                  </p>
                )}
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  Must include uppercase, lowercase, number and special
                  character.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center"
                >
                  <Lock className="w-4 h-4 mr-2 text-[hsl(var(--primary))]" />
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  {...register("confirmPassword")}
                  disabled={isPending}
                  className="h-11 text-base"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby={
                    errors.confirmPassword ? "confirmPassword-error" : undefined
                  }
                />
                {errors.confirmPassword && (
                  <p
                    id="confirmPassword-error"
                    className="text-xs text-[hsl(var(--destructive))] flex items-center mt-1"
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                isLoading={isPending}
                disabled={isPending || isSuccess}
              >
                {isPending ? "Creating Account..." : "Sign Up"}
                {!isPending && <UserPlus className="ml-2 w-5 h-5" />}
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
                  Already have an account?
                </span>
              </div>
            </div>
            <Link to="/login" className="w-full">
              <Button
                variant="outline"
                className="w-full h-11 text-base font-medium"
              >
                Sign In Instead
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
