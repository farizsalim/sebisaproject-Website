"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaXmark } from "react-icons/fa6";

const emptyService = {
  groupId: "",
  originalGroupId: "",
  originalName: "",
  name: "",
  originalPrice: "",
  price: "",
  duration: "",
  description: "",
  benefits: "",
  isRecommended: false,
  flashSale: false,
  discount: 0,
  flashSaleEndsAt: "",
};

const inputClassName = "w-full border-2 border-deep-navy/15 bg-brand-surface px-4 py-3 text-sm text-deep-navy outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:bg-white";

function flattenServices(groups) {
  return groups.flatMap((group) => group.services.map((service) => ({ ...service, groupId: group.id, category: group.category })));
}

export default function ServicesManager() {
  const [groups, setGroups] = useState([]);
  const [form, setForm] = useState(emptyService);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadServices() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cms/services", { cache: "no-store" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) setError(result.error || "Gagal mengambil data layanan.");
      else {
        setGroups(result.services || []);
        setIsPublished(result.isPublished !== false);
        setError("");
      }
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
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

  function openNewService() {
    setForm({ ...emptyService, groupId: groups[0]?.id || "" });
    setMessage("");
    setError("");
    setIsEditorOpen(true);
  }

  function openEditService(service) {
    setForm({
      groupId: service.groupId,
      originalGroupId: service.groupId,
      originalName: service.name,
      name: service.name,
      originalPrice: service.originalPrice,
      price: service.price,
      duration: service.duration || "",
      description: service.description,
      benefits: Array.isArray(service.benefits) ? service.benefits.join("\n") : service.description,
      isRecommended: Boolean(service.isRecommended),
      flashSale: Boolean(service.flashSale),
      discount: service.discount || 0,
      flashSaleEndsAt: service.flashSaleEndsAt || "",
    });
    setMessage("");
    setError("");
    setIsEditorOpen(true);
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function buildNextGroups() {
    const service = {
      name: form.name.trim(),
      originalPrice: form.originalPrice.trim(),
      price: form.price.trim(),
      duration: form.duration.trim(),
      description: form.description.trim(),
      benefits: form.benefits.split("\n").map((benefit) => benefit.trim()).filter(Boolean),
      isRecommended: form.isRecommended,
      flashSale: form.flashSale,
      discount: form.flashSale ? Number(form.discount) : 0,
      flashSaleEndsAt: form.flashSale ? form.flashSaleEndsAt || null : null,
    };
    return groups.map((group) => {
      const cleanedServices = form.originalName && group.id === form.originalGroupId
        ? group.services.filter((item) => item.name !== form.originalName)
        : group.services;
      if (group.id !== form.groupId) return { ...group, services: cleanedServices };
      return {
        ...group,
        services: [...cleanedServices, service],
      };
    });
  }

  async function saveGroups(nextGroups) {
    const response = await fetch("/api/cms/services", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ services: nextGroups, isPublished }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Gagal menyimpan data layanan.");
    setGroups(result.services || nextGroups);
    setIsPublished(result.isPublished !== false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");
    try {
      const nextGroups = buildNextGroups();
      await saveGroups(nextGroups);
      setMessage("Layanan berhasil disimpan.");
      setIsEditorOpen(false);
    } catch (submitError) {
      setError(submitError.message || "Gagal menyimpan data layanan.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(service) {
    if (!window.confirm(`Hapus layanan ${service.name}?`)) return;
    setError("");
    try {
      const nextGroups = groups.map((group) => group.id === service.groupId ? { ...group, services: group.services.filter((item) => item.name !== service.name) } : group);
      await saveGroups(nextGroups);
      setMessage("Layanan berhasil dihapus.");
    } catch (deleteError) {
      setError(deleteError.message || "Gagal menghapus layanan.");
    }
  }

  const services = flattenServices(groups);

  return (
    <div className="min-w-0">
      <section className="min-w-0 overflow-hidden border-2 border-deep-navy bg-white p-4 sm:p-6" aria-labelledby="services-list-title">
        <div className="flex flex-col items-start justify-between gap-4 border-b-2 border-deep-navy/10 pb-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Database</p>
            <h2 id="services-list-title" className="mt-2 text-xl font-black sm:text-2xl">Daftar layanan</h2>
            <p className="mt-2 text-sm text-slate-600">{services.length} layanan dalam {groups.length} kategori.</p>
          </div>
          <button className="inline-flex items-center gap-2 border-2 border-deep-navy bg-orange px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-deep-navy shadow-[2px_2px_0_var(--brand-hot-pink)] transition hover:bg-white" type="button" onClick={openNewService} disabled={groups.length === 0}>
            <FaPlus aria-hidden="true" /> Tambah layanan
          </button>
        </div>

        {message ? <p className="mt-5 border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800" role="status">{message}</p> : null}
        {error && !isEditorOpen ? <p className="mt-5 border-l-4 border-hot-pink bg-hot-pink/10 px-4 py-3 text-sm font-bold text-deep-navy" role="alert">{error}</p> : null}
        {isLoading ? <p className="py-8 text-sm text-slate-500">Memuat layanan...</p> : null}
        {!isLoading && groups.length === 0 ? <p className="py-8 text-sm text-slate-500">Belum ada kategori layanan.</p> : null}

        <div className="mt-5 grid gap-6">
          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`service-group-${group.id}`}>
              <div className="flex items-center justify-between gap-4 border-b border-deep-navy/10 pb-2">
                <h3 id={`service-group-${group.id}`} className="text-lg font-black">{group.category}</h3>
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">{group.services.length} item</span>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {group.services.map((service) => (
                  <article className="min-w-0 border-2 border-deep-navy/10 bg-slate-50 p-4" key={service.name}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="line-clamp-2 font-black text-deep-navy">{service.name}</h4>
                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">{service.description}</p>
                      </div>
                      {service.flashSale ? <span className="shrink-0 border border-hot-pink bg-hot-pink/10 px-2 py-1 text-[10px] font-black uppercase text-hot-pink">-{service.discount}%</span> : null}
                    </div>
                    <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-deep-navy/10 pt-3">
                      <div><p className="text-xs text-slate-500">{service.duration}</p>{service.originalPrice ? <p className="text-xs text-slate-500 line-through">{service.originalPrice}</p> : null}<p className="font-black text-orange">{service.price}</p></div>
                      <div className="flex gap-2"><button className="border-2 border-deep-navy bg-white px-3 py-2 text-xs font-black uppercase text-deep-navy transition hover:bg-orange" type="button" onClick={() => openEditService({ ...service, groupId: group.id, originalName: service.name })}>Edit</button><button className="flex h-9 w-9 items-center justify-center border-2 border-hot-pink text-hot-pink transition hover:bg-hot-pink hover:text-white" type="button" onClick={() => handleDelete({ ...service, groupId: group.id })} aria-label={`Hapus ${service.name}`}><FaTrash aria-hidden="true" /></button></div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      {isEditorOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-deep-navy/70 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="service-editor-title">
          <section className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto border-2 border-deep-navy bg-white p-4 text-deep-navy shadow-2xl sm:max-h-[92vh] sm:p-7">
            <button className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center text-lg text-deep-navy/60 transition hover:text-hot-pink" type="button" onClick={() => setIsEditorOpen(false)} aria-label="Tutup editor layanan" disabled={isSaving}><FaXmark aria-hidden="true" /></button>
            <div className="border-b-2 border-deep-navy/10 pb-5 pr-12"><p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Editor layanan</p><h2 id="service-editor-title" className="mt-2 text-xl font-black sm:text-2xl">{form.originalName ? "Edit layanan" : "Tambah layanan"}</h2><p className="mt-2 text-sm leading-6 text-slate-600">Atur informasi layanan yang tampil di kartu website.</p></div>
            {error ? <p className="mt-5 border-l-4 border-hot-pink bg-hot-pink/10 px-4 py-3 text-sm font-bold text-deep-navy" role="alert">{error}</p> : null}
            <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-bold">Kategori<select className={inputClassName} value={form.groupId} onChange={(event) => updateForm("groupId", event.target.value)}>{groups.map((group) => <option key={group.id} value={group.id}>{group.category}</option>)}</select></label>
              <label className="grid gap-2 text-sm font-bold">Nama layanan<input className={inputClassName} required value={form.name} onChange={(event) => updateForm("name", event.target.value)} /></label>
              <div className="grid gap-5 sm:grid-cols-3"><label className="grid gap-2 text-sm font-bold">Harga normal<input className={inputClassName} value={form.originalPrice} onChange={(event) => updateForm("originalPrice", event.target.value)} placeholder="Opsional" /></label><label className="grid gap-2 text-sm font-bold">Harga tampil<input className={inputClassName} required value={form.price} onChange={(event) => updateForm("price", event.target.value)} placeholder="Rp 1.500.000" /></label><label className="grid gap-2 text-sm font-bold">Durasi<input className={inputClassName} value={form.duration} onChange={(event) => updateForm("duration", event.target.value)} placeholder="1 bulan" /></label></div>
              <label className="grid gap-2 text-sm font-bold">Deskripsi<textarea className={`${inputClassName} min-h-28 resize-y leading-6`} required value={form.description} onChange={(event) => updateForm("description", event.target.value)} /></label>
              <label className="grid gap-2 text-sm font-bold">Benefit checklist<textarea className={`${inputClassName} min-h-28 resize-y leading-6`} value={form.benefits} onChange={(event) => updateForm("benefits", event.target.value)} placeholder="Satu benefit per baris" /></label>
              <label className="flex items-center gap-3 text-sm font-bold"><input checked={form.isRecommended} className="h-4 w-4 accent-[var(--brand-deep-navy)]" type="checkbox" onChange={(event) => updateForm("isRecommended", event.target.checked)} /> Tampilkan sebagai paket rekomendasi</label>
              <label className="flex items-center gap-3 text-sm font-bold"><input checked={form.flashSale} className="h-4 w-4 accent-[var(--brand-deep-navy)]" type="checkbox" onChange={(event) => updateForm("flashSale", event.target.checked)} /> Aktifkan Flash Sale</label>
              {form.flashSale ? <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-bold">Diskon (%)<input className={inputClassName} min="0" max="100" type="number" value={form.discount} onChange={(event) => updateForm("discount", Number(event.target.value))} /></label><label className="grid gap-2 text-sm font-bold">Berakhir pada<input className={inputClassName} type="datetime-local" value={form.flashSaleEndsAt ? form.flashSaleEndsAt.slice(0, 16) : ""} onChange={(event) => updateForm("flashSaleEndsAt", event.target.value ? `${event.target.value}:00+07:00` : "")} /></label></div> : null}
              <label className="flex items-center gap-3 text-sm font-bold"><input checked={isPublished} className="h-4 w-4 accent-[var(--brand-deep-navy)]" type="checkbox" onChange={(event) => setIsPublished(event.target.checked)} /> Tampilkan perubahan di website</label>
              <div className="flex flex-wrap gap-3"><button className="border-2 border-deep-navy bg-orange px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-deep-navy shadow-[3px_3px_0_var(--brand-hot-pink)] transition hover:bg-white disabled:opacity-60" disabled={isSaving} type="submit">{isSaving ? "Menyimpan..." : "Simpan layanan"}</button><button className="border-2 border-deep-navy/20 px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-slate-600 transition hover:border-deep-navy" type="button" onClick={() => setIsEditorOpen(false)} disabled={isSaving}>Batal</button></div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
