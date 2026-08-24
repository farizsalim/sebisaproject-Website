"use client";

import { motion } from "motion/react";
import { FaPause, FaPlay } from "react-icons/fa6";
import { useRef, useState } from "react";

export default function IntroVideoSection() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleVideo = async () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      await videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  return (
    <section className="relative overflow-hidden bg-brand-surface px-4 py-20 text-deep-navy sm:px-6 sm:py-28 lg:px-8">
      <div className="brand-top-line absolute inset-x-0 top-0 h-1" />
      <div className="mx-auto grid max-w-[1240px] items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-brand-blue sm:text-sm">
            Kenali Sebisa Project
          </p>
          <h2 className="max-w-xl text-4xl font-black uppercase leading-[0.96] tracking-[-0.04em] sm:text-6xl lg:text-[64px]">
            Ide yang baik dimulai dari tim yang tepat.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-brand-muted sm:text-lg">
            Sebisa Project adalah partner kreatif dan strategis untuk membantu bisnis
            membangun identitas, konten, dan pengalaman digital yang lebih kuat.
          </p>
          <p className="mt-5 max-w-lg border-l-4 border-orange pl-4 text-base font-black leading-6 sm:text-lg">
            Lihat cara kami bekerja, berpikir, dan mengubah kebutuhan bisnis menjadi
            karya digital yang bisa bergerak maju.
          </p>
        </motion.div>

        <motion.div
          className="relative w-full overflow-hidden rounded-[4px] border border-deep-navy/15 bg-[#e8e5dc] p-2 shadow-[0_24px_60px_rgb(23_36_61_/_20%)] sm:p-3"
          initial={{ opacity: 0, x: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative aspect-video overflow-hidden rounded-[2px] bg-deep-navy">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full bg-deep-navy object-contain"
              controls
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              preload="metadata"
              playsInline
              src="/data/perkenalan/perkenalan.mp4"
            >
              Browser Anda tidak mendukung pemutaran video.
            </video>
            <button
              aria-label={isPlaying ? "Jeda video perkenalan" : "Putar video perkenalan"}
              className={`absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-orange text-deep-navy shadow-[0_10px_30px_rgb(0_0_0_/_30%)] transition duration-300 hover:scale-105 hover:bg-white sm:h-20 sm:w-20 ${isPlaying ? "pointer-events-none opacity-0" : "opacity-100"}`}
              title={isPlaying ? "Jeda video" : "Putar video"}
              type="button"
              onClick={toggleVideo}
            >
              {isPlaying ? <FaPause aria-hidden="true" /> : <FaPlay aria-hidden="true" className="ml-1" />}
            </button>
            <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/30 bg-deep-navy/65 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-orange" />
              Sebisa Project Film
            </div>
            <div className="pointer-events-none absolute right-4 top-4 text-[10px] font-black tracking-[0.16em] text-white/70">
              01 / 01
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 px-1 pt-3 text-[10px] font-black uppercase tracking-[0.16em] text-deep-navy/60 sm:px-2">
            <span>Perkenalan Sebisa Project</span>
            <span className="text-brand-blue">Watch / Discover</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
