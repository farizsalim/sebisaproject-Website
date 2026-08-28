"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaXmark } from "react-icons/fa6";

const inputClassName = "w-full rounded-xl border border-deep-navy/15 bg-brand-surface px-4 py-3 text-sm text-deep-navy outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:bg-white";
const emptyForm = { id: "", description: "", altText: "", sortOrder: 0, isPublished: true, media: null };

export default function BehindScenesManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadItems() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cms/behind-scenes", { cache: "no-store" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) setError(result.error || "Gagal mengambil dokumentasi.");
      else setItems(result.behindScenes || []);
    } catch { setError("Tidak dapat terhubung ke server."); }
    finally { setIsLoading(false); }
  }

  useEffect(() => { Promise.resolve().then(loadItems); }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true); setError(""); setMessage("");
    const formElement = event.currentTarget;
    const data = new FormData(formElement);
    if (form.id) data.set("id", form.id);
    if (form.media) data.set("media", form.media);
    try {
      const response = await fetch("/api/cms/behind-scenes", { method: form.id ? "PATCH" : "POST", body: data });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) { setError(result.error || "Gagal menyimpan dokumentasi."); return; }
      setMessage(form.id ? "Dokumentasi berhasil diperbarui." : "Dokumentasi berhasil diunggah."); setForm(emptyForm); formElement.reset(); setIsOpen(false); await loadItems();
    } catch { setError("Tidak dapat terhubung ke server."); }
    finally { setIsSaving(false); }
  }

  function editItem(item) {
    setForm({ id: item.id, description: item.caption, altText: item.alt, sortOrder: item.sortOrder, isPublished: item.isPublished, media: null });
    setError(""); setMessage(""); setIsOpen(true);
  }

  async function handleDelete(item) {
    if (!window.confirm("Hapus dokumentasi ini?")) return;
    const response = await fetch("/api/cms/behind-scenes", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) setError(result.error || "Gagal menghapus dokumentasi.");
    else { setMessage("Dokumentasi berhasil dihapus."); await loadItems(); }
  }

  return <div className="min-w-0">
    <section className="overflow-hidden rounded-2xl border border-deep-navy/10 bg-white p-4 shadow-[0_12px_28px_rgb(23_36_61_/_8%)] sm:p-6">
      <div className="flex items-start justify-between gap-4 border-b-2 border-deep-navy/10 pb-5">
        <div><p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Behind scenes workspace</p><h2 className="mt-2 text-xl font-black sm:text-2xl">Dokumentasi proses</h2><p className="mt-2 text-sm text-slate-600">Upload foto atau video proses kerja yang tampil di galeri website.</p></div>
        <button className="flex shrink-0 items-center gap-2 rounded-full border border-deep-navy bg-orange px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-deep-navy transition hover:bg-white" type="button" onClick={() => { setForm(emptyForm); setIsOpen(true); }}><FaPlus aria-hidden="true" /> Tambah</button>
      </div>
      {message ? <p className="mt-5 border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800" role="status">{message}</p> : null}
      {error && !isOpen ? <p className="mt-5 border-l-4 border-hot-pink bg-hot-pink/10 px-4 py-3 text-sm font-bold text-deep-navy" role="alert">{error}</p> : null}
      {isLoading ? <p className="py-10 text-sm text-slate-500">Memuat dokumentasi...</p> : null}
      {!isLoading && !items.length ? <p className="py-10 text-sm text-slate-500">Belum ada dokumentasi.</p> : null}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => <article className="overflow-hidden rounded-xl border border-deep-navy/10 bg-slate-50" key={item.id}><button className="block aspect-square w-full bg-deep-navy" type="button" aria-label={`Edit ${item.caption}`} onClick={() => editItem(item)}>{item.type === "video" ? <video className="h-full w-full object-cover" muted preload="metadata" src={item.src} /> : <img alt={item.alt} className="h-full w-full object-cover" src={item.src} />}</button><div className="p-3"><p className="line-clamp-2 min-h-10 text-sm font-bold text-deep-navy">{item.caption}</p><div className="mt-3 flex items-center justify-between gap-2"><button className="text-xs font-black uppercase tracking-[0.08em] text-brand-blue" type="button" onClick={() => editItem(item)}>Edit</button><button className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-hot-pink" type="button" onClick={() => handleDelete(item)}><FaTrash aria-hidden="true" /> Hapus</button></div></div></article>)}
      </div>
    </section>
    {isOpen ? <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-deep-navy/70 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="behind-scenes-editor-title"><section className="relative w-full max-w-2xl rounded-2xl bg-white p-4 text-deep-navy shadow-2xl sm:p-7"><button className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center text-lg text-deep-navy/60 transition hover:text-hot-pink" type="button" onClick={() => setIsOpen(false)} aria-label="Tutup editor"><FaXmark aria-hidden="true" /></button><h2 id="behind-scenes-editor-title" className="border-b-2 border-deep-navy/10 pb-5 pr-12 text-xl font-black sm:text-2xl">{form.id ? "Edit behind the scenes" : "Tambah behind the scenes"}</h2>{error ? <p className="mt-5 border-l-4 border-hot-pink bg-hot-pink/10 px-4 py-3 text-sm font-bold" role="alert">{error}</p> : null}<form className="mt-6 grid gap-4" onSubmit={handleSubmit}><label className="grid gap-2 text-sm font-bold">Media {form.id ? "baru (opsional)" : ""}<input className={inputClassName} accept="image/*,video/*" required={!form.id} type="file" onChange={(event) => setForm((current) => ({ ...current, media: event.target.files?.[0] || null }))} /></label><label className="grid gap-2 text-sm font-bold">Deskripsi / caption<textarea className={`${inputClassName} min-h-32 resize-y`} defaultValue={form.description} name="description" required placeholder="Ceritakan proses pada dokumentasi ini" /></label><label className="grid gap-2 text-sm font-bold">Teks alternatif<input className={inputClassName} defaultValue={form.altText} name="altText" placeholder="Deskripsi singkat untuk aksesibilitas" type="text" /></label><label className="flex items-center gap-3 text-sm font-bold"><input defaultChecked={form.isPublished} name="isPublished" type="checkbox" value="true" /> Tampilkan di website</label><button className="w-fit rounded-full border border-deep-navy bg-orange px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-deep-navy disabled:opacity-60" disabled={isSaving} type="submit">{isSaving ? "Menyimpan..." : form.id ? "Simpan perubahan" : "Upload dokumentasi"}</button></form></section></div> : null}
  </div>;
}
