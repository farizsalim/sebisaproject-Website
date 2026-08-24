"use client";

import { useCallback, useEffect, useState } from "react";
import { FaChevronDown, FaFloppyDisk, FaPlus, FaRotate, FaTrash } from "react-icons/fa6";

const inputClassName = "w-full rounded-xl border border-deep-navy/15 bg-white px-3 py-2 text-sm text-deep-navy outline-none focus:border-brand-blue";
const buttonClassName = "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-black transition";

function createQuestion(index) {
  return {
    id: `question-${Date.now()}-${index}`,
    type: "question",
    position: { x: 0, y: index * 180 },
    data: { title: "Pertanyaan baru", options: [{ label: "Opsi baru", target: null, scores: [] }] },
  };
}

const recommendationGroups = [
  { id: "content-social", label: "Konten & Social Media", description: "Untuk kebutuhan konten rutin, pengelolaan media sosial, dan menjangkau lebih banyak audiens.", matches: ["Paket Starter", "Paket Kreator", "Paket Pro", "Paket Elite", "Social Media Jalan Terus", "Paket Konten Terima Beres", "Edit Set A", "Edit Set B", "Paket Sosmed"] },
  { id: "design-branding", label: "Desain & Branding", description: "Untuk membangun identitas visual, merapikan tampilan brand, dan terlihat lebih profesional.", matches: ["Design Graphic Set A", "Design Graphic Set B", "Design Sosmed", "Design"] },
  { id: "website", label: "Website & Landing Page", description: "Untuk memiliki website, landing page, atau halaman yang membantu promosi dan penjualan.", matches: ["Paket Landing Page", "Paket Website"] },
];

function getRecommendationServices(services) {
  return recommendationGroups.map((group) => {
    const members = services.filter((service) => group.matches.includes(service.name));
    return members[0] ? { ...members[0], recommendationId: group.id, recommendationName: group.label, recommendationDescription: group.description, memberIds: members.map((service) => service.id) } : null;
  }).filter(Boolean);
}

function serviceOptions(services, scores, onChange) {
  return services.map((service) => {
    const score = Math.max(0, ...scores.filter((item) => service.memberIds.includes(item.serviceId)).map((item) => Number(item.score) || 0));
    return (
      <label className="grid min-w-0 grid-cols-[minmax(0,1fr)_76px] items-center gap-3 text-xs font-bold text-deep-navy" key={service.id}>
        <span className="min-w-0 break-words"><span className="block whitespace-normal break-words">{service.recommendationName}</span><span className="mt-0.5 block whitespace-normal break-words text-[10px] font-normal leading-4 text-slate-500">{service.recommendationDescription}</span></span>
        <input aria-label={`Nilai kecocokan untuk ${service.recommendationName}`} className={`${inputClassName} min-w-0 sm:max-w-[76px]`} min="0" max="5" type="number" value={score || ""} onChange={(event) => {
          const nextScores = scores.filter((item) => !service.memberIds.includes(item.serviceId));
          if (Number(event.target.value) > 0) nextScores.push({ serviceId: service.id, score: Number(event.target.value) });
          onChange(nextScores);
        }} />
      </label>
    );
  });
}

export default function QuizManager() {
  const [quizId, setQuizId] = useState(null);
  const [startNodeId, setStartNodeId] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [activeScoreId, setActiveScoreId] = useState(null);
  const [showGuide, setShowGuide] = useState(true);

  const loadQuiz = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [quizResponse, serviceResponse] = await Promise.all([
        fetch("/api/cms/content?type=quiz", { cache: "no-store" }),
        fetch("/api/cms/services", { cache: "no-store" }),
      ]);
      const quizResult = await quizResponse.json();
      const serviceResult = await serviceResponse.json();
      if (!quizResponse.ok || !quizResult.quiz) throw new Error(quizResult.error || "Kuis belum tersedia.");
      setQuizId(quizResult.quiz.id);
      setStartNodeId(quizResult.quiz.startNodeId);
      setNodes(quizResult.quiz.nodes || []);
      setActiveQuestionId(quizResult.quiz.startNodeId || quizResult.quiz.nodes?.find((node) => node.type === "question")?.id || null);
      setServices((serviceResult.services || []).flatMap((category) => category.services || []));
    } catch (loadError) {
      setError(loadError.message || "Gagal memuat kuis.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadQuiz(); }, [loadQuiz]);

  function updateNode(nodeId, update) {
    setNodes((currentNodes) => currentNodes.map((node) => node.id === nodeId ? { ...node, ...update } : node));
  }

  function updateQuestion(nodeId, update) {
    setNodes((currentNodes) => currentNodes.map((node) => node.id === nodeId ? { ...node, data: { ...node.data, ...update } } : node));
  }

  function updateOption(nodeId, optionIndex, update) {
    const node = nodes.find((item) => item.id === nodeId);
    const options = (node?.data?.options || []).map((option, index) => index === optionIndex ? { ...option, ...update } : option);
    updateQuestion(nodeId, { options });
  }

  function addQuestion() {
    const question = createQuestion(nodes.length);
    setNodes((currentNodes) => [...currentNodes, question]);
    setActiveQuestionId(question.id);
    if (!startNodeId) setStartNodeId(question.id);
  }

  function addOption(nodeId) {
    const node = nodes.find((item) => item.id === nodeId);
    updateQuestion(nodeId, { options: [...(node?.data?.options || []), { label: "Opsi baru", target: null, scores: [] }] });
  }

  function removeNode(nodeId) {
    setNodes((currentNodes) => {
      const nextNodes = currentNodes.filter((node) => node.id !== nodeId);
      const nextFirstQuestion = nextNodes.find((node) => node.type === "question");
      setStartNodeId(nextFirstQuestion?.id || null);
      return nextNodes;
    });
    if (activeQuestionId === nodeId) setActiveQuestionId(null);
  }

  function reorderQuestion(nodeId, nextIndex) {
    setNodes((currentNodes) => {
      const questions = currentNodes.filter((node) => node.type === "question");
      const otherNodes = currentNodes.filter((node) => node.type !== "question");
      const currentIndex = questions.findIndex((node) => node.id === nodeId);
      if (currentIndex < 0 || currentIndex === nextIndex) return currentNodes;
      const [movedQuestion] = questions.splice(currentIndex, 1);
      questions.splice(nextIndex, 0, movedQuestion);
      setStartNodeId(questions[0]?.id || null);
      return [...questions, ...otherNodes];
    });
  }

  async function saveQuiz() {
    setIsSaving(true);
    setMessage("");
    setError("");
    const firstQuestionId = nodes.find((node) => node.type === "question")?.id || null;
    const edges = nodes.flatMap((node) => (node.type === "question" ? (node.data.options || []).map((option, index) => option.target ? ({ id: `${node.id}-${index}-${option.target}`, source: node.id, sourceHandle: `option-${index}`, target: option.target }) : null).filter(Boolean) : []));
    const response = await fetch("/api/cms/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-content-type": "quiz" },
      body: JSON.stringify({ quizId, startNodeId: firstQuestionId, nodes, edges }),
    });
    const result = await response.json();
    if (!response.ok) setError(result.error || "Gagal menyimpan kuis.");
    else { setMessage("Kuis berhasil disimpan."); await loadQuiz(); }
    setIsSaving(false);
  }

  if (isLoading) return <section className="rounded-2xl border border-deep-navy/10 bg-white p-8 text-sm font-bold text-slate-500">Memuat kuis...</section>;

  const questionNodes = nodes.filter((node) => node.type === "question");
  const targetOptions = questionNodes.map((node, index) => ({ id: node.id, label: `Pertanyaan ${index + 1}: ${node.data.title}` }));
  const recommendationServices = getRecommendationServices(services);

  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-deep-navy/10 bg-white p-4 shadow-[0_12px_28px_rgb(23_36_61_/_8%)] sm:p-6">
      <div className="flex flex-col justify-between gap-4 border-b-2 border-deep-navy/10 pb-5 lg:flex-row lg:items-center">
        <div><p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Kuis konsultasi</p><h2 className="mt-2 text-2xl font-black">Pertanyaan & rekomendasi</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Susun pertanyaan dari atas ke bawah, lalu tentukan paket yang cocok untuk setiap jawaban.</p></div>
        <div className="grid w-full gap-2 sm:flex sm:w-auto sm:flex-wrap"><button className={`${buttonClassName} w-full bg-brand-surface-alt text-deep-navy sm:w-auto`} onClick={addQuestion} type="button"><FaPlus /> Pertanyaan</button><button className={`${buttonClassName} w-full border border-deep-navy text-deep-navy sm:w-auto`} onClick={loadQuiz} type="button"><FaRotate /> Muat ulang</button></div>
      </div>
      {message ? <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">{message}</p> : null}
      {error ? <p className="mt-4 rounded-xl bg-hot-pink/10 px-4 py-3 text-sm font-bold text-deep-navy">{error}</p> : null}
      <aside className="mt-5 rounded-2xl border border-orange/40 bg-orange/10 p-4 sm:p-5" aria-label="Petunjuk pengaturan kuis">
        <button className="flex w-full items-start justify-between gap-4 text-left" type="button" onClick={() => setShowGuide((visible) => !visible)} aria-expanded={showGuide}>
          <span><span className="block text-xs font-black uppercase tracking-[0.16em] text-deep-navy">Cara mengatur kuis</span><span className="mt-2 block text-sm leading-6 text-deep-navy">Ikuti tiga langkah ini untuk membuat rekomendasi layanan.</span></span>
          <FaChevronDown className={`mt-1 shrink-0 text-deep-navy transition-transform ${showGuide ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
        {showGuide ? <>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["01", "Tulis pertanyaan", "Buat pertanyaan yang mudah dijawab."],
            ["02", "Isi pilihan jawaban", "Tambahkan pilihan yang tersedia."],
            ["03", "Pilih rekomendasi", "Isi nilai 1-5 pada layanan yang paling sesuai."],
          ].map(([number, title, description]) => <div className="flex gap-3" key={number}><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-deep-navy text-[10px] font-black text-orange">{number}</span><div><p className="text-xs font-black text-deep-navy">{title}</p><p className="mt-1 text-xs leading-5 text-deep-navy/70">{description}</p></div></div>)}
        </div>
        <div className="mt-4 grid gap-3 border-t border-orange/30 pt-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white/70 px-3 py-3 text-xs leading-5 text-deep-navy/80"><span className="font-black text-deep-navy">Angka ini untuk apa?</span><br />Angka 1-5 menambah nilai kecocokan kelompok layanan untuk jawaban tersebut. Nilai 5 berarti sangat cocok, nilai 1 berarti sedikit cocok.</div>
          <div className="rounded-xl bg-deep-navy px-3 py-3 text-xs leading-5 text-white/85"><span className="font-black text-orange">Apa hasil akhirnya?</span><br />Nilai dari semua jawaban dijumlahkan. Dua kelompok dengan nilai tertinggi akan menjadi rekomendasi yang tampil kepada pengunjung.</div>
        </div>
        <p className="mt-3 text-xs leading-5 text-deep-navy/75"><span className="font-black text-deep-navy">Contoh:</span> jika jawaban tentang membuat konten diberi nilai 5 pada Konten &amp; Social Media, kelompok itu mendapat tambahan nilai paling besar dan lebih mungkin direkomendasikan.</p>
        </> : null}
      </aside>
      <div className="mt-6 grid gap-5">
        {questionNodes.map((node, questionIndex) => (
          <article className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-deep-navy/10 bg-white p-4 sm:p-5" key={node.id}>
            <div className="flex flex-wrap items-start gap-3">
              <button className="flex min-w-0 flex-1 items-center gap-3 text-left" type="button" onClick={() => setActiveQuestionId(activeQuestionId === node.id ? null : node.id)}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-blue text-xs font-black text-white">{String(questionIndex + 1).padStart(2, "0")}</span>
                <span className="min-w-0 break-words"><span className="block whitespace-normal break-words text-sm font-black text-deep-navy">{node.data.title || "Pertanyaan baru"}</span><span className="mt-1 block text-xs text-slate-500">{node.data.options?.length || 0} opsi jawaban</span></span>
                <FaChevronDown className={`ml-auto shrink-0 text-brand-blue transition-transform ${activeQuestionId === node.id ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              <div className="flex w-full items-center justify-end gap-2 border-t border-deep-navy/10 pt-3 sm:w-auto sm:border-0 sm:pt-0">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.06em] text-slate-500">Urutan<select aria-label={`Urutan pertanyaan ${questionIndex + 1}`} className="w-14 rounded-lg border border-deep-navy/15 bg-white px-1 py-2 text-xs font-black normal-case tracking-normal text-deep-navy outline-none focus:border-brand-blue" value={questionIndex} onChange={(event) => reorderQuestion(node.id, Number(event.target.value))}>{questionNodes.map((_, index) => <option key={index} value={index}>{index + 1}</option>)}</select></label>
                <button aria-label={`Hapus pertanyaan ${questionIndex + 1}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-hot-pink transition hover:bg-hot-pink/10" onClick={() => removeNode(node.id)} title="Hapus pertanyaan" type="button"><FaTrash /></button>
              </div>
            </div>
            {activeQuestionId === node.id ? <div className="mt-5 border-t border-deep-navy/10 pt-5">
              <label className="grid gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">1. Tulis pertanyaan<textarea className={`${inputClassName} min-h-24 resize-y normal-case text-base font-bold leading-6 tracking-normal`} value={node.data.title || ""} onChange={(event) => updateQuestion(node.id, { title: event.target.value })} placeholder="Contoh: Apa yang ingin kamu kembangkan?" rows="2" /></label>
              <div className="mt-5 grid gap-3">
                {(node.data.options || []).map((option, optionIndex) => {
                  const scoreKey = `${node.id}-${optionIndex}`;
                  const scoreCount = (option.scores || []).filter((score) => Number(score.score) > 0).length;
                  return <div className="rounded-xl border border-deep-navy/10 bg-brand-surface-alt/70 p-3" key={scoreKey}>
                    <p className="mt-3 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">2. Isi pilihan jawaban</p>
                    <label className="mt-1 grid gap-2 text-xs font-bold text-deep-navy"><span className="sr-only">Teks pilihan jawaban</span><textarea aria-label={`Teks opsi ${optionIndex + 1}`} className={`${inputClassName} min-h-16 resize-y leading-5`} value={option.label || ""} onChange={(event) => updateOption(node.id, optionIndex, { label: event.target.value })} placeholder={`Contoh pilihan ${optionIndex + 1}`} rows="2" /></label>
                    <label className="mt-3 grid gap-2 text-xs font-bold text-deep-navy">Setelah memilih jawaban<select className={inputClassName} value={option.target || ""} onChange={(event) => updateOption(node.id, optionIndex, { target: event.target.value || null })}><option value="">Tampilkan rekomendasi</option>{targetOptions.filter((target) => target.id !== node.id).map((target) => <option key={target.id} value={target.id}>{target.label}</option>)}</select></label>
                    <button className="mt-3 flex w-full items-center justify-between rounded-lg bg-white px-3 py-3 text-left text-xs font-black text-deep-navy" type="button" onClick={() => setActiveScoreId(activeScoreId === scoreKey ? null : scoreKey)}><span>3. Pilih rekomendasi {scoreCount ? `(${scoreCount} dipilih)` : ""}</span><FaChevronDown className={`text-brand-blue transition-transform ${activeScoreId === scoreKey ? "rotate-180" : ""}`} aria-hidden="true" /></button>
                    {activeScoreId === scoreKey ? <div className="mt-3 grid min-w-0 gap-3 border-t border-deep-navy/10 pt-3"><div className="rounded-lg bg-brand-blue/10 px-3 py-2 text-xs leading-5 text-deep-navy"><span className="font-black">Pilih layanan yang cocok.</span> Isi angka 1-5. Semakin besar angkanya, semakin kuat rekomendasinya.</div><div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-3 px-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500"><span className="min-w-0">Kelompok layanan</span><span className="text-right">Nilai<br className="sm:hidden" /> 1-5</span></div>{serviceOptions(recommendationServices, option.scores || [], (scores) => updateOption(node.id, optionIndex, { scores }))}</div> : null}
                  </div>;
                })}
              </div>
              <button className="mt-4 rounded-xl border border-dashed border-deep-navy/30 px-3 py-2 text-xs font-bold text-deep-navy" onClick={() => addOption(node.id)} type="button"><FaPlus className="mr-1 inline" /> Tambah opsi</button>
            </div> : null}
          </article>
        ))}
      </div>
      <div className="sticky bottom-4 mt-6 flex justify-end"><button className={`${buttonClassName} w-full bg-orange px-6 py-3 text-sm text-deep-navy shadow-lg disabled:opacity-60 sm:w-auto`} disabled={isSaving || !quizId} onClick={saveQuiz} type="button"><FaFloppyDisk /> {isSaving ? "Menyimpan..." : "Simpan kuis"}</button></div>
    </section>
  );
}
