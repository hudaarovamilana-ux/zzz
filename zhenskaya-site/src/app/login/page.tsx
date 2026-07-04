"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { setUserLoggedIn } from "@/lib/user-storage";

const inputClass =
  "w-full rounded-xl border border-beige-dark bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose/40";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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

    setUserLoggedIn(email);
    router.push("/dashboard");
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
          className="w-full rounded-full bg-ink py-4 text-sm font-medium text-cream hover:bg-ink/90 transition"
        >
          Войти
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-beige-dark/40">
        <p className="text-xs text-ink-muted text-center mb-4">Или привязать Telegram</p>
        <button
          type="button"
          className="w-full rounded-full border border-beige-dark py-3 text-sm text-ink-soft hover:bg-beige/50 transition"
        >
          Войти через Telegram
        </button>
      </div>
    </AuthShell>
  );
}
