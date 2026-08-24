"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

function LogoCard({ client, index }) {
  return (
    <div className="flex h-36 w-[80vw] shrink-0 items-center justify-center p-2 sm:h-40 sm:w-[33.333vw] sm:p-3 lg:h-48 lg:w-[20vw] lg:p-4">
      <Image
        src={client.logoPath}
        alt={client.name || `Logo mitra Sebisa Project ${index + 1}`}
        width={320}
        height={240}
        className="h-full w-full object-contain opacity-95"
        style={{
          filter: "drop-shadow(1px 0 0 rgb(255 255 255 / 82%)) drop-shadow(-1px 0 0 rgb(255 255 255 / 82%)) drop-shadow(0 1px 0 rgb(255 255 255 / 82%)) drop-shadow(0 -1px 0 rgb(255 255 255 / 82%))",
        }}
      />
    </div>
  );
}

export default function ClientsSection({ content, clients = [] }) {
  const logoRailRef = useRef(null);
  const isDraggingRef = useRef(false);
  const pointerStartRef = useRef(0);
  const scrollStartRef = useRef(0);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const rail = logoRailRef.current;
    if (!rail || clients.length < 2) return undefined;

    const animate = () => {
      if (!isDraggingRef.current) {
        rail.scrollLeft += 0.45;

        if (rail.scrollLeft >= rail.scrollWidth / 2) {
          rail.scrollLeft = 0;
        }
      }

      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(animationFrameRef.current);
  }, [clients.length]);

  const handlePointerDown = (event) => {
    const rail = logoRailRef.current;
    if (!rail) return;

    isDraggingRef.current = true;
    pointerStartRef.current = event.clientX;
    scrollStartRef.current = rail.scrollLeft;
    rail.setPointerCapture(event.pointerId);
    rail.classList.add("cursor-grabbing");
  };

  const handlePointerMove = (event) => {
    const rail = logoRailRef.current;
    if (!rail || !isDraggingRef.current) return;

    rail.scrollLeft = scrollStartRef.current - (event.clientX - pointerStartRef.current);
  };

  const handlePointerEnd = (event) => {
    const rail = logoRailRef.current;
    isDraggingRef.current = false;
    rail?.releasePointerCapture(event.pointerId);
    rail?.classList.remove("cursor-grabbing");
  };

  return (
    <section
      id="mitra"
      className="relative overflow-hidden bg-deep-navy bg-cover bg-center px-4 py-16 text-white [content-visibility:auto] [contain-intrinsic-size:700px] sm:px-6 sm:py-24 lg:px-8"
      style={{ backgroundImage: "url('/images/Portofolio.png')" }}
    >
      <div className="brand-photo-overlay absolute inset-0" />
      <div className="brand-top-line absolute inset-x-0 top-0 h-1" />
      <div className="relative z-10 mx-auto max-w-[1240px]">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-orange sm:text-sm">
            {content?.eyebrow}
          </p>
          <h2 className="max-w-xl text-3xl font-black uppercase leading-[0.98] tracking-[-0.04em] sm:text-5xl lg:text-[54px]">
            {content?.titleBeforeHighlight} <span className="text-orange">{content?.titleHighlight}</span> {content?.titleAfterHighlight}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
            {content?.description}
          </p>
        </motion.div>

        <div
          ref={logoRailRef}
          className="mt-10 cursor-grab touch-pan-y overflow-x-auto overflow-y-hidden py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onPointerCancel={handlePointerEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
        >
          <div className="flex w-max select-none">
            {[...clients, ...clients].map((client, index) => (
              <LogoCard key={`${client.id}-${index}`} client={client} index={index % clients.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}