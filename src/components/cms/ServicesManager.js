"use client";

import { useEffect, useState } from "react";
import { FaChartLine, FaFileLines, FaGlobe, FaPen, FaPhone, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";

const emptyService = {
  originalId: "",
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

const emptyCategory = {
  id: "",
  category: "",
  icon: "chart",
};

const categoryIconOptions = [
  { value: "chart", label: "Grafik", icon: FaChartLine },
  { value: "file", label: "Dokumen", icon: FaFileLines },
  { value: "globe", label: "Website", icon: FaGlobe },
  { value: "phone", label: "Kontak", icon: FaPhone },
];

const inputClassName = "w-full rounded-xl border border-deep-navy/15 bg-brand-surface px-4 py-3 text-sm text-deep-navy outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:bg-white";

function flattenServices(groups) {
  return groups.flatMap((group) => group.services.map((service) => ({ ...service, groupId: group.id, category: group.category })));
}

function calculateDiscount(originalPrice, salePrice) {
  const originalAmount = Number(String(originalPrice).replace(/[^0-9]/g, ""));
  const saleAmount = Number(String(salePrice).replace(/[^0-9]/g, ""));
  if (!originalAmount || !saleAmount || saleAmount >= originalAmount) return 0;
  return Math.round(((originalAmount - saleAmount) / originalAmount) * 100);
}

function priceInputValue(value) {
  return String(value || "").replace(/[^0-9]/g, "");
}

function formatPrice(value) {
  const amount = Number(priceInputValue(value));
  return Number.isSafeInteger(amount) && amount > 0 ? `Rp ${amount.toLocaleString("id-ID")}` : "";
}

export default function ServicesManager() {
  const [groups, setGroups] = useState([]);
  const [form, setForm] = useState(emptyService);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCategoryEditorOpen, setIsCategoryEditorOpen] = useState(false);
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

  function openNewCategory() {
    setCategoryForm(emptyCategory);
    setMessage("");
    setError("");
    setIsCategoryEditorOpen(true);
  }

  function openEditCategory(group) {
    setCategoryForm({ id: group.id, category: group.category, icon: group.icon || "chart" });
    setMessage("");
    setError("");
    setIsCategoryEditorOpen(true);
  }

  function openEditService(service) {
    setForm({
      groupId: service.groupId,
      originalGroupId: service.groupId,
      originalId: service.id || "",
      originalName: service.name,
      name: service.name,
      originalPrice: priceInputValue(service.originalPrice || service.price),
      price: priceInputValue(service.price),
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
    const calculatedDiscount = form.flashSale ? calculateDiscount(form.originalPrice, form.price) : 0;
    const service = {
      ...(form.originalId ? { id: form.originalId } : {}),
      name: form.name.trim(),
      originalPrice: form.flashSale ? formatPrice(form.originalPrice) : "",
      price: formatPrice(form.flashSale ? form.price : form.originalPrice),
      duration: form.duration.trim(),
      description: form.description.trim(),
      benefits: form.benefits.split("\n").map((benefit) => benefit.trim()).filter(Boolean),
      isRecommended: form.isRecommended,
      flashSale: form.flashSale,
      discount: calculatedDiscount,
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

  function buildCategoryId(categoryName) {
    const slug = categoryName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `category-${slug || "layanan"}-${Date.now()}`;
  }

  async function handleCategorySubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");
    try {
      const categoryName = categoryForm.category.trim();
      const nextGroups = categoryForm.id
        ? groups.map((group) => group.id === categoryForm.id ? { ...group, category: categoryName, icon: categoryForm.icon.trim() || "chart" } : group)
        : [...groups, { id: buildCategoryId(categoryName), category: categoryName, icon: categoryForm.icon.trim() || "chart", services: [] }];
      await saveGroups(nextGroups);
      setMessage(categoryForm.id ? "Kategori berhasil diperbarui." : "Kategori berhasil ditambahkan.");
      setIsCategoryEditorOpen(false);
    } catch (categoryError) {
      setError(categoryError.message || "Gagal menyimpan kategori layanan.");
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

  async function handleDeleteCategory(group) {
    if (group.services.length > 0) {
      setError("Kategori yang masih memiliki paket tidak dapat dihapus. Hapus atau pindahkan paket terlebih dahulu.");
      return;
    }
    if (!window.confirm(`Hapus kategori ${group.category}?`)) return;
    setError("");
    try {
      await saveGroups(groups.filter((item) => item.id !== group.id));
      setMessage("Kategori berhasil dihapus.");
    } catch (categoryError) {
      setError(categoryError.message || "Gagal menghapus kategori layanan.");
    }
  }

  const services = flattenServices(groups);

  return (
    <div className="min-w-0">
      <section className="min-w-0 overflow-hidden rounded-2xl border border-deep-navy/10 bg-white p-4 shadow-[0_12px_28px_rgb(23_36_61_/_8%)] sm:p-6" aria-labelledby="services-list-title">
        <div className="flex flex-col items-start justify-between gap-4 border-b-2 border-deep-navy/10 pb-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Penjualan</p>
            <h2 id="services-list-title" className="mt-2 text-xl font-black sm:text-2xl">Paket yang dijual</h2>
            <p className="mt-2 text-sm text-slate-600">{services.length} paket dalam {groups.length} kelompok layanan.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-full border border-deep-navy bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-deep-navy shadow-[0_8px_18px_rgb(23_36_61_/_8%)] transition hover:bg-orange" type="button" onClick={openNewCategory}>
              <FaPlus aria-hidden="true" /> Tambah kategori
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-deep-navy bg-orange px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-deep-navy shadow-[0_8px_18px_rgb(23_36_61_/_12%)] transition hover:bg-white" type="button" onClick={openNewService} disabled={groups.length === 0}>
              <FaPlus aria-hidden="true" /> Tambah paket
            </button>
          </div>
        </div>

        {message ? <p className="mt-5 border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800" role="status">{message}</p> : null}
        {error && !isEditorOpen ? <p className="mt-5 border-l-4 border-hot-pink bg-hot-pink/10 px-4 py-3 text-sm font-bold text-deep-navy" role="alert">{error}</p> : null}
        {isLoading ? <p className="py-8 text-sm text-slate-500">Memuat layanan...</p> : null}
        {!isLoading && groups.length === 0 ? <p className="py-8 text-sm text-slate-500">Belum ada kategori layanan.</p> : null}

        <div className="mt-5 grid gap-6">
          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`service-group-${group.id}`}>
              <div className="flex items-center justify-between gap-4 border-b border-deep-navy/10 pb-2">
                <div className="min-w-0">
                  <h3 id={`service-group-${group.id}`} className="text-lg font-black">{group.category}</h3>
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">{group.services.length} item</span>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button className="flex h-9 w-9 items-center justify-center rounded-full border border-deep-navy/20 text-deep-navy transition hover:border-orange hover:bg-orange" type="button" onClick={() => openEditCategory(group)} aria-label={`Ubah kategori ${group.category}`} title="Ubah kategori"><FaPen aria-hidden="true" /></button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full border border-hot-pink/50 text-hot-pink transition hover:bg-hot-pink hover:text-white disabled:cursor-not-allowed disabled:opacity-40" type="button" onClick={() => handleDeleteCategory(group)} aria-label={`Hapus kategori ${group.category}`} title={group.services.length > 0 ? "Hapus paket dalam kategori terlebih dahulu" : "Hapus kategori"} disabled={group.services.length > 0}><FaTrash aria-hidden="true" /></button>
                </div>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {group.services.map((service) => (
                  <article className="min-w-0 rounded-xl border border-deep-navy/10 bg-slate-50 p-4" key={service.name}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="line-clamp-2 font-black text-deep-navy">{service.name}</h4>
                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">{service.description}</p>
                      </div>
                      {service.flashSale ? <span className="shrink-0 rounded-full border border-hot-pink bg-hot-pink/10 px-2 py-1 text-[10px] font-black uppercase text-hot-pink">-{service.discount}%</span> : null}
                    </div>
                    <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-deep-navy/10 pt-3">
                      <div><p className="text-xs text-slate-500">{service.duration}</p>{service.flashSale && service.originalPrice ? <p className="text-xs text-slate-500 line-through">{service.originalPrice}</p> : null}<p className="font-black text-orange">{service.price}</p></div>
                      <div className="flex gap-2"><button className="rounded-full border border-deep-navy bg-white px-3 py-2 text-xs font-black uppercase text-deep-navy transition hover:bg-orange" type="button" onClick={() => openEditService({ ...service, groupId: group.id, originalName: service.name })}>Ubah</button><button className="flex h-9 w-9 items-center justify-center rounded-full border border-hot-pink text-hot-pink transition hover:bg-hot-pink hover:text-white" type="button" onClick={() => handleDelete({ ...service, groupId: group.id })} aria-label={`Hapus ${service.name}`}><FaTrash aria-hidden="true" /></button></div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      {isCategoryEditorOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-deep-navy/70 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="category-editor-title">
          <section className="relative w-full max-w-lg rounded-2xl border border-deep-navy/10 bg-white p-4 text-deep-navy shadow-2xl sm:p-7">
            <button className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center text-lg text-deep-navy/60 transition hover:text-hot-pink" type="button" onClick={() => setIsCategoryEditorOpen(false)} aria-label="Tutup editor kategori" disabled={isSaving}><FaXmark aria-hidden="true" /></button>
            <div className="border-b-2 border-deep-navy/10 pb-5 pr-12"><p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Struktur layanan</p><h2 id="category-editor-title" className="mt-2 text-xl font-black sm:text-2xl">{categoryForm.id ? "Ubah kategori" : "Tambah kategori"}</h2><p className="mt-2 text-sm leading-6 text-slate-600">Kategori membantu calon pelanggan menemukan paket berdasarkan kebutuhan mereka.</p></div>
            <form className="mt-6 grid gap-5" onSubmit={handleCategorySubmit}>
              <label className="grid gap-2 text-sm font-bold">Nama kategori<input className={inputClassName} required maxLength={100} value={categoryForm.category} onChange={(event) => setCategoryForm((current) => ({ ...current, category: event.target.value }))} placeholder="Contoh: Paket Social Media" /></label>
              <fieldset className="grid gap-2 text-sm font-bold"><legend>Icon kategori</legend><div className="grid grid-cols-4 gap-2">{categoryIconOptions.map((option) => { const CategoryIcon = option.icon; const isSelected = categoryForm.icon === option.value; return <button aria-label={option.label} className={`flex h-14 items-center justify-center rounded-xl border text-xl transition ${isSelected ? "border-brand-blue bg-brand-blue text-white shadow-[0_6px_14px_rgb(23_36_61_/_16%)]" : "border-deep-navy/15 bg-brand-surface text-deep-navy/60 hover:border-brand-blue hover:bg-white"}`} key={option.value} title={option.label} type="button" aria-pressed={isSelected} onClick={() => setCategoryForm((current) => ({ ...current, icon: option.value }))}><CategoryIcon aria-hidden="true" /></button>; })}</div></fieldset>
              <div className="flex flex-wrap gap-3"><button className="rounded-full border border-deep-navy bg-orange px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-deep-navy shadow-[0_8px_18px_rgb(23_36_61_/_12%)] transition hover:bg-white disabled:opacity-60" disabled={isSaving} type="submit">{isSaving ? "Menyimpan..." : "Simpan kategori"}</button><button className="rounded-full border border-deep-navy/20 px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-slate-600 transition hover:border-deep-navy" type="button" onClick={() => setIsCategoryEditorOpen(false)} disabled={isSaving}>Batal</button></div>
            </form>
          </section>
        </div>
      ) : null}

      {isEditorOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-deep-navy/70 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="service-editor-title">
          <section className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-deep-navy/10 bg-white p-4 text-deep-navy shadow-2xl sm:max-h-[92vh] sm:p-7">
            <button className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center text-lg text-deep-navy/60 transition hover:text-hot-pink" type="button" onClick={() => setIsEditorOpen(false)} aria-label="Tutup editor layanan" disabled={isSaving}><FaXmark aria-hidden="true" /></button>
            <div className="border-b-2 border-deep-navy/10 pb-5 pr-12"><p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Paket layanan</p><h2 id="service-editor-title" className="mt-2 text-xl font-black sm:text-2xl">{form.originalName ? "Ubah paket" : "Tambah paket"}</h2><p className="mt-2 text-sm leading-6 text-slate-600">Isi informasi yang akan dilihat calon pelanggan di website.</p></div>
            {error ? <p className="mt-5 border-l-4 border-hot-pink bg-hot-pink/10 px-4 py-3 text-sm font-bold text-deep-navy" role="alert">{error}</p> : null}
            <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-bold">Kelompok layanan<select className={inputClassName} value={form.groupId} onChange={(event) => updateForm("groupId", event.target.value)}>{groups.map((group) => <option key={group.id} value={group.id}>{group.category}</option>)}</select></label>
              <label className="grid gap-2 text-sm font-bold">Nama layanan<input className={inputClassName} required value={form.name} onChange={(event) => updateForm("name", event.target.value)} /></label>
              <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-bold">Harga awal<input className={inputClassName} required type="text" inputMode="numeric" pattern="[0-9]+" value={form.originalPrice} onChange={(event) => updateForm("originalPrice", priceInputValue(event.target.value))} placeholder="1500000" /><span className="text-xs font-normal leading-5 text-slate-500">Tulis angka saja. Contoh: 1500000.</span></label><label className="grid gap-2 text-sm font-bold">Lama pengerjaan<input className={inputClassName} value={form.duration} onChange={(event) => updateForm("duration", event.target.value)} placeholder="1 bulan" /></label></div>
              <label className="grid gap-2 text-sm font-bold">Ringkasan paket<textarea className={`${inputClassName} min-h-28 resize-y leading-6`} required value={form.description} onChange={(event) => updateForm("description", event.target.value)} placeholder="Jelaskan secara singkat paket ini." /></label>
              <label className="grid gap-2 text-sm font-bold">Isi paket<textarea className={`${inputClassName} min-h-28 resize-y leading-6`} value={form.benefits} onChange={(event) => updateForm("benefits", event.target.value)} placeholder="Tulis satu layanan atau hasil per baris" /></label>
              <label className="flex items-center gap-3 text-sm font-bold"><input checked={form.isRecommended} className="h-4 w-4 accent-[var(--brand-deep-navy)]" type="checkbox" onChange={(event) => updateForm("isRecommended", event.target.checked)} /> Tandai sebagai paket rekomendasi</label>
              <label className="flex items-center gap-3 text-sm font-bold"><input checked={form.flashSale} className="h-4 w-4 accent-[var(--brand-deep-navy)]" type="checkbox" onChange={(event) => updateForm("flashSale", event.target.checked)} /> Tandai sebagai Limited Project Slots</label>
              {form.flashSale ? <div className="rounded-xl border border-hot-pink/30 bg-hot-pink/5 p-4"><p className="text-sm font-black text-deep-navy">Pengaturan Limited Project Slots</p><p className="mt-1 text-xs leading-5 text-slate-600">Harga awal akan dicoret dan harga slot proyek terbaru akan ditampilkan kepada pelanggan.</p><div className="mt-4 grid gap-5 sm:grid-cols-3"><label className="grid gap-2 text-sm font-bold sm:col-span-1">Harga slot terbaru<input className={inputClassName} required type="text" inputMode="numeric" pattern="[0-9]+" value={form.price} onChange={(event) => updateForm("price", priceInputValue(event.target.value))} placeholder="999000" /></label><label className="grid gap-2 text-sm font-bold">Diskon otomatis (%)<input className={`${inputClassName} bg-slate-100 text-slate-600`} readOnly value={calculateDiscount(form.originalPrice, form.price)} aria-label="Persentase diskon otomatis" /></label><label className="grid gap-2 text-sm font-bold">Slot berakhir pada<input className={inputClassName} type="datetime-local" value={form.flashSaleEndsAt ? form.flashSaleEndsAt.slice(0, 16) : ""} onChange={(event) => updateForm("flashSaleEndsAt", event.target.value ? `${event.target.value}:00+07:00` : "")} /></label></div><p className="mt-3 text-xs leading-5 text-slate-500">Tulis angka saja. Titik dan simbol rupiah akan diabaikan. Persentase dihitung otomatis dari harga sebelum slot dan harga slot terbaru.</p></div> : null}
              <label className="flex items-center gap-3 text-sm font-bold"><input checked={isPublished} className="h-4 w-4 accent-[var(--brand-deep-navy)]" type="checkbox" onChange={(event) => setIsPublished(event.target.checked)} /> Tampilkan paket di website</label>
              <div className="flex flex-wrap gap-3"><button className="rounded-full border border-deep-navy bg-orange px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-deep-navy shadow-[0_8px_18px_rgb(23_36_61_/_12%)] transition hover:bg-white disabled:opacity-60" disabled={isSaving} type="submit">{isSaving ? "Menyimpan..." : "Simpan paket"}</button><button className="rounded-full border border-deep-navy/20 px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-slate-600 transition hover:border-deep-navy" type="button" onClick={() => setIsEditorOpen(false)} disabled={isSaving}>Batal</button></div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
