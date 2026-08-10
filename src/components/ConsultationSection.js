"use client";

import { motion } from "motion/react";
import { FaArrowLeft, FaCheck, FaComments, FaLightbulb, FaListCheck, FaXmark } from "react-icons/fa6";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "6280000000000";

const consultationQuestions = [
  {
    title: "Apa yang ingin kamu kembangkan?",
    options: ["Bisnis atau UMKM", "Brand", "Personal brand", "Event atau campaign"],
  },
  {
    title: "Apa tujuan utamamu saat ini?",
    options: ["Membangun kehadiran digital", "Mendapatkan lebih banyak pelanggan", "Membuat konten promosi", "Merapikan sistem bisnis"],
  },
  {
    title: "Layanan apa yang paling kamu butuhkan?",
    options: ["Social Media Management", "Content Production", "Digital Ads", "Website atau Landing Page", "Marketplace & Merchandise"],
  },
  {
    title: "Kapan kamu ingin mulai?",
    options: ["Secepatnya", "Dalam 1-2 minggu", "Bulan ini", "Masih eksplorasi"],
  },
];

const recommendationMap = {
  "Social Media Management": ["Social Media Management", "Content Production"],
  "Content Production": ["Content Production", "Social Media Management"],
  "Digital Ads": ["Digital Ads", "Content Production"],
  "Website atau Landing Page": ["Website Development", "Landing Page"],
  "Marketplace & Merchandise": ["Marketplace & Merchandise", "Content Production"],
};

function ConsultationModal({ onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [stage, setStage] = useState("questions");
  const [contact, setContact] = useState({ name: "", whatsapp: "", business: "" });

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (stage !== "analyzing") return undefined;

    const analysisTimer = window.setTimeout(() => setStage("preview"), 1900);
    return () => window.clearTimeout(analysisTimer);
  }, [stage]);

  const chooseAnswer = (answer) => {
    const nextAnswers = [...answers];
    nextAnswers[currentQuestion] = answer;
    setAnswers(nextAnswers);
    if (currentQuestion === consultationQuestions.length - 1) {
      setStage("analyzing");
    } else {
      setCurrentQuestion((question) => question + 1);
    }
  };

  const recommendations = recommendationMap[answers[2]] || ["Website Development", "Social Media Management"];

  const submitContact = (event) => {
    event.preventDefault();
    const message = [
      "Halo Sebisa Project, saya ingin melihat rekomendasi konsultasi.",
      `Nama: ${contact.name}`,
      `Bisnis/brand: ${contact.business}`,
      `WhatsApp: ${contact.whatsapp}`,
      `Jawaban: ${answers.join(" | ")}`,
      `Rekomendasi: ${recommendations.join(", ")}`,
    ].join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    onClose();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-deep-navy/75 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="consultation-modal-title">
      <div className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto bg-brand-surface p-5 text-deep-navy shadow-2xl sm:max-h-[92vh] sm:p-9">
        <button className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center text-lg text-deep-navy/60 transition hover:text-hot-pink sm:right-4 sm:top-4" type="button" onClick={onClose} aria-label="Tutup konsultasi">
          <FaXmark aria-hidden="true" />
        </button>

        {stage === "questions" ? (
          <>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep-navy">Konsultasi singkat</p>
            <h2 id="consultation-modal-title" className="mt-3 max-w-[calc(100%-2.5rem)] text-2xl font-black leading-tight sm:max-w-lg sm:text-4xl">{consultationQuestions[currentQuestion].title}</h2>
            <div className="mt-5 h-1 bg-deep-navy/10"><div className="h-full bg-brand-blue transition-all" style={{ width: `${((currentQuestion + 1) / consultationQuestions.length) * 100}%` }} /></div>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Pertanyaan {currentQuestion + 1} dari {consultationQuestions.length}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {consultationQuestions[currentQuestion].options.map((option) => (
                <button key={option} className="min-h-14 border-2 border-deep-navy/15 bg-white px-4 py-4 text-left text-sm font-bold leading-5 transition hover:-translate-y-0.5 hover:border-brand-blue hover:bg-brand-blue-light/20 hover:shadow-[3px_3px_0_var(--brand-hot-pink)]" type="button" onClick={() => chooseAnswer(option)}>
                  {option}
                </button>
              ))}
            </div>
            {currentQuestion > 0 ? <button className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-deep-navy" type="button" onClick={() => setCurrentQuestion((question) => question - 1)}><FaArrowLeft aria-hidden="true" /> Kembali</button> : null}
          </>
        ) : null}

        {stage === "analyzing" ? (
          <div className="flex min-h-[330px] flex-col items-center justify-center text-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-brand-blue-light/35"><div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand-blue" /><span className="text-xl font-black text-brand-blue">...</span></div>
            <h2 id="consultation-modal-title" className="mt-7 text-2xl font-black sm:text-3xl">Menganalisis kebutuhanmu...</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">Sistem sedang mencocokkan jawabanmu dengan layanan yang paling relevan.</p>
          </div>
        ) : null}

        {stage === "preview" ? (
          <>
            <div className="flex items-center gap-3 text-deep-navy"><FaCheck aria-hidden="true" /><p className="text-xs font-bold uppercase tracking-[0.2em]">Analisis selesai</p></div>
            <h2 id="consultation-modal-title" className="mt-3 text-2xl font-black sm:text-4xl">Arah yang mungkin cocok untukmu</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Kami menemukan beberapa layanan yang bisa menjadi langkah awal. Detail rekomendasi akan kami jelaskan setelah data kontak terisi.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">{recommendations.map((recommendation) => <div className="border-l-4 border-orange bg-white px-4 py-4 text-sm font-bold" key={recommendation}>{recommendation}</div>)}</div>
            <button className="mt-8 w-full border-2 border-deep-navy bg-orange px-5 py-3 text-sm font-black uppercase tracking-[0.06em] text-deep-navy shadow-[3px_3px_0_var(--brand-hot-pink)] transition hover:-translate-y-0.5 hover:bg-white sm:w-auto" type="button" onClick={() => setStage("contact")}>Lihat rekomendasi lengkap</button>
          </>
        ) : null}

        {stage === "contact" ? (
          <form onSubmit={submitContact}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep-navy">Satu langkah lagi</p>
            <h2 id="consultation-modal-title" className="mt-3 text-2xl font-black sm:text-4xl">Mau lihat rekomendasi lengkap?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Isi data singkat ini. Setelah dikirim, kamu akan diarahkan ke WhatsApp dengan pesan otomatis.</p>
            <div className="mt-6 grid gap-4">
              {[['name', 'Nama lengkap', 'Masukkan nama kamu'], ['business', 'Nama bisnis atau brand', 'Contoh: Sebisa Coffee'], ['whatsapp', 'Nomor WhatsApp', 'Contoh: 08123456789']].map(([field, label, placeholder]) => <label className="grid gap-2 text-sm font-bold" key={field}>{label}<input required value={contact[field]} onChange={(event) => setContact({ ...contact, [field]: event.target.value })} className="border border-deep-navy/15 bg-white px-4 py-3 font-normal outline-none transition focus:border-brand-blue" placeholder={placeholder} type={field === 'whatsapp' ? 'tel' : 'text'} /></label>)}
            </div>
            <button className="mt-7 w-full border-2 border-deep-navy bg-orange px-5 py-4 text-sm font-black uppercase tracking-[0.06em] text-deep-navy shadow-[3px_3px_0_var(--brand-hot-pink)] transition hover:-translate-y-0.5 hover:bg-white" type="submit">Lanjut ke WhatsApp</button>
          </form>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

const consultationSteps = [
  {
    number: "01",
    icon: FaLightbulb,
    title: "Ceritakan kebutuhanmu",
    description: "Jawab beberapa pertanyaan singkat tentang ide dan tujuan digitalmu.",
  },
  {
    number: "02",
    icon: FaListCheck,
    title: "Temukan arah yang tepat",
    description: "Dapatkan rekomendasi layanan dan gambaran solusi yang sesuai.",
  },
  {
    number: "03",
    icon: FaComments,
    title: "Lanjutkan diskusi",
    description: "Bahas langkah berikutnya bersama tim Sebisa Project melalui WhatsApp.",
  },
];

function ConsultationStep({ step, index }) {
  const StepIcon = step.icon;

  return (
    <motion.article
      className="relative border-t-2 border-orange pt-4"
      initial={{ opacity: 0, y: -8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{ y: -6 }}
    >
      <div className="relative z-10 flex w-fit items-center gap-3 bg-brand-surface pr-3">
        <span className="flex h-9 w-9 items-center justify-center border border-deep-navy/15 bg-brand-surface text-brand-blue">
          <StepIcon aria-hidden="true" />
        </span>
        <motion.span
          className={`inline-block text-sm font-bold tracking-[0.15em] ${
            index % 2 === 1 ? "text-hot-pink" : "text-brand-blue"
          }`}
          whileHover={{ scale: 1.12, x: 3 }}
          transition={{ type: "spring", stiffness: 300, damping: 16 }}
        >
          {step.number}
        </motion.span>
      </div>
      <h3 className="mt-4 text-xl font-bold text-deep-navy">{step.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
    </motion.article>
  );
}

export default function ConsultationSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      id="konsultasi"
      className="brand-light-gradient relative overflow-hidden px-6 py-20 [content-visibility:auto] [contain-intrinsic-size:700px] [font-family:Arial,sans-serif] sm:py-24 lg:px-8"
    >
      <motion.div
        className="brand-top-line absolute inset-x-0 top-0 h-1 origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="mb-3 text-sm font-black uppercase tracking-[0.24em] text-deep-navy">
            Konsultasi layanan
          </p>
          <motion.h2
            className="text-3xl font-black uppercase leading-[1.02] tracking-tight text-deep-navy [text-shadow:3px_3px_0_var(--brand-blue-light)] sm:text-5xl lg:text-[52px]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            Jawab, temukan, lalu <motion.span
              className="inline-block text-orange"
              whileHover={{ scale: 1.06, rotate: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
            >mulai</motion.span> dengan arah yang lebih jelas.
          </motion.h2>
          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
            Tidak perlu menebak harus mulai dari mana. Isi identitas singkat,
            jawab beberapa pertanyaan, lalu dapatkan rekomendasi layanan yang
            sesuai dengan kebutuhanmu.
          </p>
        </motion.div>

        <div className="relative mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3 md:gap-8">
          <div className="pointer-events-none absolute left-[16.5%] right-[16.5%] top-7 hidden h-px bg-deep-navy/15 md:block" />
          {consultationSteps.map((step, index) => (
            <ConsultationStep key={step.number} step={step} index={index} />
          ))}
        </div>

        <motion.div
          className="mt-14 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <motion.button
            className="inline-flex items-center justify-center border-2 border-deep-navy bg-orange px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-deep-navy shadow-[4px_4px_0_var(--brand-hot-pink)] transition hover:-translate-y-1 hover:bg-white hover:shadow-[6px_6px_0_var(--brand-hot-pink)]"
            type="button"
            aria-label="Mulai konsultasi"
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            Mulai Konsultasi
          </motion.button>
        </motion.div>
      </div>
      {isModalOpen ? <ConsultationModal onClose={() => setIsModalOpen(false)} /> : null}
    </section>
  );
}