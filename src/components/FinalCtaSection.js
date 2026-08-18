"use client";

import { motion } from "motion/react";
import ScrollLink from "@/components/ScrollLink";

export default function FinalCtaSection({ content }) {
  return (
    <section
      className="brand-light-gradient relative overflow-hidden px-4 py-16 text-deep-navy [content-visibility:auto] [contain-intrinsic-size:500px] [font-family:Arial,sans-serif] sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="brand-top-line absolute inset-x-0 top-0 h-1" />
      <motion.div
        className="relative z-10 mx-auto max-w-3xl text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-deep-navy sm:text-sm">
          {content?.eyebrow}
        </p>
        <h2 className="text-3xl font-black uppercase leading-[1.02] tracking-tight [text-shadow:3px_3px_0_var(--brand-blue-light)] sm:text-5xl lg:text-[52px]">
          {content?.titleBeforeHighlight} <span className="text-orange">{content?.titleHighlight}</span> {content?.titleAfterHighlight}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
          {content?.description}
        </p>
        <motion.div
          className="mt-8 inline-flex"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <ScrollLink className="inline-flex items-center justify-center border-2 border-deep-navy bg-orange px-7 py-4 text-sm font-black uppercase tracking-[0.08em] text-deep-navy shadow-[4px_4px_0_var(--brand-hot-pink)] transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-[6px_6px_0_var(--brand-hot-pink)]" href="#konsultasi">
            {content?.button}
          </ScrollLink>
        </motion.div>
      </motion.div>
    </section>
  );
}