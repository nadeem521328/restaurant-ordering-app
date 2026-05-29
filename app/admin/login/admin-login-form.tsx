"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setError("");
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (loginError) {
      setError("Invalid admin login.");
      return;
    }

    router.replace(searchParams.get("next") || "/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-lg bg-white p-5 ring-1 ring-orange-100">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-700">
          <Lock size={24} aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-950">Admin login</h1>
          <p className="text-sm text-gray-600">Restaurant operations</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-bold text-gray-800">Email</span>
          <input
            className="mt-2 min-h-12 w-full rounded-lg border border-gray-200 px-3 text-lg outline-none focus:border-red-700"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-gray-800">Password</span>
          <input
            className="mt-2 min-h-12 w-full rounded-lg border border-gray-200 px-3 text-lg outline-none focus:border-red-700"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
            {error}
          </p>
        ) : null}

        <Button
          className="w-full"
          disabled={!email || !password || loading}
          onClick={login}
        >
          <LogIn size={20} aria-hidden />
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </div>
  );
}
