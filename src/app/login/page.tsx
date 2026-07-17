"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { postJson } from "@/lib/api-client";
import { saveUserName, setUserLoggedIn } from "@/lib/user-storage";

const inputClass =
  "w-full rounded-xl border border-beige-dark bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose/40";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Введите email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Введите корректный email");
      return;
    }
    if (!password) {
      setError("Введите пароль");
      return;
    }

    setLoading(true);
    try {
      const data = await postJson<{ user: { email: string; name: string } }>("/api/auth/login", {
        email: email.trim(),
        password,
      });
      saveUserName(data.user.name);
      setUserLoggedIn(data.user.email);
      const next = searchParams.get("next");
      router.push(next?.startsWith("/") ? next : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось войти");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Вход"
      subtitle={
        <>
          Нет аккаунта?{" "}
          <Link href="/register" className="text-ink underline hover:text-ink/80">
            Зарегистрироваться
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="text-sm text-rose-muted bg-rose-pale/50 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-ink py-4 text-sm font-medium text-cream hover:bg-ink/90 disabled:opacity-50 transition"
        >
          {loading ? "Входим..." : "Войти"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AuthShell title="Вход" subtitle="Загрузка…">
          <div className="h-40 animate-pulse rounded-xl bg-beige/60" />
        </AuthShell>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
