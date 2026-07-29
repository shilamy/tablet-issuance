"use client";

import { useState } from "react";
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState("");
  const [token, setToken] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email) {
      setError("Email address is required.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        setError(data?.error ?? "Failed to request password reset.");
        return;
      }

      setSuccess(true);
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
      if (data.token) {
        setToken(data.token);
      }
    } catch {
      setError("Reset request failed due to a network error.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-knbs-100 rounded-full blur-[120px] opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-knbs-500 to-knbs-600 text-white shadow-xl shadow-knbs-500/20 mb-6 mx-auto">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Reset Password</h1>
          <p className="text-gray-500 mt-2 font-medium">Request secure password reset links</p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white rounded-[2rem] border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-start gap-3 text-green-700 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-600 mt-0.5" />
                <div>
                  <p>Reset request completed successfully.</p>
                  <p className="text-xs text-green-600 mt-1 font-normal">
                    If this user exists, a reset ticket has been created.
                  </p>
                </div>
              </div>

              {resetUrl && (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 text-amber-900 text-sm">
                  <div className="font-bold mb-1 text-amber-800 flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Local Dev Environment detected:
                  </div>
                  <p className="text-xs text-amber-700 mb-4">
                    Since no outgoing email server is hooked up, here is your generated reset link:
                  </p>
                  <Link
                    href={`/auth/reset?token=${token}`}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 active:scale-[0.98]"
                  >
                    Go to reset page
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              <div className="pt-2 text-center">
                <Link
                  href="/auth/login"
                  className="text-sm font-bold text-knbs-600 hover:text-knbs-700 hover:underline"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-knbs-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="admin@knbs.go.ke"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-knbs-500/10 focus:border-knbs-500 transition-all font-medium text-gray-900"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-knbs-500 to-knbs-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-knbs-500/30 hover:shadow-xl hover:shadow-knbs-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {!success && (
            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500 font-medium">
                Remembered your password?{" "}
                <Link href="/auth/login" className="text-knbs-600 font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
          &copy; 2026 Kenya National Bureau of Statistics
        </p>
      </div>
    </div>
  );
}
