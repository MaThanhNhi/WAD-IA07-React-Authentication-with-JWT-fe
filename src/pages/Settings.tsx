import { useAuth } from "../contexts/AuthContext";
import { SessionManager } from "../components/SessionManager";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Shield,
  CheckCircle,
  Cookie,
  RefreshCw,
  Wifi,
  Hash,
  Fingerprint,
  Sparkles,
} from "lucide-react";

export function Settings() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
            Settings
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
        {/* Account Information Card */}
        <Card className="border-[hsl(var(--border))]">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-[hsl(var(--foreground))] mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-[hsl(var(--primary))]" />
              Account Information
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-[hsl(var(--surface))] rounded-lg border border-[hsl(var(--border))]">
                <div className="w-12 h-12 bg-[hsl(var(--primary)/0.2)] border border-[hsl(var(--primary)/0.3)] rounded-full flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-[hsl(var(--primary))]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <span className="text-sm font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                      Email Address
                    </span>
                    <span className="text-base font-medium text-[hsl(var(--foreground))] break-all">
                      {user?.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[hsl(var(--muted-foreground))] block mb-1">
                      Role
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        user?.role === "ADMIN"
                          ? "bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))] border border-[hsl(var(--primary)/0.3)]"
                          : user?.role === "MODERATOR"
                            ? "bg-[hsl(var(--warning)/0.2)] text-[hsl(var(--warning))] border border-[hsl(var(--warning)/0.3)]"
                            : "bg-[hsl(var(--muted)/0.5)] text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))]"
                      }`}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      {user?.role || "USER"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Manager Card */}
        <SessionManager />

        {/* Security Features Card */}
        <Card className="border-[hsl(var(--border))]">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-[hsl(var(--foreground))] mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-[hsl(var(--success))]" />
              Security Features
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[hsl(var(--surface))] transition-colors">
                <div className="w-8 h-8 bg-[hsl(var(--success)/0.2)] border border-[hsl(var(--success)/0.3)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Cookie className="w-4 h-4 text-[hsl(var(--success))]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">
                    HTTP-only Cookies
                  </p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Refresh tokens stored in HTTP-only cookies for XSS
                    protection
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-[hsl(var(--success))] shrink-0" />
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[hsl(var(--surface))] transition-colors">
                <div className="w-8 h-8 bg-[hsl(var(--success)/0.2)] border border-[hsl(var(--success)/0.3)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <RefreshCw className="w-4 h-4 text-[hsl(var(--success))]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">
                    Automatic Token Refresh
                  </p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Seamless token renewal before expiration
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-[hsl(var(--success))] shrink-0" />
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[hsl(var(--surface))] transition-colors">
                <div className="w-8 h-8 bg-[hsl(var(--success)/0.2)] border border-[hsl(var(--success)/0.3)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Wifi className="w-4 h-4 text-[hsl(var(--success))]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">
                    Multi-tab Synchronization
                  </p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Logout events synchronized across all browser tabs
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-[hsl(var(--success))] shrink-0" />
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[hsl(var(--surface))] transition-colors">
                <div className="w-8 h-8 bg-[hsl(var(--success)/0.2)] border border-[hsl(var(--success)/0.3)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Fingerprint className="w-4 h-4 text-[hsl(var(--success))]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">
                    Device Fingerprinting
                  </p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Advanced session tracking with device identification
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-[hsl(var(--success))] shrink-0" />
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[hsl(var(--surface))] transition-colors">
                <div className="w-8 h-8 bg-[hsl(var(--success)/0.2)] border border-[hsl(var(--success)/0.3)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Hash className="w-4 h-4 text-[hsl(var(--success))]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">
                    SHA-256 Hashed Tokens
                  </p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    All tokens securely hashed in database storage
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-[hsl(var(--success))] shrink-0" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Dashboard Button */}
        <div className="flex justify-center pt-4">
          <Link to="/dashboard">
            <Button
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
