"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ registrationSuccess = false }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Email atau password salah, atau akun belum aktif.");
      setIsSubmitting(false);
      return;
    }

    router.push("/cms");
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {registrationSuccess ? (
        <p className="border-l-4 border-brand-blue bg-brand-blue/10 px-4 py-3 text-sm font-bold leading-5 text-deep-navy" role="status">
          Akun berhasil dibuat. Silakan masuk untuk melanjutkan.
        </p>
      ) : null}
      {error ? (
        <p className="border-l-4 border-hot-pink bg-hot-pink/10 px-4 py-3 text-sm font-bold leading-5 text-deep-navy" role="alert">
          {error}
        </p>
      ) : null}

      <div>
        <label className="mb-2 block text-sm font-semibold text-deep-navy" htmlFor="email">
          Email
        </label>
        <input
          className="w-full border-2 border-deep-navy/15 bg-brand-surface px-4 py-3 text-sm text-deep-navy outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:bg-white"
          id="email"
          name="email"
          placeholder="nama@perusahaan.com"
          required
          type="email"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <label className="text-sm font-semibold text-deep-navy" htmlFor="password">
            Password
          </label>
          <button className="text-xs font-semibold text-brand-blue transition hover:text-deep-navy" type="button">
            Lupa password?
          </button>
        </div>
        <input
          className="w-full border-2 border-deep-navy/15 bg-brand-surface px-4 py-3 text-sm text-deep-navy outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:bg-white"
          id="password"
          name="password"
          placeholder="Masukkan password"
          required
          type="password"
        />
      </div>

      <button
        className="w-full border-2 border-deep-navy bg-orange px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-deep-navy shadow-[3px_3px_0_var(--brand-hot-pink)] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[5px_5px_0_var(--brand-hot-pink)] disabled:cursor-wait disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Memeriksa..." : "Masuk ke CMS"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Belum punya akun?{" "}
        <Link className="font-bold text-brand-blue transition hover:text-deep-navy" href="/register">
          Daftar di sini
        </Link>
      </p>
    </form>
  );
}
