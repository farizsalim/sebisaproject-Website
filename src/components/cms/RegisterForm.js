"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClassName =
  "w-full rounded-xl border border-deep-navy/15 bg-brand-surface px-4 py-3 text-sm text-deep-navy outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:bg-white";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password");
    const passwordConfirmation = formData.get("passwordConfirmation");

    if (password !== passwordConfirmation) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Registrasi gagal. Silakan coba lagi.");
        setIsSubmitting(false);
        return;
      }

      router.push("/login?registered=1");
    } catch {
      setError("Tidak dapat terhubung ke server.");
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error ? (
        <p className="rounded-xl border-l-4 border-hot-pink bg-hot-pink/10 px-4 py-3 text-sm font-bold leading-5 text-deep-navy" role="alert">
          {error}
        </p>
      ) : null}

      <div>
        <label className="mb-2 block text-sm font-semibold text-deep-navy" htmlFor="name">
          Username / nama
        </label>
        <input className={inputClassName} id="name" name="name" placeholder="Nama pengguna" required type="text" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-deep-navy" htmlFor="email">
          Email
        </label>
        <input className={inputClassName} id="email" name="email" placeholder="nama@perusahaan.com" required type="email" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-deep-navy" htmlFor="password">
          Password
        </label>
        <input className={inputClassName} id="password" minLength={8} name="password" placeholder="Minimal 8 karakter" required type="password" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-deep-navy" htmlFor="passwordConfirmation">
          Konfirmasi password
        </label>
        <input className={inputClassName} id="passwordConfirmation" minLength={8} name="passwordConfirmation" placeholder="Ulangi password" required type="password" />
      </div>

      <button
        className="w-full rounded-full border border-deep-navy bg-orange px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-deep-navy shadow-[0_8px_18px_rgb(23_36_61_/_14%)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-wait disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Membuat akun..." : "Buat akun"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Sudah punya akun?{" "}
        <Link className="font-bold text-brand-blue transition hover:text-deep-navy" href="/login">
          Masuk di sini
        </Link>
      </p>
    </form>
  );
}
