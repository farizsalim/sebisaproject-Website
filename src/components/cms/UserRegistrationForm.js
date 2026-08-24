"use client";

import { useState } from "react";

const inputClassName = "w-full rounded-xl border border-deep-navy/15 bg-brand-surface px-4 py-3 text-sm text-deep-navy outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:bg-white";

const roleOptions = [
  { value: "ADMIN", label: "Admin", description: "Mengelola CMS tanpa akses pendaftaran akun." },
];

export default function UserRegistrationForm() {
  const [role, setRole] = useState("ADMIN");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password");
    if (password !== formData.get("passwordConfirmation")) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.get("name"), email: formData.get("email"), password, role }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result.error || "Pendaftaran akun gagal.");
        return;
      }

      event.currentTarget.reset();
      setRole("ADMIN");
      setMessage(`Akun ${result.user?.email || "baru"} berhasil didaftarkan sebagai Admin.`);
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      {message ? <p className="border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800" role="status">{message}</p> : null}
      {error ? <p className="border-l-4 border-hot-pink bg-hot-pink/10 px-4 py-3 text-sm font-bold text-deep-navy" role="alert">{error}</p> : null}
      <label className="grid gap-2 text-sm font-bold">Nama pengguna<input className={inputClassName} name="name" required minLength={2} maxLength={100} placeholder="Nama pengguna" /></label>
      <label className="grid gap-2 text-sm font-bold">Email<input className={inputClassName} name="email" required type="email" placeholder="nama@perusahaan.com" /></label>
      <fieldset className="grid gap-2 text-sm font-bold"><legend>Role akun</legend><div className="grid gap-2">{roleOptions.map((option) => <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${role === option.value ? "border-brand-blue bg-brand-blue/10 ring-2 ring-brand-blue/15" : "border-deep-navy/15 bg-brand-surface"}`} key={option.value}><input className="mt-1 accent-[var(--brand-deep-navy)]" type="radio" name="role" value={option.value} checked={role === option.value} onChange={() => setRole(option.value)} /><span><span className="block font-black">{option.label}</span><span className="mt-1 block text-xs font-normal leading-5 text-slate-500">{option.description}</span></span></label>)}</div></fieldset>
      <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-bold">Password<input className={inputClassName} name="password" required minLength={8} maxLength={100} type="password" placeholder="Minimal 8 karakter" /></label><label className="grid gap-2 text-sm font-bold">Konfirmasi password<input className={inputClassName} name="passwordConfirmation" required minLength={8} maxLength={100} type="password" placeholder="Ulangi password" /></label></div>
      <button className="w-full rounded-full border border-deep-navy bg-orange px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-deep-navy shadow-[0_8px_18px_rgb(23_36_61_/_14%)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-wait disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? "Mendaftarkan..." : "Daftarkan akun"}</button>
    </form>
  );
}