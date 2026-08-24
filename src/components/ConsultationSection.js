"use client";

import { motion } from "motion/react";
import { FaArrowLeft, FaCheck, FaComments, FaLightbulb, FaListCheck, FaXmark } from "react-icons/fa6";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "6280000000000";

const fallbackQuizContent = {
  eyebrow: "Konsultasi singkat",
  questions: [
  {
    title: "Apa yang ingin kamu kembangkan?",
    options: ["Bisnis atau UMKM", "Brand", "Personal brand", "Event atau campaign"],
  },
  {
    title: "Untuk bisnis atau UMKM, apa fokus utamamu?",
    options: ["Merapikan brand", "Mendapatkan pelanggan", "Membuat konten rutin", "Membangun sistem bisnis"],
  },
  {
    title: "Untuk brand, apa yang ingin diperkuat?",
    options: ["Identitas visual", "Kampanye promosi", "Konten media sosial", "Jangkauan audiens"],
  },
  {
    title: "Untuk personal brand, apa targetmu?",
    options: ["Membangun kredibilitas", "Meningkatkan engagement", "Membuat konten", "Menjual produk atau jasa"],
  },
  {
    title: "Untuk event atau campaign, apa yang paling dibutuhkan?",
    options: ["Konsep kreatif", "Promosi digital", "Produksi konten", "Landing page event"],
  },
  {
    title: "Kapan kamu ingin mulai?",
    options: ["Secepatnya", "Dalam 1-2 minggu", "Bulan ini", "Masih eksplorasi"],
  },
  {
    title: "Apa hasil yang paling ingin kamu capai?",
    options: ["Konten konsisten", "Brand terlihat profesional", "Lebih banyak pelanggan", "Website atau landing page siap"],
  },
  ],
  recommendations: {
  "Social Media Management": ["Social Media Management", "Content Production"],
  "Content Production": ["Content Production", "Social Media Management"],
  "Digital Ads": ["Digital Ads", "Content Production"],
  "Website atau Landing Page": ["Website Development", "Landing Page"],
  "Marketplace & Merchandise": ["Marketplace & Merchandise", "Content Production"],
  },
  scoringRules: {
    "Bisnis atau UMKM": { "Social Media Jalan Terus": 2, "Paket Website": 1 },
    Brand: { "Design Graphic Set A": 2, "Paket Kreator": 1 },
    "Personal brand": { "Paket Kreator": 2, "Social Media Jalan Terus": 1 },
    "Event atau campaign": { "Paket Kreator": 2, "Paket Landing Page": 2 },
    "Merapikan brand": { "Design Graphic Set A": 3 },
    "Mendapatkan pelanggan": { "Paket Sosmed": 2, "Social Media Jalan Terus": 2 },
    "Membuat konten rutin": { "Paket Konten Terima Beres": 3, "Paket Kreator": 2 },
    "Membangun sistem bisnis": { "Paket Website": 3 },
    "Identitas visual": { "Design Graphic Set A": 3 },
    "Kampanye promosi": { "Paket Kreator": 2, "Paket Landing Page": 1 },
    "Konten media sosial": { "Social Media Jalan Terus": 3, "Paket Kreator": 2 },
    "Jangkauan audiens": { "Paket Sosmed": 3 },
    "Membangun kredibilitas": { "Paket Website": 2, "Design Graphic Set A": 1 },
    "Meningkatkan engagement": { "Social Media Jalan Terus": 3 },
    "Membuat konten": { "Paket Kreator": 3 },
    "Menjual produk atau jasa": { "Paket Landing Page": 2, "Paket Website": 1 },
    "Konsep kreatif": { "Paket Kreator": 3 },
    "Promosi digital": { "Paket Sosmed": 2, "Paket Landing Page": 1 },
    "Produksi konten": { "Paket Kreator": 3 },
    "Landing page event": { "Paket Landing Page": 4 },
    "Konten konsisten": { "Paket Konten Terima Beres": 4, "Social Media Jalan Terus": 3, "Paket Kreator": 2 },
    "Brand terlihat profesional": { "Design Graphic Set A": 4, "Paket Kreator": 2 },
    "Lebih banyak pelanggan": { "Paket Sosmed": 4, "Social Media Jalan Terus": 2 },
    "Website atau landing page siap": { "Paket Website": 4, "Paket Landing Page": 4 },
    "Secepatnya": { "Social Media Jalan Terus": 1 },
    "Dalam 1-2 minggu": { "Paket Landing Page": 1 },
    "Bulan ini": { "Paket Kreator": 1 },
    "Social Media Management": { "Social Media Jalan Terus": 5 },
    "Content Production": { "Paket Kreator": 5 },
    "Digital Ads": { "Paket Sosmed": 5 },
    "Website atau Landing Page": { "Paket Website": 4, "Paket Landing Page": 4 },
    "Marketplace & Merchandise": { "Paket Kreator": 3, "Paket Website": 2 },
  },
  defaultRecommendations: ["Social Media Management", "Content Production"],
};

function calculateRecommendations(answers, quizContent) {
  const scores = {};
  const rules = quizContent.scoringRules || fallbackQuizContent.scoringRules;

  answers.filter(Boolean).forEach((answer) => {
    Object.entries(rules[answer] || {}).forEach(([service, score]) => {
      scores[service] = (scores[service] || 0) + Number(score);
    });
  });

  const rankedServices = Object.entries(scores)
    .sort(([, firstScore], [, secondScore]) => secondScore - firstScore)
    .map(([service]) => service)
    .slice(0, 2);

  return rankedServices.length > 0
    ? rankedServices
    : quizContent.defaultRecommendations || fallbackQuizContent.defaultRecommendations;
}

function ConsultationModal({ content, onClose }) {
  const quizContent = content || fallbackQuizContent;
  const consultationQuestions = quizContent.questions || fallbackQuizContent.questions;
  const flowNodes = quizContent.flow?.nodes || [];
  const isFlowQuiz = flowNodes.length > 0;
  const flowQuestions = flowNodes.filter((node) => node.type === "question");
  const firstFlowQuestion = flowQuestions.find((node) => node.id === quizContent.flow?.startId) || flowQuestions[0];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentNodeId, setCurrentNodeId] = useState(firstFlowQuestion?.id || null);
  const [flowHistory, setFlowHistory] = useState(firstFlowQuestion ? [firstFlowQuestion.id] : []);
  const [answers, setAnswers] = useState([]);
  const [stage, setStage] = useState("questions");
  const [contact, setContact] = useState({ name: "", whatsapp: "", business: "" });
  const [flowRecommendations, setFlowRecommendations] = useState([]);

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

    if (isFlowQuiz) {
      const activeNode = flowQuestions.find((node) => node.id === currentNodeId);
      const selectedOption = activeNode?.data.options.find((option) => option.label === answer);
      const targetNode = flowNodes.find((node) => node.id === selectedOption?.target);
      if (!targetNode) return;
      if (targetNode.type === "result") {
        setFlowRecommendations(calculateRecommendations(nextAnswers, quizContent));
        setStage("analyzing");
      } else {
        setCurrentNodeId(targetNode.id);
        setFlowHistory((history) => [...history, targetNode.id]);
        setCurrentQuestion((question) => question + 1);
      }
      return;
    }

    if (currentQuestion === consultationQuestions.length - 1) {
      setFlowRecommendations(calculateRecommendations(nextAnswers, quizContent));
      setStage("analyzing");
    } else {
      setCurrentQuestion((question) => question + 1);
    }
  };

  const recommendations = flowRecommendations.length > 0 ? flowRecommendations : calculateRecommendations(answers, quizContent);

  const goBack = () => {
    if (isFlowQuiz) {
      if (flowHistory.length <= 1) return;
      const previousHistory = flowHistory.slice(0, -1);
      const previousNodeId = previousHistory[previousHistory.length - 1];
      setFlowHistory(previousHistory);
      setCurrentNodeId(previousNodeId);
      setCurrentQuestion((question) => Math.max(0, question - 1));
      setAnswers((currentAnswers) => currentAnswers.slice(0, Math.max(0, currentAnswers.length - 1)));
      return;
    }

    if (currentQuestion > 0) {
      setCurrentQuestion((question) => question - 1);
      setAnswers((currentAnswers) => currentAnswers.slice(0, Math.max(0, currentAnswers.length - 1)));
    }
  };

  const submitContact = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/consultation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...contact, answers, recommendations, quizId: quizContent.id, quizVersion: quizContent.version }),
    });

    if (!response.ok) return;

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
      <div className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-3xl bg-brand-surface p-5 text-deep-navy shadow-2xl sm:max-h-[92vh] sm:p-9">
        <button className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-lg text-deep-navy/60 transition hover:bg-hot-pink hover:text-white sm:right-4 sm:top-4" type="button" onClick={onClose} aria-label="Tutup konsultasi">
          <FaXmark aria-hidden="true" />
        </button>

        {stage === "questions" ? (
          <>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep-navy">{quizContent.eyebrow}</p>
            <h2 id="consultation-modal-title" className="mt-3 max-w-[calc(100%-2.5rem)] text-2xl font-black leading-tight sm:max-w-lg sm:text-4xl">{isFlowQuiz ? flowQuestions.find((node) => node.id === currentNodeId)?.data.title : consultationQuestions[currentQuestion].title}</h2>
            <div className="mt-5 h-1 rounded-full bg-deep-navy/10"><div className="h-full rounded-full bg-brand-blue transition-all" style={{ width: `${isFlowQuiz ? "50" : ((currentQuestion + 1) / consultationQuestions.length) * 100}%` }} /></div>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Pertanyaan {currentQuestion + 1}{isFlowQuiz ? "" : ` dari ${consultationQuestions.length}`}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {(isFlowQuiz ? flowQuestions.find((node) => node.id === currentNodeId)?.data.options.map((option) => option.label) : consultationQuestions[currentQuestion].options).map((option) => (
                <button key={option} className="min-h-14 rounded-xl border border-deep-navy/15 bg-white px-4 py-4 text-left text-sm font-bold leading-5 transition hover:-translate-y-0.5 hover:border-brand-blue hover:bg-brand-blue-light/20" type="button" onClick={() => chooseAnswer(option)}>
                  {option}
                </button>
              ))}
            </div>
            {(isFlowQuiz ? flowHistory.length > 1 : currentQuestion > 0) ? <button className="mt-6 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-slate-500 transition hover:bg-deep-navy/10 hover:text-deep-navy" type="button" onClick={goBack}><FaArrowLeft aria-hidden="true" /> Kembali</button> : null}
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
            <div className="mt-6 grid gap-3 sm:grid-cols-2">{recommendations.map((recommendation) => <div className="rounded-xl border-l-4 border-orange bg-white px-4 py-4" key={recommendation}><p className="text-sm font-black">{recommendation}</p><p className="mt-2 text-xs font-normal leading-5 text-slate-600">{quizContent.recommendationDescriptions?.[recommendation] || "Rekomendasi berdasarkan jawaban konsultasi kamu."}</p></div>)}</div>
            <button className="mt-8 w-full rounded-full bg-orange px-6 py-3 text-sm font-black uppercase tracking-[0.06em] text-deep-navy transition hover:-translate-y-0.5 hover:bg-brand-blue hover:text-white sm:w-auto" type="button" onClick={() => setStage("contact")}>Lihat rekomendasi lengkap</button>
          </>
        ) : null}

        {stage === "contact" ? (
          <form onSubmit={submitContact}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep-navy">Satu langkah lagi</p>
            <h2 id="consultation-modal-title" className="mt-3 text-2xl font-black sm:text-4xl">Mau lihat rekomendasi lengkap?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Isi data singkat ini. Setelah dikirim, kamu akan diarahkan ke WhatsApp dengan pesan otomatis.</p>
            <div className="mt-6 grid gap-4">
              {[['name', 'Nama lengkap', 'Masukkan nama kamu'], ['business', 'Nama bisnis atau brand', 'Contoh: Sebisa Coffee'], ['whatsapp', 'Nomor WhatsApp', 'Contoh: 08123456789']].map(([field, label, placeholder]) => <label className="grid gap-2 text-sm font-bold" key={field}>{label}<input required value={contact[field]} onChange={(event) => setContact({ ...contact, [field]: event.target.value })} className="rounded-xl border border-deep-navy/15 bg-white px-4 py-3 font-normal outline-none transition focus:border-brand-blue" placeholder={placeholder} type={field === 'whatsapp' ? 'tel' : 'text'} /></label>)}
            </div>
            <button className="mt-7 w-full rounded-full bg-orange px-5 py-4 text-sm font-black uppercase tracking-[0.06em] text-deep-navy transition hover:-translate-y-0.5 hover:bg-brand-blue hover:text-white" type="submit">Lanjut ke WhatsApp</button>
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
      className="group relative rounded-2xl border border-white/15 bg-white/[0.07] p-5 backdrop-blur-sm"
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
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-orange bg-orange text-lg text-deep-navy shadow-[0_0_0_6px_rgb(255_176_0_/_12%)] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
          <StepIcon aria-hidden="true" />
        </span>
        <motion.span
          className={`text-5xl font-black leading-none tracking-[-0.08em] ${
            index % 2 === 1 ? "text-hot-pink/80" : "text-brand-blue-light/80"
          }`}
          whileHover={{ scale: 1.08, x: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 16 }}
        >
          {step.number}
        </motion.span>
      </div>
      <h3 className="mt-6 text-xl font-black text-white">{step.title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/70">{step.description}</p>
      <div className="mt-6 h-1 w-12 rounded-full bg-orange transition-all duration-300 group-hover:w-20" />
    </motion.article>
  );
}

export default function ConsultationSection({ content }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      id="konsultasi"
      className="relative overflow-hidden bg-deep-navy px-6 py-20 text-white [content-visibility:auto] [contain-intrinsic-size:700px] [font-family:Arial,sans-serif] sm:py-24 lg:px-8"
      style={{ backgroundImage: "url('/images/Portofolio.png')" }}
    >
      <div className="brand-photo-overlay absolute inset-0" />
      <motion.div
        className="brand-top-line absolute inset-x-0 top-0 h-1 origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <div className="relative z-10 mx-auto max-w-[1240px]">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="mb-3 text-sm font-black uppercase tracking-[0.24em] text-orange">
            {content?.eyebrow || fallbackQuizContent.eyebrow}
          </p>
          <motion.h2
            className="text-4xl font-black uppercase leading-[0.96] tracking-[-0.04em] text-white sm:text-6xl lg:text-[64px]"
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
          <p className="mt-5 text-base leading-7 text-white/75 sm:text-lg">
            Tidak perlu menebak harus mulai dari mana. Isi identitas singkat,
            jawab beberapa pertanyaan, lalu dapatkan rekomendasi layanan yang
            sesuai dengan kebutuhanmu.
          </p>
        </motion.div>

        <div className="relative mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3 md:gap-6">
          <div className="pointer-events-none absolute left-[17%] right-[17%] top-11 hidden h-px bg-gradient-to-r from-orange/70 via-brand-blue-light/60 to-hot-pink/70 md:block" />
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
            className="inline-flex items-center justify-center rounded-full bg-orange px-7 py-4 text-sm font-black uppercase tracking-[0.08em] text-deep-navy transition hover:-translate-y-1 hover:bg-white hover:text-deep-navy"
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
      {isModalOpen ? <ConsultationModal content={content} onClose={() => setIsModalOpen(false)} /> : null}
    </section>
  );
}