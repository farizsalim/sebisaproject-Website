"use client";

import { motion } from "motion/react";
import { FaPlay, FaXmark } from "react-icons/fa6";
import { useEffect, useState } from "react";

function BehindSceneThumbnail({ scene }) {
  return (
    <div className="relative h-full w-full bg-deep-navy">
      {scene.type === "video" ? (
        <video aria-hidden="true" className="h-full w-full object-cover" muted preload="metadata" playsInline src={scene.src} />
      ) : (
        <img alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" src={scene.src} draggable="false" />
      )}
      {scene.type === "video" ? (
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-deep-navy/75 text-sm text-white backdrop-blur-sm">
          <FaPlay aria-hidden="true" className="ml-0.5" />
        </span>
      ) : null}
    </div>
  );
}

export default function BehindScenesSection({ behindScenes = [] }) {
  const [activeScene, setActiveScene] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActiveScene(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeScene ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeScene]);

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
          <div className="mx-auto mt-10 w-full max-w-[780px]">
            <div className="mb-5 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-white/55">
                <span>{behindScenes.length} dokumentasi</span>
                <span className="h-1 w-1 rounded-full bg-orange" aria-hidden="true" />
            </div>
            <div
              aria-label="Galeri behind the scenes"
              className="mx-auto grid max-w-[720px] grid-cols-3 gap-2 sm:gap-3"
              role="list"
            >
            {behindScenes.map((scene, index) => (
              <motion.article
                className="group aspect-square min-w-0 overflow-hidden rounded-lg border border-white/15 bg-white/[0.08] shadow-[0_12px_30px_rgb(0_0_0_/_18%)]"
                key={`${scene.client}-${scene.src}`}
                role="listitem"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <button aria-label={`Buka ${scene.caption || "dokumentasi behind the scenes"}`} className="relative block h-full w-full overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-inset" type="button" onClick={() => setActiveScene(scene)}>
                  <BehindSceneThumbnail scene={scene} />
                  <span className="absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-deep-navy/90 via-deep-navy/40 to-transparent px-3 pb-3 pt-12 text-xs font-bold text-white sm:block sm:px-4 sm:pb-4 sm:text-sm">{scene.caption}</span>
                </button>
              </motion.article>
            ))}
            </div>
          </div>
        ) : (
          <p className="mt-10 text-sm text-white/70">Dokumentasi proses segera hadir.</p>
        )}
      </div>

      {activeScene ? (
        <div aria-labelledby="behind-scene-modal-title" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/90 p-4 backdrop-blur-sm sm:p-6" role="dialog" onClick={() => setActiveScene(null)}>
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/20 bg-deep-navy shadow-[0_20px_70px_rgb(0_0_0_/_45%)]" onClick={(event) => event.stopPropagation()}>
            <button aria-label="Tutup behind the scenes" className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-deep-navy/80 text-white transition hover:bg-orange hover:text-deep-navy" title="Tutup" type="button" onClick={() => setActiveScene(null)}>
              <FaXmark aria-hidden="true" />
            </button>
            <div className="max-h-[75vh] bg-black">
              {activeScene.type === "video" ? (
                <video aria-label={activeScene.alt} autoPlay className="mx-auto max-h-[75vh] w-full object-contain" controls loop playsInline src={activeScene.src} />
              ) : (
                <img alt={activeScene.alt} className="mx-auto max-h-[75vh] w-full object-contain" src={activeScene.src} />
              )}
            </div>
            <div className="border-t border-white/15 px-4 py-4 sm:px-6">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange">Behind the scenes</p>
              <h3 id="behind-scene-modal-title" className="mt-2 text-base font-bold text-white sm:text-lg">{activeScene.caption}</h3>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
