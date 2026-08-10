"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Fragment } from "react";
import ScrollLink from "@/components/ScrollLink";

const headingSegments = [
  { text: "Punya", className: "text-white", spaceAfter: true },
  { text: "Ide Digital", className: "text-orange [text-shadow:3px_3px_0_var(--brand-deep-navy)]", spaceAfter: false },
  { text: "?", className: "text-white", spaceAfter: true },
  { text: "Tapi", className: "text-white", spaceAfter: true },
  { text: "Bingung", className: "text-white", spaceAfter: true },
  { text: "Untuk", className: "text-white", spaceAfter: true },
  { text: "Memulainya?", className: "text-white", spaceAfter: false },
];

export default function Hero() {
  const renderHeadingSegment = (segment, segmentIndex) => (
    <Fragment key={segment.text}>
      <span
        className={`inline-block ${segment.className}`}
        aria-hidden="true"
      >
        {Array.from(segment.text).map((character, characterIndex) => (
          <motion.span
            key={`${segment.text}-${characterIndex}`}
            className="inline-block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.05,
              delay: (segmentIndex * 11 + characterIndex) * 0.02,
              ease: "easeOut",
            }}
          >
            {character === " " ? "\u00a0" : character}
          </motion.span>
        ))}
      </span>
      {segment.spaceAfter ? <span aria-hidden="true">&nbsp;</span> : null}
    </Fragment>
  );

  return (
    <section
      className="relative -mt-[90px] box-border flex min-h-[520px] items-center justify-center overflow-hidden px-4 pb-10 pt-[100px] [font-family:Arial,sans-serif] sm:-mt-[100px] sm:min-h-[600px] sm:px-6 sm:pt-[110px] lg:px-8"
    >
      <Image
        src="/images/Portofolio.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover object-center"
      />
      <div className="brand-hero-overlay absolute inset-0 z-10" />
      <div className="pointer-events-none absolute inset-0 z-10 opacity-60" aria-hidden="true">
        <div className="absolute left-5 top-24 h-24 w-24 border-l-2 border-t-2 border-white/70 sm:left-10 sm:top-32 sm:h-32 sm:w-32" />
        <div className="absolute right-5 top-28 h-20 w-20 border-r-2 border-t-2 border-hot-pink/80 sm:right-12 sm:top-36 sm:h-28 sm:w-28" />
        <div className="absolute bottom-10 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full border border-white/60 sm:bottom-14 sm:h-24 sm:w-24" />
        <div className="absolute bottom-8 left-8 h-px w-20 bg-white/70 sm:left-16 sm:w-32" />
        <div className="absolute bottom-8 right-8 h-px w-20 bg-white/70 sm:right-16 sm:w-32" />
      </div>
      <div className="relative z-20 mx-auto flex w-full max-w-7xl justify-center">
        <div className="max-w-4xl text-center">
          <motion.h1
            aria-label="Punya Ide Digital? Tapi Bingung Untuk Memulainya?"
            className="text-3xl font-black uppercase leading-[1.02] tracking-tight [text-shadow:3px_3px_0_var(--brand-deep-navy)] sm:text-5xl lg:text-[52px]"
            initial={false}
          >
            {headingSegments.map((segment, segmentIndex) => {
              if (segmentIndex === 2) return null;

              if (segmentIndex === 1) {
                return (
                  <span className="inline-block whitespace-nowrap" key="ide-digital-question">
                    {renderHeadingSegment(segment, segmentIndex)}
                    {renderHeadingSegment(headingSegments[2], 2)}
                  </span>
                );
              }

              return renderHeadingSegment(segment, segmentIndex);
            })}
          </motion.h1>

          <div className="mt-7 flex min-h-[70px] w-full flex-col items-center justify-start gap-3 sm:flex-row sm:items-center sm:justify-center">
            <motion.div
              className="inline-flex"
              initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
            >
              <ScrollLink className="inline-flex min-h-[52px] items-center justify-center border-2 border-deep-navy bg-orange px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-deep-navy shadow-[4px_4px_0_var(--brand-deep-navy)] transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-[6px_6px_0_var(--brand-deep-navy)] sm:min-w-[210px]" href="#konsultasi">
                Ayo Kita Mulai !
              </ScrollLink>
            </motion.div>
            <motion.div
              className="inline-flex"
              initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.65, ease: "easeOut" }}
            >
              <ScrollLink className="inline-flex min-h-[52px] items-center justify-center border-2 border-white bg-hot-pink px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[4px_4px_0_var(--brand-deep-navy)] transition duration-200 hover:-translate-y-1 hover:bg-deep-navy hover:shadow-[6px_6px_0_var(--brand-hot-pink)] sm:min-w-[210px]" href="#layanan">
                Pilihan layanan
              </ScrollLink>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}