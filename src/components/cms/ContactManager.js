"use client";

import { useEffect, useState } from "react";
import { FaInstagram, FaLinkedinIn, FaTiktok, FaWhatsapp } from "react-icons/fa6";

const fields = [
  { key: "instagram", label: "Instagram", icon: FaInstagram, placeholder: "https://www.instagram.com/..." },
  { key: "linkedin", label: "LinkedIn", icon: FaLinkedinIn, placeholder: "https://www.linkedin.com/..." },
  { key: "tiktok", label: "TikTok", icon: FaTiktok, placeholder: "https://www.tiktok.com/..." },
  { key: "whatsapp", label: "WhatsApp", icon: FaWhatsapp, placeholder: "https://wa.me/..." },
];

export default function ContactManager() {
  const [content, setContent] = useState(null); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  useEffect(() => { fetch("/api/cms/content", { cache: "no-store" }).then((response) => response.json()).then((result) => { const footer = result.content?.find((item) => item.contentKey === "footer"); if (!footer) throw new Error("Kontak belum tersedia."); setContent(footer); }).catch((loadError) => setError(loadError.message || "Kontak tidak dapat dimuat.")).finally(() => setLoading(false)); }, []);
  function update(key, value) { setContent((item) => ({ ...item, value: { ...item.value, socialLinks: { ...item.value.socialLinks, [key]: value } } })); }
  async function save(event) { event.preventDefault(); setSaving(true); setMessage(""); setError(""); try { const response = await fetch("/api/cms/content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: content.id, value: content.value, isPublished: content.isPublished }) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); setContent(result.content); setMessage("Kontak berhasil disimpan."); } catch (saveError) { setError(saveError.message || "Kontak gagal disimpan."); } finally { setSaving(false); } }
  if (loading) return <p className="text-sm text-slate-500">Memuat kontak...</p>;
  if (!content) return <p className="text-sm font-bold text-hot-pink">{error}</p>;
  return <form className="max-w-2xl rounded-xl border border-deep-navy/10 bg-white p-4 shadow-[0_12px_28px_rgb(23_36_61_/_8%)] sm:p-6" onSubmit={save}><div className="grid gap-4">{fields.map(({ key, label, icon: Icon, placeholder }) => <label className="grid gap-2 text-sm font-bold" key={key}><span className="flex items-center gap-2"><Icon className="text-brand-blue" /> {label}</span><input className="w-full rounded-lg border border-deep-navy/15 bg-brand-surface px-3 py-2.5 text-sm font-normal outline-none transition focus:border-brand-blue focus:bg-white" placeholder={placeholder} type="url" value={content.value.socialLinks?.[key] || ""} onChange={(event) => update(key, event.target.value)} /></label>)}</div>{message ? <p className="mt-4 text-sm font-bold text-emerald-700">{message}</p> : null}{error ? <p className="mt-4 text-sm font-bold text-hot-pink">{error}</p> : null}<div className="mt-6 flex justify-end"><button className="rounded-lg border border-deep-navy bg-orange px-4 py-2.5 text-sm font-black" disabled={saving} type="submit">{saving ? "Menyimpan..." : "Simpan kontak"}</button></div></form>;
}