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
        className={`inline-block ${segment.highlight ?? segmentIndex === 1 ? "text-orange [text-shadow:3px_3px_0_var(--brand-deep-navy)]" : "text-white"}`}
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
      <div className="relative z-20 mx-auto flex w-full max-w-7xl justify-center">
        <div className="max-w-4xl text-center">
          <motion.h1
            aria-label={headingSegments.map((segment) => segment.text).join(" ")}
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
                {content?.primaryCta}
              </ScrollLink>
            </motion.div>
            <motion.div
              className="inline-flex"
              initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.65, ease: "easeOut" }}
            >
              <ScrollLink className="inline-flex min-h-[52px] items-center justify-center border-2 border-white bg-hot-pink px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[4px_4px_0_var(--brand-deep-navy)] transition duration-200 hover:-translate-y-1 hover:bg-deep-navy hover:shadow-[6px_6px_0_var(--brand-hot-pink)] sm:min-w-[210px]" href="#layanan">
                {content?.secondaryCta}
              </ScrollLink>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}