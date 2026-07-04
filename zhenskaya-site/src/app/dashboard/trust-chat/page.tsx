"use client";

import { useState } from "react";

const WELCOME =
  "Здесь вы можете анонимно поделиться тем, что вас беспокоит. Мы рядом и готовы выслушать.";

const SUPPORT_REPLY =
  "Спасибо, что поделились. Вы не одна — ваши чувства важны. Если ситуация тревожная, пожалуйста, обратитесь к врачу очно.";

export default function TrustChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "support"; text: string }[]>([
    { role: "support", text: WELCOME },
  ]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const text = message.trim();
    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "support", text: SUPPORT_REPLY },
    ]);
    setMessage("");
  };

  return (
    <div className="max-w-2xl flex flex-col h-[calc(100vh-12rem)]">
      <h1 className="text-2xl font-medium text-ink mb-2">Чат доверия</h1>
      <p className="text-sm text-ink-muted mb-6">
        Анонимно и конфиденциально. Не заменяет помощь специалиста в острых ситуациях.
      </p>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 rounded-2xl border border-beige-dark/40 bg-white/50 p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-ink text-cream"
                : "bg-rose-pale/60 text-ink-soft"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <form onSubmit={send} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Напишите сообщение..."
          className="flex-1 rounded-full border border-beige-dark bg-white px-4 py-3 text-sm"
        />
        <button
          type="submit"
          className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream hover:bg-ink/90 transition shrink-0"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}
