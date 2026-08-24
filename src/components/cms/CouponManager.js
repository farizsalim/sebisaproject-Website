"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";

const emptyCoupon = { code: "", type: "PERCENTAGE", value: 10, minAmount: 0, maxUses: "", isActive: true, startsAt: "", expiresAt: "" };
const inputClassName = "w-full rounded-xl border border-deep-navy/15 bg-brand-surface px-4 py-3 text-sm text-deep-navy outline-none focus:border-brand-blue focus:bg-white";

function toInputDate(value) {
  return value ? value.slice(0, 16) : "";
}

export default function CouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(emptyCoupon);
  const [editingId, setEditingId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadCoupons() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cms/coupons", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal memuat kupon.");
      setCoupons(result.coupons || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadCoupons(); }, []);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(emptyCoupon);
    setEditingId("");
  }

  function editCoupon(coupon) {
    setEditingId(coupon.id);
    setForm({ ...coupon, maxUses: coupon.maxUses ?? "", startsAt: toInputDate(coupon.startsAt), expiresAt: toInputDate(coupon.expiresAt) });
    setMessage("");
    setError("");
  }

  async function saveCoupon(event) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");
    const payload = {
      ...form,
      code: form.code.toUpperCase(),
      value: Number(form.value),
      minAmount: Number(form.minAmount),
      maxUses: form.maxUses === "" ? null : Number(form.maxUses),
      startsAt: form.startsAt ? `${form.startsAt}:00+07:00` : null,
      expiresAt: form.expiresAt ? `${form.expiresAt}:00+07:00` : null,
    };
    try {
      const response = await fetch("/api/cms/coupons", { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal menyimpan kupon.");
      setMessage("Kupon berhasil disimpan.");
      resetForm();
      await loadCoupons();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function deactivateCoupon(coupon) {
    if (!window.confirm(`Nonaktifkan kupon ${coupon.code}?`)) return;
    const response = await fetch("/api/cms/coupons", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: coupon.id }) });
    if (response.ok) { setMessage("Kupon dinonaktifkan."); await loadCoupons(); }
    else { const result = await response.json(); setError(result.error || "Gagal menonaktifkan kupon."); }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <section className="rounded-2xl border border-deep-navy/10 bg-white p-5 shadow-[0_12px_28px_rgb(23_36_61_/_8%)] sm:p-7">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Penjualan</p>
        <h1 className="mt-2 text-2xl font-black">Kode promo</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Buat potongan harga yang bisa dipakai pelanggan saat membeli paket.</p>
        {message ? <p className="mt-5 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">{message}</p> : null}
        {error ? <p className="mt-5 bg-hot-pink/10 px-4 py-3 text-sm font-bold text-deep-navy">{error}</p> : null}
        {isLoading ? <p className="mt-8 text-sm text-slate-500">Memuat kupon...</p> : null}
        <div className="mt-6 grid gap-3">
          {coupons.map((coupon) => <article className="flex flex-col justify-between gap-4 rounded-xl border border-deep-navy/10 bg-slate-50 p-4 sm:flex-row sm:items-center" key={coupon.id}>
            <div><p className="font-black tracking-wide">{coupon.code} <span className={`ml-2 text-xs ${coupon.isActive ? "text-emerald-700" : "text-slate-400"}`}>{coupon.isActive ? "Aktif" : "Nonaktif"}</span></p><p className="mt-1 text-sm text-slate-600">{coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `Rp ${coupon.value.toLocaleString("id-ID")}`} · digunakan {coupon.usedCount}{coupon.maxUses ? `/${coupon.maxUses}` : ""}</p></div>
            <div className="flex gap-2"><button className="rounded-full border border-deep-navy px-3 py-2 text-xs font-black hover:bg-orange" type="button" onClick={() => editCoupon(coupon)}>Edit</button>{coupon.isActive ? <button className="flex h-9 w-9 items-center justify-center rounded-full border border-hot-pink text-hot-pink hover:bg-hot-pink hover:text-white" type="button" aria-label={`Nonaktifkan ${coupon.code}`} onClick={() => deactivateCoupon(coupon)}><FaTrash aria-hidden="true" /></button> : null}</div>
          </article>)}
          {!isLoading && coupons.length === 0 ? <p className="py-8 text-sm text-slate-500">Belum ada kupon.</p> : null}
        </div>
      </section>
      <section className="rounded-2xl border border-deep-navy/10 bg-white p-5 shadow-[0_12px_28px_rgb(23_36_61_/_8%)] sm:p-7">
        <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-black">{editingId ? "Ubah kode promo" : "Buat kode promo"}</h2>{editingId ? <button className="text-xs font-bold underline" type="button" onClick={resetForm}>Batal edit</button> : null}</div>
        <form className="mt-5 grid gap-4" onSubmit={saveCoupon}>
          <label className="grid gap-2 text-sm font-bold">Kode promo<input className={inputClassName} required maxLength={40} value={form.code} onChange={(event) => updateForm("code", event.target.value.toUpperCase())} placeholder="SEBISA10" /></label>
          <div className="grid grid-cols-2 gap-3"><label className="grid gap-2 text-sm font-bold">Jenis potongan<select className={inputClassName} value={form.type} onChange={(event) => updateForm("type", event.target.value)}><option value="PERCENTAGE">Persen (%)</option><option value="FIXED">Nominal rupiah</option></select></label><label className="grid gap-2 text-sm font-bold">Besar diskon<input className={inputClassName} required min="1" type="number" value={form.value} onChange={(event) => updateForm("value", event.target.value)} /></label></div>
          <label className="grid gap-2 text-sm font-bold">Minimal belanja<input className={inputClassName} min="0" type="number" value={form.minAmount} onChange={(event) => updateForm("minAmount", event.target.value)} placeholder="0 = semua pembelian" /></label>
          <label className="grid gap-2 text-sm font-bold">Maksimal digunakan<input className={inputClassName} min="1" type="number" value={form.maxUses} onChange={(event) => updateForm("maxUses", event.target.value)} placeholder="Kosong = tidak dibatasi" /></label>
          <div className="grid gap-3"><label className="grid gap-2 text-sm font-bold">Mulai berlaku<input className={inputClassName} type="datetime-local" value={form.startsAt} onChange={(event) => updateForm("startsAt", event.target.value)} /></label><label className="grid gap-2 text-sm font-bold">Berakhir pada<input className={inputClassName} type="datetime-local" value={form.expiresAt} onChange={(event) => updateForm("expiresAt", event.target.value)} /></label></div>
          <label className="flex items-center gap-3 text-sm font-bold"><input checked={form.isActive} type="checkbox" onChange={(event) => updateForm("isActive", event.target.checked)} /> Aktifkan kode promo</label>
          <button className="inline-flex items-center justify-center gap-2 rounded-full border border-deep-navy bg-orange px-5 py-3 text-sm font-black disabled:opacity-60" disabled={isSaving} type="submit"><FaPlus aria-hidden="true" />{isSaving ? "Menyimpan..." : editingId ? "Simpan perubahan" : "Buat kode promo"}</button>
        </form>
      </section>
    </div>
  );
}
