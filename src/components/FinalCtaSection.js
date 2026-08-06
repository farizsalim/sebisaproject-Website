"use client";

import { motion } from "motion/react";
import ScrollLink from "@/components/ScrollLink";

export default function FinalCtaSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#00132d] bg-cover bg-center px-4 py-16 text-white [font-family:Arial,sans-serif] sm:px-6 sm:py-24 lg:px-8"
      style={{ backgroundImage: "url('/images/Portofolio.png')" }}
    >
      <div className="absolute inset-0 bg-[#00132d]/85" />
      <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border-[28px] border-[#17E9E5]/15" />
      <motion.div
        className="relative z-10 mx-auto max-w-3xl text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#17E9E5] sm:text-sm">
          Langkah berikutnya
        </p>
        <h2 className="text-3xl font-black leading-tight sm:text-5xl">
          Siap mulai langkah digital pertamamu?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
          Ceritakan kebutuhanmu. Kami bantu menerjemahkan ide menjadi langkah
          yang lebih jelas dan bisa dikerjakan.
        </p>
        <motion.div
          className="mt-8 inline-flex"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <ScrollLink className="inline-flex items-center justify-center bg-[#FBCD2F] px-7 py-4 text-base font-bold text-[#00132d] transition-colors hover:bg-white" href="#konsultasi">
            Konsultasi Sekarang
          </ScrollLink>
        </motion.div>
      </motion.div>
    </section>
  );
}