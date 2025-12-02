"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      username: form.username,
      password: form.password,
      callbackUrl,
    });

    setLoading(false);

    if (!res || res.error) {
      setError("Invalid credentials. Please check and try again.");
      return;
    }

    router.push(callbackUrl);
  }

  return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/40 backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-400 mb-6">
            Sign in to view your cart, wishlist, and orders.
          </p>
  
          {error && (
            <div className="mb-4 rounded-lg border border-rose-500/60 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
              {error}
            </div>
          )}
  
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Username or Email
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
                placeholder="your username or email"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
  
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
  
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/50 hover:from-sky-400 hover:to-blue-500 hover:shadow-sky-500/70 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
  
          <div className="mt-5">
            <p className="text-[11px] text-slate-500 mb-2 text-center">or continue with</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl })}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs font-medium text-slate-200 hover:border-sky-400 hover:text-sky-300 transition-all"
              >
                Google
              </button>
              <button
                type="button"
                onClick={() => signIn("github", { callbackUrl })}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs font-medium text-slate-200 hover:border-sky-400 hover:text-sky-300 transition-all"
              >
                GitHub
              </button>
            </div>
          </div>
  
          <p className="mt-4 text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-sky-400 hover:text-sky-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    );
}
