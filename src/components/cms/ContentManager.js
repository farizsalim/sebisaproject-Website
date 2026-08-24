"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const sectionLabels = {
  about: "Tentang Kami",
  clients: "Mitra",
  consultationQuiz: "Kuis Konsultasi",
  faq: "Pertanyaan Umum",
  finalCta: "CTA Penutup",
  footer: "Footer",
  hero: "Halaman utama",
  highlight: "Highlight kuning",
  navbar: "Navigasi website",
};

const sectionOrder = ["navbar", "hero", "consultationQuiz", "clients", "about", "faq", "finalCta", "footer"];

const fieldLabels = {
  answer: "Jawaban",
  button: "Teks tombol",
  contactTitle: "Judul kontak",
  description: "Deskripsi",
  eyebrow: "Label kecil",
  expandedParagraphs: "Paragraf lanjutan",
  headingSegments: "Judul utama",
  highlight: "Sorot kata ini",
  intro: "Pengantar",
  navigationLinks: "Link navigasi",
  navigationTitle: "Judul navigasi",
  paragraphs: "Paragraf",
  primaryCta: "Tombol utama",
  question: "Pertanyaan",
  readLess: "Teks saat terbuka",
  readMore: "Teks baca selengkapnya",
  secondaryCta: "Tombol kedua",
  spaceAfter: "Beri spasi setelah teks",
  slotCta: "Tombol slot",
  socialLinks: "Link sosial media",
  tagline: "Kalimat penutup",
  text: "Teks",
  tickerItems: "Teks berjalan",
  title: "Judul",
  titleAfterHighlight: "Teks setelah highlight",
  titleBeforeHighlight: "Teks sebelum highlight",
  titleHighlight: "Teks highlight",
  value: "Isi",
  items: "Daftar pertanyaan",
};

const inputClassName = "w-full rounded-xl border border-deep-navy/15 bg-brand-surface px-4 py-3 text-sm text-deep-navy outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:bg-white";

function humanizeKey(key) {
  return fieldLabels[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function updateAtPath(value, path, nextValue) {
  if (path.length === 0) return nextValue;
  const [currentKey, ...rest] = path;
  const copy = Array.isArray(value) ? [...value] : { ...value };
  copy[currentKey] = updateAtPath(copy[currentKey], rest, nextValue);
  return copy;
}

function sortSections(items) {
  return [...items].sort((first, second) => {
    const firstIndex = sectionOrder.indexOf(first.contentKey);
    const secondIndex = sectionOrder.indexOf(second.contentKey);
    return (firstIndex === -1 ? sectionOrder.length : firstIndex) - (secondIndex === -1 ? sectionOrder.length : secondIndex);
  });
}

function normalizeContentValue(contentKey, value) {
  if (contentKey !== "hero" || !Array.isArray(value?.headingSegments)) return value;

  return {
    ...value,
    headingSegments: value.headingSegments.map((segment, index) => ({
      ...segment,
      highlight: segment.highlight ?? index === 1,
    })),
  };
}

function TextField({ label, value, onChange, multiline = false }) {

  const commonProps = {
    className: inputClassName,
    onChange: (event) => onChange(event.target.value),
    value: value ?? "",
  };

  return (
    <label className="grid min-w-0 gap-2 text-sm font-bold text-deep-navy">
      {label ? <span>{label}</span> : null}
      {multiline ? <textarea {...commonProps} className={`${inputClassName} min-h-28 resize-y leading-6`} /> : <input {...commonProps} type="text" />}
    </label>
  );
}

function ValueEditor({ label, value, path, onChange }) {
  if (typeof value === "string") {
    const multiline = value.length > 90 || ["description", "answer", "intro", "tagline"].includes(path[path.length - 1]);
    return <TextField label={label} multiline={multiline} value={value} onChange={(nextValue) => onChange(path, nextValue)} />;
  }

  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-3 text-sm font-bold text-deep-navy">
        <input checked={value} className="h-4 w-4 accent-[var(--brand-deep-navy)]" onChange={(event) => onChange(path, event.target.checked)} type="checkbox" />
        {label}
      </label>
    );
  }

  if (typeof value === "number") {
    return <TextField label={label} value={String(value)} onChange={(nextValue) => onChange(path, Number(nextValue))} />;
  }

  if (Array.isArray(value)) {
    return (
      <fieldset className="min-w-0 border-l-2 border-brand-blue/40 pl-4">
        {label ? <legend className="mb-3 px-1 text-sm font-black text-deep-navy">{label}</legend> : null}
        <div className="grid min-w-0 gap-3">
          {value.map((item, index) => (
            <div className="min-w-0 rounded-xl border border-deep-navy/10 bg-slate-50 p-3 sm:p-4" key={`${path.join("-")}-${index}`}>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-brand-blue">{label || "Item"} {index + 1}</p>
              <ValueEditor label="" value={item} path={[...path, index]} onChange={onChange} />
            </div>
          ))}
        </div>
      </fieldset>
    );
  }

  if (value && typeof value === "object") {
    return (
      <fieldset className={`min-w-0 ${path.length > 0 ? "border-l-2 border-orange/60 pl-4" : ""}`}>
        {path.length > 0 && label ? <legend className="mb-3 px-1 text-sm font-black text-deep-navy">{label}</legend> : null}
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          {Object.entries(value).map(([key, childValue]) => (
            <div className={Array.isArray(childValue) || (childValue && typeof childValue === "object") ? "md:col-span-2" : ""} key={[...path, key].join("-")}>
              <ValueEditor label={humanizeKey(key)} value={childValue} path={[...path, key]} onChange={onChange} />
            </div>
          ))}
        </div>
      </fieldset>
    );
  }

  return null;
}

export default function ContentManager() {
  const searchParams = useSearchParams();
  const requestedSection = searchParams.get("section");
  const [content, setContent] = useState([]);
  const [selected, setSelected] = useState(null);
  const [draftValue, setDraftValue] = useState(null);
  const [isPublished, setIsPublished] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadContent() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cms/content", { cache: "no-store" });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.error || "Gagal mengambil konten.");
      } else {
        setContent(sortSections(result.content || []));
        setError("");
      }
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    if (content.length === 0) return;
    const requestedContent = requestedSection
      ? content.find((item) => item.contentKey === requestedSection)
      : content[0];
    if (requestedContent && selected?.id !== requestedContent.id) selectContent(requestedContent);
  }, [requestedSection, content, selected?.id]);

  function selectContent(item) {
    const normalizedItem = {
      ...item,
      value: normalizeContentValue(item.contentKey, item.value),
    };
    setSelected(normalizedItem);
    setDraftValue(normalizedItem.value);
    setIsPublished(item.isPublished);
    setMessage("");
    setError("");
  }

  function handleValueChange(path, nextValue) {
    setDraftValue((currentValue) => updateAtPath(currentValue, path, nextValue));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selected) return;

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/cms/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, value: draftValue, isPublished }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.error || "Gagal menyimpan konten.");
        return;
      }

      setContent((items) => sortSections(items.map((item) => item.id === result.content.id ? result.content : item)));
      selectContent(result.content);
      setMessage("Perubahan berhasil disimpan.");
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-deep-navy/10 bg-white p-4 shadow-[0_12px_28px_rgb(23_36_61_/_8%)] sm:p-6" aria-labelledby="content-editor-title">
        {!selected ? (
          <div className="flex min-h-80 items-center justify-center text-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Editor konten</p>
              <h2 className="mt-3 text-xl font-black sm:text-2xl">{isLoading ? "Memuat konten..." : "Pilih section dari sidebar"}</h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">Pilih bagian website dari menu di sidebar untuk mulai mengubah isinya.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b-2 border-deep-navy/10 pb-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Konten website</p>
              <h2 id="content-editor-title" className="mt-2 text-xl font-black sm:text-2xl">{sectionLabels[selected.contentKey] || selected.contentKey}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Perbarui tulisan yang tampil di website. Perubahan akan terlihat setelah disimpan.</p>
            </div>

            <nav className="mt-5 rounded-xl border border-deep-navy/10 bg-brand-surface p-3" aria-label="Bagian website">
              <p className="px-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Pilih bagian yang ingin diedit</p>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {content.map((item) => {
                  const isSelected = item.contentKey === selected.contentKey;
                  return <Link className={`shrink-0 rounded-lg px-3 py-2 text-xs font-black transition ${isSelected ? "bg-deep-navy text-white" : "bg-white text-slate-600 hover:bg-orange hover:text-deep-navy"}`} href={`/cms/content?section=${item.contentKey}`} key={item.id}>{sectionLabels[item.contentKey] || item.contentKey}</Link>;
                })}
              </div>
            </nav>

            {message ? <p className="mt-5 border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800" role="status">{message}</p> : null}
            {error ? <p className="mt-5 border-l-4 border-hot-pink bg-hot-pink/10 px-4 py-3 text-sm font-bold text-deep-navy" role="alert">{error}</p> : null}

            <form className="mt-6 min-w-0 space-y-6" onSubmit={handleSubmit}>
              <ValueEditor label="" value={draftValue} path={[]} onChange={handleValueChange} />
              <label className="flex items-center gap-3 text-sm font-bold text-deep-navy">
                <input checked={isPublished} className="h-4 w-4 accent-[var(--brand-deep-navy)]" onChange={(event) => setIsPublished(event.target.checked)} type="checkbox" />
                Tampilkan perubahan di website
              </label>
              <button className="rounded-full border border-deep-navy bg-orange px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-deep-navy shadow-[0_8px_20px_rgb(23_36_61_/_14%)] transition hover:bg-white disabled:opacity-60" disabled={isSaving} type="submit">
                {isSaving ? "Menyimpan..." : "Simpan perubahan"}
              </button>
            </form>
          </>
        )}
    </section>
  );
}