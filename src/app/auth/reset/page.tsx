"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const t = searchParams.get("token");
    setToken(t);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      setError("Reset token is missing.");
      return;
    }
    if (!password) {
      setError("New password is required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        setError(data?.error ?? "Reset failed. Please try again.");
        return;
      }

      setSuccess(true);
      setPassword("");

      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch {
      setError("Reset failed due to a network error.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-[2rem] border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-10">
      <h1 className="text-2xl font-black text-gray-900">Reset Password</h1>
      <p className="text-gray-500 mt-2 font-medium text-sm">
        Set a new password to regain access.
      </p>

      {error && (
        <div className="mt-6 mb-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-bold">
          {error}
        </div>
      )}

      {success ? (
        <div className="mt-6 mb-4 p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm font-bold">
          Password updated successfully. Redirecting…
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter a new password"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-knbs-500/10 focus:border-knbs-500 transition-all font-medium text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-knbs-500 to-knbs-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-knbs-500/30 hover:shadow-xl hover:shadow-knbs-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100"
          >
            {isLoading ? "Resetting…" : "Update Password"}
          </button>
        </form>
      )}

      <div className="mt-8 pt-8 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500 font-medium">
          Remembered your password?{" "}
          <Link href="/auth/login" className="text-knbs-600 font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <Suspense fallback={
          <div className="bg-white rounded-[2rem] border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-10 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-10 h-10 border-4 border-knbs-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-4 font-medium text-sm">Loading reset form...</p>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}


