"use client";

import axios from "axios";
import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

export default function CaseStudySection() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
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

  const changeCase = (direction) => {
    setActiveIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;
      if (nextIndex < 0) return caseStudies.length - 1;
      if (nextIndex >= caseStudies.length) return 0;
      return nextIndex;
    });
  };

  return (
    <section
      id="studi-kasus"
      className="relative overflow-hidden bg-[#f7f9fc] px-6 py-16 text-[#00132d] [font-family:Arial,sans-serif] sm:py-20 lg:px-8"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#17E9E5_0%,#FBCD2F_50%,#DF00A8_100%)]" />
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#d5a900]">
              Cerita di balik karya
            </p>
            <h2 className="text-3xl font-black leading-tight sm:text-5xl">
              Bukan cuma selesai. Ada cerita di setiap project.
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              Lihat bagaimana ide, proses, dan hasil kerja dirangkai menjadi
              pengalaman digital yang lebih berarti.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
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
          <motion.div
            key={activeCase.id}
            className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#17aeb0]">
                {activeCase.eyebrow}
              </p>
              <h3 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                {activeCase.title}
              </h3>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                {activeCase.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.12em]">
                <span className="border border-[#00132d]/15 px-3 py-2 text-[#00132d]/70">
                  {activeCase.client}
                </span>
                <span className="bg-[#FBCD2F] px-3 py-2 text-[#00132d]">
                  {activeCase.result}
                </span>
              </div>
              <div className="mt-8 space-y-3">
                {activeCase.services.map((service) => (
                  service.href ? (
                    <a
                      key={service.label}
                      className="block border-l-2 border-[#17aeb0] pl-4 transition hover:border-[#FBCD2F]"
                      href={service.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <p className="text-sm font-bold text-[#00132d]">{service.label}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{service.description}</p>
                    </a>
                  ) : (
                    <div key={service.label} className="border-l-2 border-[#17aeb0] pl-4">
                      <p className="text-sm font-bold text-[#00132d]">{service.label}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{service.description}</p>
                    </div>
                  )
                ))}
              </div>
              <div className="mt-8 flex items-center gap-2" aria-label="Posisi studi kasus">
                {caseStudies.map((caseStudy, index) => (
                  <button
                    key={caseStudy.id}
                    aria-label={`Buka ${caseStudy.eyebrow}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    className={`h-1.5 transition-all ${
                      index === activeIndex ? "w-10 bg-[#00132d]" : "w-5 bg-[#00132d]/20"
                    }`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>
            </div>

            <div className="grid h-[390px] grid-cols-[1.35fr_0.65fr] grid-rows-2 gap-3 sm:h-[460px]">
              {activeCase.media.map((media, index) => (
                <motion.div
                  key={`${activeCase.id}-${media.alt}`}
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
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FBCD2F]">
                      {media.channel}
                    </p>
                    <p className="mt-1 text-sm font-bold">{media.caption}</p>
                    {media.href ? (
                      <a
                        className="mt-2 inline-block text-xs font-bold text-[#17E9E5] underline underline-offset-4"
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
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
