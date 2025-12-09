import { useAuth } from "../contexts/AuthContext";
import { useLogout } from "../hooks";
import { Loading } from "../components";
import {
  LogOut,
  User,
  Settings,
  Shield,
  CheckCircle,
  Lock,
  Mail,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export function Dashboard() {
  const { user, isLoading } = useAuth();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
            Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <Link to="/settings">
              <Button
                variant="outline"
                size="sm"
                className="inline-flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="inline-flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
        {/* Welcome Card */}
        <Card className="border-[hsl(var(--border))]">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-[hsl(var(--primary)/0.2)] border-2 border-[hsl(var(--primary)/0.3)] rounded-full flex items-center justify-center shrink-0">
                <User className="w-10 h-10 text-[hsl(var(--primary))]" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-2">
                  Welcome back!
                </h2>
                <p className="text-[hsl(var(--muted-foreground))] text-lg mb-3">
                  {user?.email}
                </p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    user?.role === "ADMIN"
                      ? "bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))] border border-[hsl(var(--primary)/0.3)]"
                      : user?.role === "MODERATOR"
                        ? "bg-[hsl(var(--warning)/0.2)] text-[hsl(var(--warning))] border border-[hsl(var(--warning)/0.3)]"
                        : "bg-[hsl(var(--muted)/0.5)] text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))]"
                  }`}
                >
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  {user?.role || "USER"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Profile Card */}
        <Card className="border-[hsl(var(--border))]">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-[hsl(var(--foreground))] mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-[hsl(var(--primary))]" />
              Profile Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-[hsl(var(--muted-foreground))]">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <div className="px-4 py-3 bg-[hsl(var(--surface))] rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
                  {user?.email || "N/A"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-[hsl(var(--muted-foreground))]">
                  <Shield className="w-4 h-4 mr-2" />
                  Role
                </label>
                <div className="px-4 py-3 bg-[hsl(var(--surface))] rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
                  {user?.role || "USER"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-[hsl(var(--muted-foreground))]">
                  <Lock className="w-4 h-4 mr-2" />
                  User ID
                </label>
                <div className="px-4 py-3 bg-[hsl(var(--surface))] rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--foreground))] font-mono text-sm">
                  {user?.id || "N/A"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-[hsl(var(--muted-foreground))]">
                  <Calendar className="w-4 h-4 mr-2" />
                  Account Created
                </label>
                <div className="px-4 py-3 bg-[hsl(var(--surface))] rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-[hsl(var(--border))] transition-all duration-300 hover:border-[hsl(var(--success)/0.5)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                    Account Status
                  </p>
                  <p className="text-3xl font-bold text-[hsl(var(--success))] mt-2">
                    Active
                  </p>
                </div>
                <div className="w-14 h-14 bg-[hsl(var(--success)/0.2)] border border-[hsl(var(--success)/0.3)] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-[hsl(var(--success))]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--border))] transition-all duration-300 hover:border-[hsl(var(--primary)/0.5)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                    Authentication
                  </p>
                  <p className="text-3xl font-bold text-[hsl(var(--primary))] mt-2">
                    JWT
                  </p>
                </div>
                <div className="w-14 h-14 bg-[hsl(var(--primary)/0.2)] border border-[hsl(var(--primary)/0.3)] rounded-full flex items-center justify-center">
                  <Lock className="w-7 h-7 text-[hsl(var(--primary))]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[hsl(var(--border))] transition-all duration-300 hover:border-[hsl(var(--warning)/0.5)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                    Session
                  </p>
                  <p className="text-3xl font-bold text-[hsl(var(--warning))] mt-2">
                    Secure
                  </p>
                </div>
                <div className="w-14 h-14 bg-[hsl(var(--warning)/0.2)] border border-[hsl(var(--warning)/0.3)] rounded-full flex items-center justify-center">
                  <Shield className="w-7 h-7 text-[hsl(var(--warning))]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
