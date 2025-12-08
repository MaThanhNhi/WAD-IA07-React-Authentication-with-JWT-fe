import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { UserPlus, LogIn, Shield, Mail, Lock, Sparkles } from "lucide-react";

export function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(var(--background))] p-4">
      <div className="w-full max-w-2xl space-y-6 animate-fade-in">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[hsl(var(--primary)/0.2)] border border-[hsl(var(--primary)/0.3)] rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-[hsl(var(--primary))]" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[hsl(var(--foreground))] tracking-tight">
            Welcome
          </h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-md mx-auto">
            Your secure gateway to seamless user management
          </p>
        </div>{" "}
        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {" "}
          {/* Sign Up Card */}
          <Card className="transition-all duration-300 hover:border-[hsl(var(--primary)/0.5)]">
            <CardContent className="p-8 h-full flex flex-col">
              <div className="space-y-4 grow">
                <div className="w-12 h-12 bg-[hsl(var(--primary)/0.2)] border border-[hsl(var(--primary)/0.3)] rounded-lg flex items-center justify-center mb-3">
                  <UserPlus className="w-6 h-6 text-[hsl(var(--primary))]" />
                </div>
                <h3 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                  New User?
                </h3>
                <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                  Join our platform in seconds. Create your account and unlock
                  all features.
                </p>
              </div>
              <Link to="/signup" className="block mt-4">
                <Button className="w-full h-12 text-base font-semibold">
                  Create Account
                  <UserPlus className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>{" "}
          {/* Sign In Card */}
          <Card className="transition-all duration-300 hover:border-[hsl(var(--primary)/0.5)]">
            <CardContent className="p-8 h-full flex flex-col">
              <div className="space-y-4 grow">
                <div className="w-12 h-12 bg-[hsl(var(--primary)/0.2)] border border-[hsl(var(--primary)/0.3)] rounded-lg flex items-center justify-center mb-3">
                  <LogIn className="w-6 h-6 text-[hsl(var(--primary))]" />
                </div>
                <h3 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                  Existing User?
                </h3>
                <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                  Welcome back! Sign in to continue your journey with us.
                </p>
              </div>
              <Link to="/login" className="block mt-4">
                <Button className="w-full h-12 text-base font-semibold">
                  Sign In
                  <LogIn className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>{" "}
        {/* Features Section */}
        <Card className="border-[hsl(var(--border))]">
          <CardContent className="p-8">
            <h4 className="text-lg font-bold text-[hsl(var(--foreground))] mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-[hsl(var(--primary))]" />
              Why Choose Us?
            </h4>{" "}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[hsl(var(--surface-hover))] transition-colors">
                <div className="shrink-0 w-8 h-8 bg-[hsl(var(--success)/0.2)] border border-[hsl(var(--success)/0.3)] rounded-full flex items-center justify-center mt-0.5">
                  <Shield className="w-4 h-4 text-[hsl(var(--success))]" />
                </div>
                <div>
                  <p className="font-semibold text-[hsl(var(--foreground))]">
                    Secure Registration
                  </p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Enterprise-grade security
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[hsl(var(--surface-hover))] transition-colors">
                <div className="shrink-0 w-8 h-8 bg-[hsl(var(--primary)/0.2)] border border-[hsl(var(--primary)/0.3)] rounded-full flex items-center justify-center mt-0.5">
                  <Mail className="w-4 h-4 text-[hsl(var(--primary))]" />
                </div>
                <div>
                  <p className="font-semibold text-[hsl(var(--foreground))]">
                    Email Validation
                  </p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Verified accounts only
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[hsl(var(--surface-hover))] transition-colors">
                <div className="shrink-0 w-8 h-8 bg-[hsl(var(--warning)/0.2)] border border-[hsl(var(--warning)/0.3)] rounded-full flex items-center justify-center mt-0.5">
                  <Lock className="w-4 h-4 text-[hsl(var(--warning))]" />
                </div>
                <div>
                  <p className="font-semibold text-[hsl(var(--foreground))]">
                    Strong Passwords
                  </p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Advanced protection
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[hsl(var(--surface-hover))] transition-colors">
                <div className="shrink-0 w-8 h-8 bg-[hsl(var(--primary)/0.2)] border border-[hsl(var(--primary)/0.3)] rounded-full flex items-center justify-center mt-0.5">
                  <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
                </div>
                <div>
                  <p className="font-semibold text-[hsl(var(--foreground))]">
                    Modern Interface
                  </p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Beautiful & intuitive
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
