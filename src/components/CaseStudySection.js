"use client";

import axios from "axios";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

export default function CaseStudySection() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);
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

  useEffect(() => {
    if (caseStudies.length < 2) return undefined;

    const caseTimer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % caseStudies.length);
      setIsDetailsExpanded(false);
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
    );
  };

  const selectCase = (nextIndex) => {
    setActiveIndex(nextIndex);
    setIsDetailsExpanded(false);
  };

  const handleCaseSwipe = (_, info) => {
    if (Math.abs(info.offset.x) < 50 || caseStudies.length < 2) return;

    changeCase(info.offset.x < 0 ? 1 : -1);
  };

  const visibleMedia = activeCase
    ? activeCase.media.slice(0, 3)
    : [];

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
          <div className="hidden shrink-0 gap-2 lg:flex">
            <button
              aria-label="Studi kasus sebelumnya"
              className="flex h-11 w-11 items-center justify-center border-2 border-hot-pink text-white transition hover:border-orange hover:bg-orange hover:text-deep-navy"
              title="Studi kasus sebelumnya"
              type="button"
              onClick={() => changeCase(-1)}
              disabled={caseStudies.length < 2}
            >
              <FaArrowLeft aria-hidden="true" />
            </button>
            <button
              aria-label="Studi kasus berikutnya"
              className="flex h-11 w-11 items-center justify-center border-2 border-hot-pink text-white transition hover:border-orange hover:bg-orange hover:text-deep-navy"
              title="Studi kasus berikutnya"
              type="button"
              onClick={() => changeCase(1)}
              disabled={caseStudies.length < 2}
            >
              <FaArrowRight aria-hidden="true" />
            </button>
          </div>
        </motion.div>

        {isLoading ? (
          <p className="py-16 text-white/85">Memuat studi kasus...</p>
        ) : error ? (
          <p className="py-16 text-orange">{error}</p>
        ) : activeCase ? (
          <>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeCase.id}
              className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.12 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={handleCaseSwipe}
            >
            <div>
              <p className="inline-flex items-center border-l-4 border-orange bg-brand-blue/15 px-3 py-2 text-sm font-black tracking-[0.04em] text-white sm:text-base">
                {activeCase.eyebrow}
              </p>
              <h3 className="mt-3 min-h-[2.24em] max-w-2xl line-clamp-2 text-xl font-black leading-[1.12] sm:mt-4 sm:min-h-[2.4em] sm:text-3xl sm:leading-tight lg:text-4xl">
                {activeCase.title}
              </h3>
              <p className={`${isDetailsExpanded ? "" : "line-clamp-2"} mt-3 max-w-xl text-xs leading-5 text-white/90 sm:mt-5 sm:text-base sm:leading-7`}>
                {activeCase.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.1em] sm:mt-8 sm:gap-3 sm:text-xs sm:tracking-[0.12em]">
                <span className="border border-white/25 px-3 py-2 text-white/80">
                  {activeCase.client}
                </span>
                <span className="bg-orange px-3 py-2 text-deep-navy">
                  {activeCase.result}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 sm:mt-8 sm:block sm:space-y-3">
                {activeCase.services.map((service) => (
                  service.href ? (
                    <a
                      key={service.label}
                      className="block border border-brand-blue/40 px-3 py-2 transition hover:border-orange sm:border-0 sm:border-l-2 sm:px-0 sm:py-0 sm:pl-4"
                      href={service.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <p className="text-sm font-bold text-white">{service.label}</p>
                      <p className={`${isDetailsExpanded ? "block" : "hidden"} mt-1 text-sm leading-6 text-white/85`}>{service.description}</p>
                    </a>
                  ) : (
                    <div key={service.label} className="border border-brand-blue/40 px-3 py-2 sm:border-0 sm:border-l-2 sm:px-0 sm:py-0 sm:pl-4">
                      <p className="text-sm font-bold text-white">{service.label}</p>
                      <p className={`${isDetailsExpanded ? "block" : "hidden"} mt-1 text-sm leading-6 text-white/85`}>{service.description}</p>
                    </div>
                  )
                ))}
              </div>
              <button
                className="mt-4 text-xs font-bold text-brand-blue-light underline underline-offset-4 transition hover:text-orange"
                type="button"
                aria-expanded={isDetailsExpanded}
                onClick={() => setIsDetailsExpanded((expanded) => !expanded)}
              >
                {isDetailsExpanded ? "Sembunyikan detail" : "Baca selengkapnya"}
              </button>
              <div className="mt-4 hidden items-center gap-2 sm:mt-8 sm:flex" aria-label="Posisi studi kasus">
                {caseStudies.map((caseStudy, index) => (
                  <button
                    key={caseStudy.id}
                    aria-label={`Buka ${caseStudy.eyebrow}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    className={`h-1.5 transition-all ${
                      index === activeIndex ? "w-10 bg-orange" : "w-5 bg-hot-pink/60"
                    }`}
                    type="button"
                    onClick={() => selectCase(index)}
                  />
                ))}
              </div>
            </div>

            <div className="grid h-[660px] grid-cols-1 grid-rows-3 gap-2 sm:h-[390px] sm:grid-cols-3 sm:grid-rows-1 sm:gap-3 lg:h-[460px]">
              {visibleMedia.map((media, index) => (
                <motion.div
                  key={`${activeCase.id}-${media.src}`}
                  className="relative overflow-hidden border-2 border-hot-pink/60 bg-deep-navy shadow-[5px_5px_0_var(--brand-hot-pink)]"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                >
                  {media.type === "video" ? (
                    <video
                      src={media.src}
                      aria-label={media.alt}
                      className="absolute inset-0 h-full w-full object-cover"
                      autoPlay
                      loop
                      muted
                      preload="none"
                      playsInline
                    />
                  ) : (
                    <Image
                      src={media.src}
                      alt={media.alt}
                      fill
                      sizes={index === 0 ? "(max-width: 1024px) 65vw, 40vw" : "(max-width: 1024px) 35vw, 20vw"}
                      className="object-cover"
                      style={{ objectPosition: media.position }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/85 via-transparent to-transparent" />
                  <div className="absolute inset-x-2 bottom-2 border-l-2 border-orange bg-deep-navy/85 p-2.5 text-white shadow-lg backdrop-blur-sm sm:inset-x-3 sm:bottom-3 sm:p-4">
                    <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-orange sm:text-[10px] sm:tracking-[0.14em]">
                      {media.channel}
                    </p>
                    <p className="mt-1 text-[11px] font-bold leading-tight sm:text-sm">{media.caption}</p>
                    {media.href ? (
                      <a
                        className="mt-1 inline-block text-[10px] font-bold text-brand-blue-light underline underline-offset-4 sm:mt-2 sm:text-xs"
                        href={media.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Lihat platform
                      </a>
                    ) : null}
                  </div>
                </motion.div>
              ))}
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
          </>
        ) : null}
      </div>
    </section>
  );
}
