"use client";

import axios from "axios";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

export default function CaseStudySection() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mediaOffset, setMediaOffset] = useState(0);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
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
      setMediaOffset(0);
      setIsDetailsExpanded(false);
    }, 20000);

    return () => window.clearInterval(caseTimer);
  }, [caseStudies.length]);

  useEffect(() => {
    if (!activeCase || activeCase.media.length <= 5) return undefined;

    const mediaTimer = window.setInterval(() => {
      setMediaOffset((currentOffset) => (currentOffset + 1) % activeCase.media.length);
    }, 14500);

    return () => window.clearInterval(mediaTimer);
  }, [activeCase]);

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
    setMediaOffset(0);
    setIsDetailsExpanded(false);
  };

  const handleCaseSwipe = (_, info) => {
    if (Math.abs(info.offset.x) < 50 || caseStudies.length < 2) return;

    changeCase(info.offset.x < 0 ? 1 : -1);
  };

  const visibleMedia = activeCase
    ? Array.from({ length: Math.min(5, activeCase.media.length) }, (_, index) =>
        activeCase.media[(index + mediaOffset) % activeCase.media.length],
      )
    : [];

  return (
    <section
      className="relative overflow-hidden bg-[#f7f9fc] px-4 py-10 text-[#00132d] [font-family:Arial,sans-serif] sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#17E9E5_0%,#FBCD2F_50%,#DF00A8_100%)]" />
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          className="mb-5 flex flex-col justify-between gap-3 sm:mb-8 sm:flex-row sm:items-end"
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-3xl">
            <p id="studi-kasus" className="scroll-mt-[82px] mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d5a900] sm:mb-3 sm:scroll-mt-[102px] sm:text-sm">
              Kisah di balik karya
            </p>
            <h2 className="max-w-2xl text-2xl font-black leading-tight sm:text-4xl">
              Kisah di balik setiap project.
            </h2>
            <p className="mt-3 hidden max-w-xl text-sm leading-6 text-slate-600 sm:mt-4 sm:block sm:text-base">
              Lihat proses dan hasil kerja yang membantu brand tumbuh lebih
              dekat dengan audiensnya.
            </p>
          </div>
          <div className="hidden shrink-0 gap-2 lg:flex">
            <button
              aria-label="Studi kasus sebelumnya"
              className="flex h-11 w-11 items-center justify-center border border-[#00132d]/20 text-[#00132d] transition hover:border-[#17E9E5] hover:bg-[#17E9E5]"
              title="Studi kasus sebelumnya"
              type="button"
              onClick={() => changeCase(-1)}
              disabled={caseStudies.length < 2}
            >
              <FaArrowLeft aria-hidden="true" />
            </button>
            <button
              aria-label="Studi kasus berikutnya"
              className="flex h-11 w-11 items-center justify-center border border-[#00132d]/20 text-[#00132d] transition hover:border-[#17E9E5] hover:bg-[#17E9E5]"
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
          <p className="py-16 text-slate-500">Memuat studi kasus...</p>
        ) : error ? (
          <p className="py-16 text-[#b18b00]">{error}</p>
        ) : activeCase ? (
          <>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeCase.id}
              className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={handleCaseSwipe}
            >
            <div>
              <p className="inline-flex items-center border-l-4 border-[#FBCD2F] bg-[#17E9E5]/10 px-3 py-2 text-sm font-black tracking-[0.04em] text-[#00132d] sm:text-base">
                {activeCase.eyebrow}
              </p>
              <h3 className="mt-3 max-w-2xl line-clamp-2 text-xl font-black leading-[1.12] sm:mt-4 sm:line-clamp-none sm:text-3xl sm:leading-tight lg:text-4xl">
                {activeCase.title}
              </h3>
              <p className={`${isDetailsExpanded ? "" : "line-clamp-2"} mt-3 max-w-xl text-xs leading-5 text-slate-600 sm:mt-5 sm:line-clamp-none sm:text-base sm:leading-7`}>
                {activeCase.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.1em] sm:mt-8 sm:gap-3 sm:text-xs sm:tracking-[0.12em]">
                <span className="border border-[#00132d]/15 px-3 py-2 text-[#00132d]/70">
                  {activeCase.client}
                </span>
                <span className="bg-[#FBCD2F] px-3 py-2 text-[#00132d]">
                  {activeCase.result}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 sm:mt-8 sm:block sm:space-y-3">
                {activeCase.services.map((service) => (
                  service.href ? (
                    <a
                      key={service.label}
                      className="block border border-[#17aeb0]/40 px-3 py-2 transition hover:border-[#FBCD2F] sm:border-0 sm:border-l-2 sm:px-0 sm:py-0 sm:pl-4"
                      href={service.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <p className="text-sm font-bold text-[#00132d]">{service.label}</p>
                      <p className={`${isDetailsExpanded ? "block" : "hidden"} mt-1 text-sm leading-6 text-slate-600 sm:block`}>{service.description}</p>
                    </a>
                  ) : (
                    <div key={service.label} className="border border-[#17aeb0]/40 px-3 py-2 sm:border-0 sm:border-l-2 sm:px-0 sm:py-0 sm:pl-4">
                      <p className="text-sm font-bold text-[#00132d]">{service.label}</p>
                      <p className={`${isDetailsExpanded ? "block" : "hidden"} mt-1 text-sm leading-6 text-slate-600 sm:block`}>{service.description}</p>
                    </div>
                  )
                ))}
              </div>
              <button
                className="mt-4 text-xs font-bold text-[#00AFC1] underline underline-offset-4 sm:hidden"
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
                      index === activeIndex ? "w-10 bg-[#00132d]" : "w-5 bg-[#00132d]/20"
                    }`}
                    type="button"
                    onClick={() => selectCase(index)}
                  />
                ))}
              </div>
            </div>

            <div className="grid h-[220px] grid-cols-[1.05fr_0.95fr] grid-rows-2 gap-2 sm:h-[390px] sm:gap-3 lg:h-[460px]">
              {visibleMedia.map((media, index) => (
                <motion.div
                  key={`${activeCase.id}-${media.src}-${mediaOffset}`}
                  className={`relative overflow-hidden rounded-[18px] bg-[#00132d] ${
                    index === 0 ? "row-span-2" : ""
                  }`}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00132d]/85 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-2.5 text-white sm:p-4">
                    <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#FBCD2F] sm:text-[10px] sm:tracking-[0.14em]">
                      {media.channel}
                    </p>
                    <p className="mt-1 text-[11px] font-bold leading-tight sm:text-sm">{media.caption}</p>
                    {media.href ? (
                      <a
                        className="mt-1 inline-block text-[10px] font-bold text-[#17E9E5] underline underline-offset-4 sm:mt-2 sm:text-xs"
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
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                {String(activeIndex + 1).padStart(2, "0")} / {String(caseStudies.length).padStart(2, "0")}
              </p>
              <div className="flex gap-2">
                <button
                  aria-label="Studi kasus sebelumnya"
                  className="flex h-9 w-9 items-center justify-center border border-[#00132d]/20 text-sm text-[#00132d] transition hover:border-[#17E9E5] hover:bg-[#17E9E5] disabled:opacity-40"
                  type="button"
                  onClick={() => changeCase(-1)}
                  disabled={caseStudies.length < 2}
                >
                  <FaArrowLeft aria-hidden="true" />
                </button>
                <button
                  aria-label="Studi kasus berikutnya"
                  className="flex h-9 w-9 items-center justify-center border border-[#00132d]/20 text-sm text-[#00132d] transition hover:border-[#17E9E5] hover:bg-[#17E9E5] disabled:opacity-40"
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
