"use client";

import { motion } from "motion/react";
import ScrollLink from "@/components/ScrollLink";

export default function FinalCtaSection() {
  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(180deg,#F4FBFE_0%,#E5F7FD_100%)] px-4 py-16 text-[#06466B] [content-visibility:auto] [contain-intrinsic-size:500px] [font-family:Arial,sans-serif] sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#21BCFB_0%,#81CEEF_100%)]" />
      <motion.div
        className="relative z-10 mx-auto max-w-3xl text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#06466B] sm:text-sm">
          Langkah berikutnya
        </p>
        <h2 className="text-3xl font-black uppercase leading-[1.02] tracking-tight [text-shadow:3px_3px_0_#81CEEF] sm:text-5xl lg:text-[52px]">
          Siap <span className="text-[#FF7A18]">mulai</span> langkah digital pertamamu?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
          Ceritakan kebutuhanmu. Kami bantu menerjemahkan ide menjadi langkah
          yang lebih jelas dan bisa dikerjakan.
        </p>
        <motion.div
          className="mt-8 inline-flex"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <ScrollLink className="inline-flex items-center justify-center border-2 border-[#06466B] bg-[#FF7A18] px-7 py-4 text-sm font-black uppercase tracking-[0.08em] text-[#06466B] shadow-[4px_4px_0_#F51686] transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-[6px_6px_0_#F51686]" href="#konsultasi">
            Konsultasi Sekarang
          </ScrollLink>
        </motion.div>
      </motion.div>
    </section>
  );
}