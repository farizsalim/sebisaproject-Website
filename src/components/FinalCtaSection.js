"use client";

import { motion } from "motion/react";
import Image from "next/image";
import ScrollLink from "@/components/ScrollLink";

export default function FinalCtaSection({ content }) {
  return (
    <section
      className="relative overflow-hidden px-4 py-20 text-white [content-visibility:auto] [contain-intrinsic-size:500px] sm:px-6 sm:py-28 lg:px-8"
    >
      <Image
        src="/images/Portofolio.png"
        alt=""
        fill
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover object-center"
      />
      <div className="brand-hero-overlay absolute inset-0 z-10" />
      <motion.div
        className="relative z-10 mx-auto max-w-3xl text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-orange sm:text-sm">
          {content?.eyebrow}
        </p>
        <h2 className="text-4xl font-black uppercase leading-[0.96] tracking-[-0.04em] sm:text-6xl lg:text-[64px]">
          {content?.titleBeforeHighlight} <span className="text-orange">{content?.titleHighlight}</span> {content?.titleAfterHighlight}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
          {content?.description}
        </p>
        <motion.div
          className="mt-8 inline-flex"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <ScrollLink className="inline-flex items-center justify-center rounded-full bg-orange px-8 py-4 text-sm font-black uppercase tracking-[0.08em] text-deep-navy transition duration-200 hover:-translate-y-1 hover:bg-white" href="#konsultasi">
            {content?.button}
          </ScrollLink>
        </motion.div>
      </motion.div>
    </section>
  );
}