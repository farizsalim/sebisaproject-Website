"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Fragment } from "react";
import ScrollLink from "@/components/ScrollLink";

export default function Hero({ content }) {
  const headingSegments = content?.headingSegments || [];

  const renderHeadingSegment = (segment, segmentIndex) => (
    <Fragment key={segment.text}>
      <span
        className={`inline-block ${segment.highlight ?? segmentIndex === 1 ? "text-orange" : "text-white"}`}
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
      className="relative -mt-[124px] box-border flex min-h-[600px] items-center justify-center overflow-hidden px-4 pb-16 pt-[120px] sm:-mt-[136px] sm:min-h-[700px] sm:px-6 sm:pt-[130px] lg:px-8"
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
      <div className="relative z-20 mx-auto flex w-full max-w-7xl justify-center">
        <div className="max-w-4xl text-center">
          <motion.h1
            aria-label={headingSegments.map((segment) => segment.text).join(" ")}
            className="max-w-5xl text-4xl font-black uppercase leading-[0.96] tracking-[-0.04em] sm:text-6xl lg:text-[76px]"
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
              <ScrollLink className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-orange px-7 py-4 text-sm font-black uppercase tracking-[0.08em] text-deep-navy transition duration-200 hover:-translate-y-1 hover:bg-white sm:min-w-[210px]" href="#konsultasi">
                {content?.primaryCta}
              </ScrollLink>
            </motion.div>
            <motion.div
              className="inline-flex"
              initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.65, ease: "easeOut" }}
            >
              <ScrollLink className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/60 bg-white/10 px-7 py-4 text-sm font-black uppercase tracking-[0.08em] text-white backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:bg-white hover:text-deep-navy sm:min-w-[210px]" href="#layanan">
                {content?.secondaryCta}
              </ScrollLink>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}