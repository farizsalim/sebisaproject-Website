"use client";

import axios from "axios";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaInstagram, FaXmark } from "react-icons/fa6";

const caseSlideVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction * 90,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction * -90,
  }),
};

function SideCaseCard({ caseStudy, side, onClick }) {
  const media = caseStudy.media.slice(0, 5);

  return (
    <motion.button
      className={`absolute ${side === "left" ? "-left-[30%]" : "-right-[30%]"} top-1/2 z-0 hidden aspect-[4/3] w-[28%] -translate-y-1/2 overflow-hidden border-2 border-brand-blue/70 bg-deep-navy p-1 text-left transition hover:border-orange lg:block`}
      type="button"
      aria-label={`Buka ${caseStudy.client}`}
      onClick={onClick}
      initial={{ opacity: 0, x: side === "left" ? 70 : -70 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: side === "left" ? 70 : -70 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex h-full flex-col border border-brand-blue/50 bg-deep-navy p-1.5">
        <div className="flex items-start justify-between gap-1 border-b border-white/20 pb-1.5">
          <div className="min-w-0">
            <span className="block text-[6px] font-black uppercase tracking-[0.18em] text-brand-blue-light">
              Portofolio
            </span>
            <span className="mt-0.5 block truncate text-[10px] font-black uppercase text-white">
              {caseStudy.client}
            </span>
          </div>
          <span className="shrink-0 border border-orange px-1 py-0.5 text-[5px] font-black uppercase text-orange">
            Detail
          </span>
        </div>
        <div className="mt-1 grid min-h-0 flex-1 grid-cols-4 grid-rows-2 gap-0.5">
          {media.map((item, index) => (
            <div
              key={`${caseStudy.id}-side-${item.src}`}
              className={`relative min-h-0 overflow-hidden border border-hot-pink/50 ${index === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}`}
            >
              {item.type === "video" ? (
                <video className="h-full w-full object-cover" src={item.src} muted preload="none" />
              ) : (
                <Image src={item.src} alt="" fill sizes="12vw" className="object-cover" />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-white/20 pt-1.5 text-[6px] font-black uppercase tracking-[0.08em]">
          <span className="truncate text-brand-blue-light">Instagram client</span>
          <span className="ml-1 h-1 w-3 shrink-0 bg-orange" />
        </div>
      </div>
    </motion.button>
  );
}

export default function CaseStudySection() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCaseStudies = async () => {
      try {
        const response = await axios.get("/data/case-studies.json");
        setCaseStudies(response.data);
      } catch {
        setError("Studi kasus belum dapat dimuat.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCaseStudies();
  }, []);

  const activeCase = caseStudies[activeIndex];
  const previousCase = caseStudies.length > 1
    ? caseStudies[(activeIndex - 1 + caseStudies.length) % caseStudies.length]
    : null;
  const nextCase = caseStudies.length > 1
    ? caseStudies[(activeIndex + 1) % caseStudies.length]
    : null;
  useEffect(() => {
    if (caseStudies.length < 2) return undefined;

    const caseTimer = window.setInterval(() => {
      setSlideDirection(1);
      setActiveIndex((currentIndex) => (currentIndex + 1) % caseStudies.length);
    }, 20000);

    return () => window.clearInterval(caseTimer);
  }, [caseStudies.length]);

  const changeCase = (direction) => {
    const nextIndex = activeIndex + direction;
    selectCase(
      nextIndex < 0
        ? caseStudies.length - 1
        : nextIndex >= caseStudies.length
          ? 0
          : nextIndex,
      direction,
    );
  };

  const selectCase = (nextIndex, direction = nextIndex >= activeIndex ? 1 : -1) => {
    if (nextIndex === activeIndex) return;

    setSlideDirection(direction);
    setActiveIndex(nextIndex);
    setIsDetailsOpen(false);
  };

  const handleCaseSwipe = (_, info) => {
    if (Math.abs(info.offset.x) < 50 || caseStudies.length < 2) return;

    changeCase(info.offset.x < 0 ? 1 : -1);
  };

  const visibleMedia = activeCase?.media.slice(0, 5) || [];

  return (
    <section
      className="relative min-h-[900px] overflow-hidden bg-deep-navy bg-[length:100%_auto] bg-center bg-no-repeat px-4 py-10 text-white [content-visibility:auto] [contain-intrinsic-size:900px] [font-family:Arial,sans-serif] sm:min-h-[760px] sm:px-6 sm:py-20 lg:min-h-[700px] lg:px-8"
      style={{ backgroundImage: "url('/images/Portofolio.png')" }}
    >
      <div className="brand-photo-overlay absolute inset-0" />
      <div className="brand-top-line absolute inset-x-0 top-0 h-1" />
      <div className="relative z-10 mx-auto max-w-[1240px]">
        <motion.div
          className="mb-5 flex flex-col justify-between gap-3 sm:mb-8 sm:flex-row sm:items-end"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-3xl">
            <p id="studi-kasus" className="scroll-mt-[82px] mb-2 text-xs font-black uppercase tracking-[0.24em] text-orange sm:mb-3 sm:scroll-mt-[102px] sm:text-sm">
              Kisah di balik karya
            </p>
            <h2 className="max-w-2xl text-3xl font-black uppercase leading-[1.02] tracking-tight text-white [text-shadow:3px_3px_0_var(--brand-deep-navy)] sm:text-5xl lg:text-[52px]">
              Kisah di balik setiap project.
            </h2>
            <p className={`${isIntroExpanded ? "block" : "hidden sm:block"} mt-3 max-w-xl text-sm leading-6 text-white/90 sm:mt-4 sm:text-base`}>
              Lihat proses dan hasil kerja yang membantu brand tumbuh lebih
              dekat dengan audiensnya.
            </p>
            <button
              className="mt-3 text-xs font-bold text-orange underline underline-offset-4 sm:hidden"
              type="button"
              aria-expanded={isIntroExpanded}
              onClick={() => setIsIntroExpanded((expanded) => !expanded)}
            >
              {isIntroExpanded ? "Sembunyikan" : "Baca selengkapnya"}
            </button>
          </div>
        </motion.div>

        {isLoading ? (
          <p className="py-16 text-white/85">Memuat studi kasus...</p>
        ) : error ? (
          <p className="py-16 text-orange">{error}</p>
        ) : activeCase ? (
          <>
          <div className="relative mx-auto min-h-[430px] w-full max-w-[620px] sm:min-h-[400px]">
              <AnimatePresence initial={false} custom={slideDirection}>
                {previousCase ? (
                  <SideCaseCard
                    key={`previous-${previousCase.id}`}
                    caseStudy={previousCase}
                    side="left"
                    onClick={() => changeCase(-1)}
                  />
                ) : null}
                {nextCase ? (
                  <SideCaseCard
                    key={`next-${nextCase.id}`}
                    caseStudy={nextCase}
                    side="right"
                    onClick={() => changeCase(1)}
                  />
                ) : null}
              </AnimatePresence>
              <button
                aria-label="Studi kasus sebelumnya"
                className="absolute -left-14 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center border-2 border-hot-pink bg-deep-navy text-white transition hover:border-orange hover:bg-orange hover:text-deep-navy disabled:opacity-40 lg:flex"
                title="Studi kasus sebelumnya"
                type="button"
                onClick={() => changeCase(-1)}
                disabled={caseStudies.length < 2}
              >
                <FaArrowLeft aria-hidden="true" />
              </button>
              <button
                aria-label="Studi kasus berikutnya"
                className="absolute -right-14 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center border-2 border-hot-pink bg-deep-navy text-white transition hover:border-orange hover:bg-orange hover:text-deep-navy disabled:opacity-40 lg:flex"
                title="Studi kasus berikutnya"
                type="button"
                onClick={() => changeCase(1)}
                disabled={caseStudies.length < 2}
              >
                <FaArrowRight aria-hidden="true" />
              </button>
            <AnimatePresence mode="sync" initial={false} custom={slideDirection}>
              <motion.div
                key={activeCase.id}
                custom={slideDirection}
                variants={caseSlideVariants}
                className="absolute inset-x-0 top-0 z-10 overflow-hidden border-2 border-brand-blue/60 bg-deep-navy/95 p-2 shadow-[4px_4px_0_var(--brand-hot-pink)] backdrop-blur-sm sm:p-3"
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={handleCaseSwipe}
              >
            <div className="flex items-end justify-between gap-3 px-1 pb-3 sm:px-2 sm:pb-4">
              <div className="min-w-0">
                <p className="mb-1 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-brand-blue-light sm:text-[10px]">
                  <span className="h-1.5 w-1.5 bg-orange" aria-hidden="true" />
                  Portofolio
                </p>
                <h3 className="border-l-4 border-orange pl-2 text-xl font-black leading-tight sm:text-2xl">
                  {activeCase.client}
                </h3>
              </div>
              <button
                className="shrink-0 border border-orange px-2 py-1.5 text-[9px] font-black uppercase tracking-[0.08em] text-orange transition hover:bg-orange hover:text-deep-navy sm:px-3 sm:py-2 sm:text-[10px]"
                type="button"
                onClick={() => setIsDetailsOpen(true)}
              >
                Selengkapnya
              </button>
            </div>

            <div className="mx-auto grid aspect-[4/3] w-full max-w-[560px] grid-cols-2 grid-rows-3 gap-1.5 sm:aspect-[2/1] sm:grid-cols-4 sm:grid-rows-2 sm:gap-2">
              {visibleMedia.map((media, index) => (
                <motion.div
                  key={`${activeCase.id}-${media.src}`}
                  className={`group relative flex min-h-0 items-center justify-center overflow-hidden border-2 border-hot-pink/60 bg-deep-navy shadow-[2px_2px_0_rgb(243_161_55_/_45%)] ${index === 0 ? "row-span-2 sm:col-span-2 sm:row-span-2" : index === 1 ? "col-start-2 row-start-1 sm:col-start-3 sm:row-start-1" : index === 2 ? "col-start-2 row-start-2 sm:col-start-4 sm:row-start-1" : index === 3 ? "col-start-1 row-start-3 sm:col-start-3 sm:row-start-2" : "col-start-2 row-start-3 sm:col-start-4 sm:row-start-2"}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                >
                  {media.type === "video" ? (
                    <video
                      src={media.src}
                      aria-label={media.alt}
                      className="block h-full w-full object-cover"
                      autoPlay
                      loop
                      muted
                      preload="none"
                      playsInline
                    />
                  ) : (
                    <img
                      src={media.src}
                      alt={media.alt}
                      className="block h-full w-full object-cover"
                      style={{ objectPosition: media.position }}
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 border border-white/10 transition group-hover:border-white/35" />
                </motion.div>
              ))}
            </div>

            <div className="mt-1 flex items-center justify-between gap-3 border-t border-white/15 px-1 pt-3 sm:px-2 sm:pt-4">
              {activeCase.instagram ? (
                <a
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-brand-blue-light transition hover:text-orange sm:text-xs"
                  href={activeCase.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagram aria-hidden="true" className="text-base" />
                  Instagram client
                </a>
              ) : <span />}
              <div className="flex items-center gap-1.5" aria-label="Posisi studi kasus">
                {caseStudies.map((caseStudy, index) => (
                  <button
                    key={caseStudy.id}
                    aria-label={`Buka ${caseStudy.eyebrow}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    className={`h-1.5 transition-all ${
                      index === activeIndex ? "w-8 bg-orange" : "w-3 bg-hot-pink/60"
                    }`}
                    type="button"
                    onClick={() => selectCase(index)}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between lg:hidden">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/85">
                {String(activeIndex + 1).padStart(2, "0")} / {String(caseStudies.length).padStart(2, "0")}
              </p>
              <div className="flex gap-2">
                <button
                  aria-label="Studi kasus sebelumnya"
                  className="flex h-9 w-9 items-center justify-center border border-white/20 text-sm text-white transition hover:border-brand-blue hover:bg-brand-blue hover:text-deep-navy disabled:opacity-40"
                  type="button"
                  onClick={() => changeCase(-1)}
                  disabled={caseStudies.length < 2}
                >
                  <FaArrowLeft aria-hidden="true" />
                </button>
                <button
                  aria-label="Studi kasus berikutnya"
                  className="flex h-9 w-9 items-center justify-center border border-white/20 text-sm text-white transition hover:border-brand-blue hover:bg-brand-blue hover:text-deep-navy disabled:opacity-40"
                  type="button"
                  onClick={() => changeCase(1)}
                  disabled={caseStudies.length < 2}
                >
                  <FaArrowRight aria-hidden="true" />
                </button>
              </div>
            </div>
              </motion.div>
            </AnimatePresence>
          </div>
          </>
        ) : null}
      </div>

      <AnimatePresence>
        {isDetailsOpen && activeCase ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/85 p-4 backdrop-blur-sm sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDetailsOpen(false)}
          >
            <motion.div
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border-2 border-brand-blue bg-deep-navy p-5 text-white shadow-[5px_5px_0_var(--brand-hot-pink)] sm:p-8"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.97 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-orange text-orange transition hover:bg-orange hover:text-deep-navy"
                type="button"
                aria-label="Tutup detail studi kasus"
                title="Tutup"
                onClick={() => setIsDetailsOpen(false)}
              >
                <FaXmark aria-hidden="true" />
              </button>
              <p className="pr-12 text-xs font-black uppercase tracking-[0.2em] text-orange">
                {activeCase.eyebrow}
              </p>
              <h3 className="mt-3 pr-12 text-3xl font-black leading-tight sm:text-4xl">
                {activeCase.client}
              </h3>
              <p className="mt-5 text-sm leading-7 text-white/85 sm:text-base">
                {activeCase.description}
              </p>
              <div className="mt-6 border-l-4 border-brand-blue px-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-blue-light">
                  Hasil
                </p>
                <p className="mt-1 text-lg font-bold">{activeCase.result}</p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {activeCase.services.map((service) => (
                  <div key={service.label} className="border border-white/15 p-4">
                    <p className="font-bold text-white">{service.label}</p>
                    <p className="mt-2 text-sm leading-6 text-white/70">{service.description}</p>
                  </div>
                ))}
              </div>
              {activeCase.instagram ? (
                <a
                  className="mt-7 inline-flex items-center gap-2 border-2 border-brand-blue bg-brand-blue px-4 py-3 text-xs font-black uppercase tracking-[0.1em] text-deep-navy transition hover:border-orange hover:bg-orange"
                  href={activeCase.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagram aria-hidden="true" />
                  Instagram client
                </a>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
