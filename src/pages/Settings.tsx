import { useAuth } from "../contexts/AuthContext";
import { SessionManager } from "../components/SessionManager";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function Settings() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Account Information</h2>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Email:
                </span>
                <span className="ml-2 text-sm text-gray-900">
                  {user?.email}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Role:</span>
                <span
                  className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    user?.role === "ADMIN"
                      ? "bg-purple-100 text-purple-800"
                      : user?.role === "MODERATOR"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user?.role || "USER"}
                </span>
              </div>
            </div>
          </div>

          {/* Session Manager */}
          <SessionManager />

          {/* Security Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Security Features</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>
                  HTTP-only cookies for refresh tokens (XSS protection)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Automatic token refresh before expiration</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Multi-tab synchronization for logout events</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Device fingerprinting for session tracking</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>SHA-256 hashed tokens in database</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
