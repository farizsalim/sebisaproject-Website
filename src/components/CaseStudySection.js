"use client";

import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaInstagram, FaXmark } from "react-icons/fa6";

export default function CaseStudySection() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselPosition, setCarouselPosition] = useState(0);
  const [isTrackResetting, setIsTrackResetting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const carouselRef = useRef(null);
  const [carouselWidth, setCarouselWidth] = useState(400);
  const [slideWidth, setSlideWidth] = useState(400);


function PortfolioCard({ caseStudy, caseStudies, activeIndex, isActive, onSelect, onDetails }) {
  return (
    <div className="flex w-[calc(100vw-2rem)] shrink-0 items-center justify-center px-1 sm:w-[400px] sm:px-3">
      <div className={`h-[430px] w-full max-w-[400px] overflow-hidden border-2 bg-deep-navy/95 p-2 shadow-[4px_4px_0_var(--brand-hot-pink)] backdrop-blur-sm transition-transform duration-500 sm:h-[500px] sm:w-[400px] sm:p-3 ${isActive ? "z-10 scale-[1.03] border-brand-blue/60" : "border-brand-blue/35 opacity-70"}`}>
        <div className="flex items-end justify-between gap-3 px-1 pb-3 sm:px-2 sm:pb-4">
          <div className="min-w-0">
            <p className="mb-1 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-brand-blue-light sm:text-[10px]">
              <span className="h-1.5 w-1.5 bg-orange" aria-hidden="true" />
              Portofolio
            </p>
            <h3 className="border-l-4 border-orange pl-2 text-xl font-black leading-tight sm:text-2xl">
              {caseStudy.client}
            </h3>
          </div>
          <button
            className="shrink-0 border border-orange px-2 py-1.5 text-[9px] font-black uppercase tracking-[0.08em] text-orange transition hover:bg-orange hover:text-deep-navy sm:px-3 sm:py-2 sm:text-[10px]"
            type="button"
            onClick={onDetails}
          >
            Selengkapnya
          </button>
        </div>

        <div className="mx-auto flex h-[280px] w-full max-w-[340px] items-center justify-center overflow-hidden border-2 border-hot-pink/60 bg-deep-navy shadow-[2px_2px_0_rgb(243_161_55_/_45%)] sm:h-[350px]">
          <img src={caseStudy.image.src} alt={caseStudy.image.alt} className="block max-h-full max-w-full object-contain" />
        </div>

        <div className="mt-1 flex items-center justify-between gap-3 border-t border-white/15 px-1 pt-3 sm:px-2 sm:pt-4">
          {caseStudy.instagram ? (
            <a
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-brand-blue-light transition hover:text-orange sm:text-xs"
              href={caseStudy.instagram.startsWith("http")
                ? caseStudy.instagram
                : `https://instagram.com/${caseStudy.instagram.replace(/^@/, "")}`}
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram aria-hidden="true" className="text-base" />
              Instagram client
            </a>
          ) : <span />}
          <div className="flex items-center gap-1.5" aria-label="Posisi studi kasus">
            {caseStudies.map((item, index) => (
              <button
                key={item.id}
                aria-label={`Buka ${item.eyebrow}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={`h-1.5 transition-all ${index === activeIndex ? "w-8 bg-orange" : "w-3 bg-hot-pink/60"}`}
                type="button"
                onClick={() => onSelect(index)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
  useEffect(() => {
    const loadCaseStudies = async () => {
      try {
        const response = await axios.get("/data/portfolio.json");
        setCaseStudies(response.data);
        setCarouselPosition(response.data.length);
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

    const caseTimer = window.setInterval(() => changeCase(1), 20000);

    return () => window.clearInterval(caseTimer);
  }, [activeIndex, caseStudies.length]);

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
    if (nextIndex === activeIndex || isTransitioning) return;

    setIsTransitioning(true);
    setActiveIndex(nextIndex);
    setCarouselPosition((position) => position + direction);
    setIsDetailsOpen(false);
  };

  const handleCaseSwipe = (_, info) => {
    if (isTransitioning || Math.abs(info.offset.x) < 50 || caseStudies.length < 2) return;

    changeCase(info.offset.x < 0 ? 1 : -1);
  };

  const handleTrackAnimationComplete = () => {
    if (isTrackResetting) {
      setIsTrackResetting(false);
      setIsTransitioning(false);
      return;
    }

    if (caseStudies.length < 2) {
      setIsTransitioning(false);
      return;
    }

    if (carouselPosition >= caseStudies.length * 2) {
      setIsTrackResetting(true);
      setCarouselPosition(caseStudies.length);
    } else if (carouselPosition < caseStudies.length) {
      setIsTrackResetting(true);
      setCarouselPosition(caseStudies.length * 2 - 1);
    } else {
      setIsTransitioning(false);
    }
  };

  const carouselItems = caseStudies.length > 1
    ? [...caseStudies, ...caseStudies, ...caseStudies]
    : caseStudies;

  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (!carouselElement) return undefined;

    const updateCarouselSize = () => {
      const width = carouselElement.clientWidth;
      setCarouselWidth(width);
      setSlideWidth(Math.min(400, Math.max(1, width)));
    };

    updateCarouselSize();
    const resizeObserver = new ResizeObserver(updateCarouselSize);
    resizeObserver.observe(carouselElement);

    return () => resizeObserver.disconnect();
  }, [isLoading, caseStudies.length]);

  const trackOffset = carouselWidth / 2 - slideWidth / 2 - carouselPosition * slideWidth;

  return (
    <section
      className="relative min-h-[900px] overflow-hidden bg-deep-navy bg-[length:100%_100%] bg-center bg-no-repeat px-4 py-10 text-white [content-visibility:auto] [contain-intrinsic-size:900px] [font-family:Arial,sans-serif] sm:min-h-[760px] sm:px-6 sm:py-20 lg:min-h-[700px] lg:px-8"
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
          <div
            ref={carouselRef}
            className="relative mx-auto min-h-[460px] w-full max-w-[1000px] overflow-hidden sm:min-h-[600px]"
          >
              <button
                aria-label="Studi kasus sebelumnya"
                className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-2 border-hot-pink bg-deep-navy text-white transition hover:border-orange hover:bg-orange hover:text-deep-navy disabled:opacity-40 sm:left-4"
                title="Studi kasus sebelumnya"
                type="button"
                onClick={() => changeCase(-1)}
                disabled={caseStudies.length < 2}
              >
                <FaArrowLeft aria-hidden="true" />
              </button>
              <button
                aria-label="Studi kasus berikutnya"
                className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-2 border-hot-pink bg-deep-navy text-white transition hover:border-orange hover:bg-orange hover:text-deep-navy disabled:opacity-40 sm:right-4"
                title="Studi kasus berikutnya"
                type="button"
                onClick={() => changeCase(1)}
                disabled={caseStudies.length < 2}
              >
                <FaArrowRight aria-hidden="true" />
              </button>
            <motion.div
              className="flex w-max items-start"
              animate={{ x: trackOffset }}
              transition={{ duration: isTrackResetting ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={handleTrackAnimationComplete}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={handleCaseSwipe}
            >
              {carouselItems.map((caseStudy, index) => (
                <PortfolioCard
                  key={`${caseStudy.id}-${index}`}
                  caseStudy={caseStudy}
                  caseStudies={caseStudies}
                  activeIndex={activeIndex}
                  isActive={index === carouselPosition}
                  onSelect={(nextIndex) => {
                    setActiveIndex(nextIndex);
                    setCarouselPosition(caseStudies.length + nextIndex);
                    setIsDetailsOpen(false);
                  }}
                  onDetails={() => {
                    const selectedIndex = caseStudies.findIndex((item) => item.id === caseStudy.id);
                    setActiveIndex(selectedIndex);
                    setCarouselPosition(caseStudies.length + selectedIndex);
                    setIsDetailsOpen(true);
                  }}
                />
              ))}
            </motion.div>
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
                  href={activeCase.instagram.startsWith("http")
                    ? activeCase.instagram
                    : `https://instagram.com/${activeCase.instagram.replace(/^@/, "")}`}
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
