"use client";

import { useEffect, useState } from "react";
import { FaArrowUpRightFromSquare, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";

const inputClassName = "w-full rounded-xl border border-deep-navy/15 bg-brand-surface px-4 py-3 text-sm text-deep-navy outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:bg-white";

const emptyMedia = () => ({ type: "image", channel: "Instagram", caption: "", src: "", alt: "", position: "center", href: "", file: null });
const emptyService = () => ({ label: "", description: "", href: "" });
const emptyCaseStudy = () => ({ id: "", eyebrow: "", title: "", description: "", client: "", instagram: "", result: "", services: [emptyService()], media: [emptyMedia()] });

function Field({ label, value, onChange, required = false, multiline = false, type = "text", placeholder = "" }) {
  const props = { className: inputClassName, onChange: (event) => onChange(event.target.value), placeholder, required, value: value || "" };
  return <label className="grid gap-2 text-sm font-bold text-deep-navy"><span>{label}</span>{multiline ? <textarea {...props} className={`${inputClassName} min-h-28 resize-y leading-6`} /> : <input {...props} type={type} />}</label>;
}

export default function CaseStudyManager() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [form, setForm] = useState(emptyCaseStudy);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadCaseStudies() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cms/case-studies", { cache: "no-store" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) setError(result.error || "Gagal mengambil studi kasus.");
      else { setCaseStudies(result.caseStudies || []); setError(""); }
    } catch { setError("Tidak dapat terhubung ke server."); }
    finally { setIsLoading(false); }
  }

  useEffect(() => { loadCaseStudies(); }, []);

  useEffect(() => {
    if (!isEditorOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => { if (event.key === "Escape" && !isSaving) setIsEditorOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", closeOnEscape); };
  }, [isEditorOpen, isSaving]);

  function updateForm(key, value) { setForm((current) => ({ ...current, [key]: value })); }
  function updateList(key, index, field, value) {
    setForm((current) => ({ ...current, [key]: current[key].map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }));
  }
  function removeListItem(key, index) { setForm((current) => ({ ...current, [key]: current[key].filter((_, itemIndex) => itemIndex !== index) })); }

  function startNew() { setForm(emptyCaseStudy()); setMessage(""); setError(""); setIsEditorOpen(true); }
  function selectCaseStudy(item) { setForm({ ...emptyCaseStudy(), ...item }); setMessage(""); setError(""); setIsEditorOpen(true); }

  async function handleSubmit(event) {
    event.preventDefault(); setIsSaving(true); setMessage(""); setError("");
    try {
      const formData = new FormData();
      const caseStudy = { ...form, media: form.media.map(({ file, ...media }) => media) };
      formData.set("caseStudy", JSON.stringify(caseStudy));
      form.media.forEach((media, index) => { if (media.file) formData.set(`media-${index}`, media.file); });
      const response = await fetch("/api/cms/case-studies", { method: form.id ? "PATCH" : "POST", body: formData });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) { setError(result.error || "Gagal menyimpan studi kasus."); return; }
      setCaseStudies(result.caseStudies || []); setForm({ ...emptyCaseStudy(), ...result.caseStudy }); setMessage("Studi kasus berhasil disimpan.");
    } catch { setError("Tidak dapat terhubung ke server."); }
    finally { setIsSaving(false); }
  }

  async function handleDelete() {
    if (!form.id || !window.confirm(`Hapus portofolio ${form.client}?`)) return;
    setIsSaving(true); setError("");
    try {
      const response = await fetch("/api/cms/case-studies", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) { setError(result.error || "Gagal menghapus studi kasus."); return; }
      setCaseStudies(result.caseStudies || []); setForm(emptyCaseStudy()); setIsEditorOpen(false); setMessage("Studi kasus berhasil dihapus.");
    } catch { setError("Tidak dapat terhubung ke server."); }
    finally { setIsSaving(false); }
  }

  return <div className="min-w-0">
    <section className="overflow-hidden rounded-2xl border border-deep-navy/10 bg-white p-4 shadow-[0_12px_28px_rgb(23_36_61_/_8%)] sm:p-6">
      <div className="flex items-start justify-between gap-4 border-b-2 border-deep-navy/10 pb-5">
        <div><p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Portfolio workspace</p><h2 className="mt-2 text-xl font-black sm:text-2xl">Daftar studi kasus</h2><p className="mt-2 text-sm text-slate-600">Tambah, susun, dan kelola project yang tampil di website.</p></div>
        <button className="flex shrink-0 items-center gap-2 rounded-full border border-deep-navy bg-orange px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-deep-navy transition hover:bg-white" type="button" onClick={startNew}><FaPlus aria-hidden="true" /> Tambah</button>
      </div>
      {message ? <p className="mt-5 border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800" role="status">{message}</p> : null}
      {error && !isEditorOpen ? <p className="mt-5 border-l-4 border-hot-pink bg-hot-pink/10 px-4 py-3 text-sm font-bold text-deep-navy" role="alert">{error}</p> : null}
      {isLoading ? <p className="py-10 text-sm text-slate-500">Memuat studi kasus...</p> : null}
      {!isLoading && caseStudies.length === 0 ? <p className="py-10 text-sm text-slate-500">Belum ada portofolio.</p> : null}
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {caseStudies.map((item) => <button className="group flex min-w-0 items-start justify-between gap-4 rounded-xl border border-deep-navy/10 bg-slate-50 p-4 text-left transition hover:border-brand-blue hover:bg-white" key={item.id} type="button" onClick={() => selectCaseStudy(item)}><span className="min-w-0"><span className="block truncate text-base font-black text-deep-navy">{item.client || item.eyebrow}</span><span className="mt-1 block line-clamp-2 text-sm text-slate-600">{item.title}</span><span className="mt-3 block text-[10px] font-black uppercase tracking-[0.12em] text-brand-blue">{item.media?.length || 0} media · {item.services?.length || 0} layanan</span></span><FaArrowUpRightFromSquare className="mt-1 shrink-0 text-brand-blue opacity-60 transition group-hover:opacity-100" aria-hidden="true" /></button>)}
      </div>
    </section>

    {isEditorOpen ? <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-deep-navy/70 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="case-study-editor-title"><section className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl overflow-y-auto rounded-2xl border border-deep-navy/10 bg-white p-4 text-deep-navy shadow-2xl sm:max-h-[92vh] sm:p-7"><button className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center text-lg text-deep-navy/60 transition hover:text-hot-pink" type="button" onClick={() => setIsEditorOpen(false)} aria-label="Tutup editor" disabled={isSaving}><FaXmark aria-hidden="true" /></button><div className="border-b-2 border-deep-navy/10 pb-5 pr-12"><p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Portfolio editor</p><h2 id="case-study-editor-title" className="mt-2 text-xl font-black sm:text-2xl">{form.id ? "Edit portofolio" : "Tambah portofolio"}</h2></div>{error ? <p className="mt-5 border-l-4 border-hot-pink bg-hot-pink/10 px-4 py-3 text-sm font-bold text-deep-navy" role="alert">{error}</p> : null}
      <form className="mt-6 grid gap-6" onSubmit={handleSubmit}><div className="grid gap-4 md:grid-cols-2"><Field label="Nama klien" required value={form.client} onChange={(value) => updateForm("client", value)} /><Field label="Eyebrow" value={form.eyebrow} onChange={(value) => updateForm("eyebrow", value)} /><div className="md:col-span-2"><Field label="Judul project" required value={form.title} onChange={(value) => updateForm("title", value)} /></div><div className="md:col-span-2"><Field label="Deskripsi" multiline value={form.description} onChange={(value) => updateForm("description", value)} /></div><Field label="Hasil utama" value={form.result} onChange={(value) => updateForm("result", value)} /><Field label="Link Instagram" type="url" placeholder="https://instagram.com/..." value={form.instagram} onChange={(value) => updateForm("instagram", value)} /></div>
        <fieldset className="grid gap-4 border-t-2 border-deep-navy/10 pt-5"><legend className="text-lg font-black">Layanan project</legend>{form.services.map((service, index) => <div className="grid gap-3 rounded-xl border border-deep-navy/10 bg-slate-50 p-4 md:grid-cols-[1fr_1.5fr_auto]" key={`service-${index}`}><Field label="Nama layanan" value={service.label} onChange={(value) => updateList("services", index, "label", value)} /><Field label="Deskripsi layanan" value={service.description} onChange={(value) => updateList("services", index, "description", value)} /><button className="self-end p-3 text-hot-pink" type="button" aria-label="Hapus layanan" onClick={() => removeListItem("services", index)}><FaTrash aria-hidden="true" /></button></div>)}<button className="flex w-fit items-center gap-2 text-sm font-black text-brand-blue" type="button" onClick={() => setForm((current) => ({ ...current, services: [...current.services, emptyService()] }))}><FaPlus aria-hidden="true" /> Tambah layanan</button></fieldset>
        <fieldset className="grid gap-4 border-t-2 border-deep-navy/10 pt-5"><legend className="text-lg font-black">Media project</legend><p className="text-sm text-slate-600">Upload gambar atau video ke folder storage/portfolio. URL lama tetap dapat dipakai untuk media existing.</p>{form.media.map((media, index) => <div className="grid gap-3 rounded-xl border border-deep-navy/10 bg-slate-50 p-4 md:grid-cols-2" key={`media-${index}`}><div className="flex items-end gap-3"><label className="grid min-w-0 flex-1 gap-2 text-sm font-bold">Jenis media<select className={inputClassName} value={media.type} onChange={(event) => updateList("media", index, "type", event.target.value)}><option value="image">Gambar</option><option value="video">Video</option></select></label><button className="p-3 text-hot-pink" type="button" aria-label="Hapus media" onClick={() => removeListItem("media", index)}><FaTrash aria-hidden="true" /></button></div><Field label="Kanal" value={media.channel} onChange={(value) => updateList("media", index, "channel", value)} /><Field label="Caption" value={media.caption} onChange={(value) => updateList("media", index, "caption", value)} /><label className="grid gap-2 text-sm font-bold text-deep-navy">Upload media<input accept="image/*,video/*" className="block w-full border-2 border-dashed border-deep-navy/20 bg-white px-4 py-4 text-sm text-slate-600 file:mr-4 file:border-0 file:bg-orange file:px-3 file:py-2 file:text-xs file:font-black file:text-deep-navy" type="file" onChange={(event) => updateList("media", index, "file", event.target.files?.[0] || null)} /></label><Field label="URL atau path media lama" value={media.src} onChange={(value) => updateList("media", index, "src", value)} /><Field label="Teks alternatif" value={media.alt} onChange={(value) => updateList("media", index, "alt", value)} /><Field label="Link media (opsional)" type="url" value={media.href} onChange={(value) => updateList("media", index, "href", value)} /></div>)}<button className="flex w-fit items-center gap-2 text-sm font-black text-brand-blue" type="button" onClick={() => setForm((current) => ({ ...current, media: [...current.media, emptyMedia()] }))}><FaPlus aria-hidden="true" /> Tambah media</button></fieldset>
        <div className="flex flex-wrap gap-3"><button className="rounded-full border border-deep-navy bg-orange px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-deep-navy transition hover:bg-white disabled:opacity-60" disabled={isSaving} type="submit">{isSaving ? "Menyimpan..." : "Simpan portofolio"}</button>{form.id ? <button className="rounded-full border border-hot-pink px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-hot-pink transition hover:bg-hot-pink hover:text-white" disabled={isSaving} type="button" onClick={handleDelete}>Hapus portofolio</button> : null}</div></form></section></div> : null}
  </div>;
}
