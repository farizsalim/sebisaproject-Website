"use client";

import axios from "axios";
import { motion } from "motion/react";
import { FaArrowLeft, FaArrowRight, FaPause, FaPlay } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";

function BehindSceneVideo({ scene }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoElement, setVideoElement] = useState(null);

  const toggleVideo = async () => {
    if (!videoElement) return;

    if (videoElement.paused) {
      await videoElement.play();
    } else {
      videoElement.pause();
    }
  };

  const handleVideoPlay = (event) => {
    document.querySelectorAll("[data-behind-scenes-video]").forEach((video) => {
      if (video !== event.currentTarget) video.pause();
    });
    setIsPlaying(true);
  };

  return (
    <>
      <video
        aria-label={scene.alt}
        className="h-full w-full bg-deep-navy object-contain"
        controls
        data-behind-scenes-video
        loop
        muted
        onPause={() => setIsPlaying(false)}
        onPlay={handleVideoPlay}
        preload="metadata"
        playsInline
        ref={setVideoElement}
        src={scene.src}
      />
      <button
        aria-label={isPlaying ? "Jeda video behind the scenes" : "Putar video behind the scenes"}
        className={`absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-orange text-deep-navy shadow-[0_10px_30px_rgb(0_0_0_/_30%)] transition duration-300 hover:scale-105 hover:bg-white sm:h-16 sm:w-16 ${isPlaying ? "pointer-events-none opacity-0" : "opacity-100"}`}
        title={isPlaying ? "Jeda video" : "Putar video"}
        type="button"
        onClick={toggleVideo}
      >
        {isPlaying ? <FaPause aria-hidden="true" /> : <FaPlay aria-hidden="true" className="ml-1" />}
      </button>
    </>
  );
}

export default function BehindScenesSection() {
  const [behindScenes, setBehindScenes] = useState([]);
  const behindScenesRailRef = useRef(null);

  const scrollBehindScenes = (direction) => {
    const rail = behindScenesRailRef.current;
    if (!rail) return;

    behindScenesRailRef.current?.scrollBy({
      left: direction * Math.max(320, rail.clientWidth * 0.82),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const loadBehindScenes = async () => {
      try {
        const response = await axios.get("/data/case-studies.json");
        const items = response.data.flatMap((project) =>
          project.media
            .filter((media) => media.channel.toLowerCase().includes("behind"))
            .map((media) => ({ ...media, client: project.client })),
        );
        setBehindScenes(items);
      } catch {
        setBehindScenes([]);
      }
    };

    loadBehindScenes();
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-deep-navy bg-cover bg-center px-4 py-20 text-white sm:px-6 sm:py-28 lg:px-8"
      style={{ backgroundImage: "url('/images/Portofolio.png')" }}
    >
      <div className="brand-photo-overlay absolute inset-0" />
      <div className="brand-top-line absolute inset-x-0 top-0 h-1" />
      <div className="relative z-10 mx-auto max-w-[1240px]">
        <motion.div
          className="max-w-3xl border-b border-white/20 pb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-orange sm:text-sm">
              Behind the Scenes
            </p>
            <h2 className="max-w-3xl text-4xl font-black uppercase leading-[0.96] tracking-[-0.04em] sm:text-6xl lg:text-[60px]">
              Di balik setiap karya, ada proses yang berarti.
            </h2>
          </div>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
            Intip momen saat tim Sebisa menyiapkan ide, mengatur detail, dan
            menghidupkan cerita brand di lapangan.
          </p>
        </motion.div>

        {behindScenes.length > 0 ? (
          <div className="mt-10">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-white/55">
                <span>{behindScenes.length} dokumentasi</span>
                <span className="h-1 w-1 rounded-full bg-orange" aria-hidden="true" />
                <span className="hidden sm:inline">Geser untuk melihat proses lainnya</span>
              </div>
              <div className="flex gap-2">
              <button
                aria-label="Behind the scenes sebelumnya"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:-translate-y-0.5 hover:border-orange hover:bg-orange hover:text-deep-navy disabled:cursor-not-allowed disabled:opacity-35"
                title="Behind the scenes sebelumnya"
                type="button"
                onClick={() => scrollBehindScenes(-1)}
                disabled={behindScenes.length < 2}
              >
                <FaArrowLeft aria-hidden="true" />
              </button>
              <button
                aria-label="Behind the scenes berikutnya"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:-translate-y-0.5 hover:border-orange hover:bg-orange hover:text-deep-navy disabled:cursor-not-allowed disabled:opacity-35"
                title="Behind the scenes berikutnya"
                type="button"
                onClick={() => scrollBehindScenes(1)}
                disabled={behindScenes.length < 2}
              >
                <FaArrowRight aria-hidden="true" />
              </button>
              </div>
            </div>
            <div
              ref={behindScenesRailRef}
              aria-label="Carousel behind the scenes"
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6 sm:px-3"
              role="list"
            >
            {behindScenes.map((scene, index) => (
              <motion.article
                className="group flex w-[min(86vw,540px)] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-white/15 bg-white/[0.08] shadow-[0_18px_45px_rgb(0_0_0_/_20%)] backdrop-blur-sm"
                key={`${scene.client}-${scene.src}`}
                role="listitem"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <div className="relative aspect-video overflow-hidden bg-deep-navy">
                  {scene.type === "video" ? (
                    <BehindSceneVideo scene={scene} />
                  ) : (
                    <img
                      alt={scene.alt}
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                      src={scene.src}
                      draggable="false"
                    />
                  )}
                </div>
                <div className="flex min-h-[104px] flex-1 flex-col justify-between gap-4 border-t border-white/15 px-4 py-4 sm:px-5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange">{scene.channel}</p>
                    <p className="mt-2 text-sm font-bold leading-5 text-white sm:text-base">{scene.caption}</p>
                  </div>
                  <span className="w-fit rounded-full border border-brand-blue-light/40 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-brand-blue-light">
                    {scene.client}
                  </span>
                </div>
              </motion.article>
            ))}
            </div>
          </div>
        ) : (
          <p className="mt-10 text-sm text-white/70">Dokumentasi proses segera hadir.</p>
        )}
      </div>
    </section>
  );
}
