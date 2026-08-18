"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";

const emptyForm = {
  id: "",
  name: "",
  websiteUrl: "",
  sortOrder: 0,
  isPublished: true,
  logo: null,
  logoPath: "",
};

const inputClassName = "w-full border-2 border-deep-navy/15 bg-brand-surface px-4 py-3 text-sm text-deep-navy outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:bg-white";

export default function ClientManager() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadClients() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cms/clients", { cache: "no-store" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result.error || "Gagal mengambil data mitra.");
      } else {
        setClients(result.clients || []);
        setError("");
      }
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (!isEditorOpen) return undefined;

    function handleEscape(event) {
      if (event.key === "Escape" && !isSaving) setIsEditorOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isEditorOpen, isSaving]);

  function selectClient(client) {
    setForm({ ...client, logo: null });
    setMessage("");
    setError("");
    setIsEditorOpen(true);
  }

  function startNewClient() {
    setForm({ ...emptyForm, sortOrder: clients.length });
    setMessage("");
    setError("");
    setIsEditorOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.set("name", form.name);
    formData.set("websiteUrl", form.websiteUrl || "");
    formData.set("sortOrder", String(form.sortOrder));
    formData.set("isPublished", String(form.isPublished));
    if (form.id) formData.set("id", form.id);
    if (form.logo) formData.set("logo", form.logo);

    try {
      const response = await fetch("/api/cms/clients", {
        method: form.id ? "PATCH" : "POST",
        body: formData,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result.error || "Gagal menyimpan mitra.");
        return;
      }

      setMessage("Data mitra berhasil disimpan.");
      await loadClients();
      selectClient(result.client);
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!form.id || !window.confirm(`Hapus mitra ${form.name}?`)) return;

    setError("");
    try {
      const response = await fetch("/api/cms/clients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: form.id }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result.error || "Gagal menghapus mitra.");
        return;
      }

      setForm(emptyForm);
      setMessage("Mitra berhasil dihapus.");
      await loadClients();
      setIsEditorOpen(false);
    } catch {
      setError("Tidak dapat terhubung ke server.");
    }
  }

  return (
    <div className="min-w-0">
      <section className="min-w-0 overflow-hidden border-2 border-deep-navy bg-white p-4 sm:p-6" aria-labelledby="client-list-title">
        <div className="flex items-start justify-between gap-4 border-b-2 border-deep-navy/10 pb-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Database</p>
            <h2 id="client-list-title" className="mt-2 text-xl font-black sm:text-2xl">Daftar mitra</h2>
          </div>
          <button className="border-2 border-deep-navy bg-orange px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-deep-navy shadow-[2px_2px_0_var(--brand-hot-pink)] transition hover:bg-white" type="button" onClick={startNewClient}>
            Tambah
          </button>
        </div>

        {isLoading ? <p className="py-8 text-sm text-slate-500">Memuat mitra...</p> : null}
        {!isLoading && clients.length === 0 ? <p className="py-8 text-sm text-slate-500">Belum ada mitra.</p> : null}
        <div className="mt-5 grid gap-2">
          {clients.map((client) => (
            <button
              className={`flex min-w-0 items-center gap-3 border-2 p-3 text-left transition ${form.id === client.id ? "border-deep-navy bg-brand-surface" : "border-transparent bg-slate-50 hover:border-brand-blue"}`}
              key={client.id}
              type="button"
              onClick={() => selectClient(client)}
            >
              <span className="flex h-14 w-16 shrink-0 items-center justify-center bg-white p-1">
                <Image src={client.logoPath} alt="" width={96} height={72} className="h-full w-full object-contain" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-black text-deep-navy">{client.name}</span>
                <span className={`mt-1 block text-[10px] font-black uppercase tracking-[0.1em] ${client.isPublished ? "text-emerald-600" : "text-slate-400"}`}>
                  {client.isPublished ? "Tayang" : "Draft"}
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {message ? <p className="mt-5 border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800" role="status">{message}</p> : null}
      {error && !isEditorOpen ? <p className="mt-5 border-l-4 border-hot-pink bg-hot-pink/10 px-4 py-3 text-sm font-bold text-deep-navy" role="alert">{error}</p> : null}

      {isEditorOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-deep-navy/70 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="client-editor-title">
          <section className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto border-2 border-deep-navy bg-white p-4 text-deep-navy shadow-2xl sm:max-h-[92vh] sm:p-7">
            <button className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center text-lg text-deep-navy/60 transition hover:text-hot-pink" type="button" onClick={() => setIsEditorOpen(false)} aria-label="Tutup editor mitra" disabled={isSaving}>
              <FaXmark aria-hidden="true" />
            </button>
            <div className="border-b-2 border-deep-navy/10 pb-5 pr-12">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Editor mitra</p>
              <h2 id="client-editor-title" className="mt-2 text-xl font-black sm:text-2xl">{form.id ? "Edit mitra" : "Tambah mitra"}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Upload logo, atur nama, urutan, dan status tampil di website.</p>
            </div>

            {error ? <p className="mt-5 border-l-4 border-hot-pink bg-hot-pink/10 px-4 py-3 text-sm font-bold text-deep-navy" role="alert">{error}</p> : null}

            <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-bold text-deep-navy">
            Nama mitra
            <input className={inputClassName} required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-deep-navy">
            Website (opsional)
            <input className={inputClassName} type="url" value={form.websiteUrl || ""} onChange={(event) => setForm({ ...form, websiteUrl: event.target.value })} placeholder="https://contoh.com" />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-deep-navy">
              Urutan tampil
              <input className={inputClassName} min="0" type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} />
            </label>
            <label className="flex items-center gap-3 self-end pb-3 text-sm font-bold text-deep-navy">
              <input checked={form.isPublished} className="h-4 w-4 accent-[var(--brand-deep-navy)]" type="checkbox" onChange={(event) => setForm({ ...form, isPublished: event.target.checked })} />
              Tampilkan di website
            </label>
          </div>
          <label className="grid gap-2 text-sm font-bold text-deep-navy">
            {form.id ? "Ganti logo (opsional)" : "Logo mitra"}
            <input accept="image/png,image/jpeg,image/webp,image/gif" className="block w-full border-2 border-dashed border-deep-navy/20 bg-brand-surface px-4 py-4 text-sm text-slate-600 file:mr-4 file:border-0 file:bg-orange file:px-3 file:py-2 file:text-xs file:font-black file:text-deep-navy" required={!form.id} type="file" onChange={(event) => setForm({ ...form, logo: event.target.files?.[0] || null })} />
          </label>
          {form.logoPath ? <Image src={form.logoPath} alt="Preview logo mitra" width={220} height={140} className="h-32 w-full border border-deep-navy/10 bg-slate-50 object-contain p-3" /> : null}
          <div className="flex flex-wrap gap-3">
            <button className="border-2 border-deep-navy bg-orange px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-deep-navy shadow-[3px_3px_0_var(--brand-hot-pink)] transition hover:bg-white disabled:opacity-60" disabled={isSaving} type="submit">
              {isSaving ? "Menyimpan..." : "Simpan mitra"}
            </button>
            {form.id ? <button className="border-2 border-hot-pink px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-hot-pink transition hover:bg-hot-pink hover:text-white" type="button" onClick={handleDelete}>Hapus</button> : null}
          </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
