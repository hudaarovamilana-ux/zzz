"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { registerNewUser } from "@/lib/user-storage";

const inputClass =
  "w-full rounded-xl border border-beige-dark bg-white px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-rose/40";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Введите имя");
      return;
    }
    if (!email.trim()) {
      setError("Введите email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Введите корректный email");
      return;
    }
    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }

    registerNewUser(name, email);
    router.push("/dashboard");
  };

  return (
    <AuthShell
      title="Регистрация"
      subtitle={
        <>
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-ink underline hover:text-ink/80">
            Войти
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Имя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Как к вам обращаться"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            autoComplete="new-password"
            placeholder="Не менее 6 символов"
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
          Создать аккаунт
        </button>
      </form>
    </AuthShell>
  );
}
