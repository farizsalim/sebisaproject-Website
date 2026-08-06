"use client";

import { motion } from "motion/react";

const consultationSteps = [
  {
    number: "01",
    title: "Kenali kebutuhanmu",
    description:
      "Jawab beberapa pertanyaan singkat tentang ide, tantangan, dan tujuan digitalmu.",
  },
  {
    number: "02",
    title: "Pilih yang paling sesuai",
    description:
      "Tentukan pilihan yang paling menggambarkan kebutuhan dan cara kerja yang kamu inginkan.",
  },
  {
    number: "03",
    title: "Dapatkan arah solusi",
    description:
      "Jawabanmu membantu kami menyusun rekomendasi layanan yang lebih relevan dan terarah.",
  },
  {
    number: "04",
    title: "Mulai konsultasi",
    description:
      "Bawa hasilnya ke sesi konsultasi bersama tim Sebisa Project untuk langkah selanjutnya.",
  },
];

export default function ConsultationSection() {
  return (
    <section
      id="konsultasi"
      className="relative overflow-hidden bg-[#f7f9fc] px-6 py-20 [font-family:Arial,sans-serif] sm:py-24 lg:px-8"
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-1 origin-left bg-[linear-gradient(90deg,#17E9E5_0%,#DF00A8_50%,#FFB400_100%)]"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#d5a900]">
            Konsultasi layanan
          </p>
          <motion.h2
            className="text-3xl font-black leading-tight text-[#00132d] sm:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            Konsultasi <motion.span
              className="inline-block text-[#FBCD2F]"
              whileHover={{ scale: 1.06, rotate: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
            >cerdas</motion.span> untuk
            langkah digital yang lebih jelas.
          </motion.h2>
          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
            Tidak perlu langsung tahu harus mulai dari mana. Jawab pertanyaan
            sederhana, lalu temukan layanan yang paling sesuai dengan kebutuhanmu.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 md:grid-cols-4 md:gap-5">
          {consultationSteps.map((step, index) => (
            <motion.article
              key={step.number}
              className="relative border-t-2 border-[#FBCD2F] pt-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ y: -6 }}
            >
              <motion.span
                className={`inline-block text-sm font-bold tracking-[0.15em] ${
                  index % 2 === 1 ? "text-[#DF00A8]" : "text-[#00AFC1]"
                }`}
                whileHover={{ scale: 1.12, x: 3 }}
                transition={{ type: "spring", stiffness: 300, damping: 16 }}
              >
                {step.number}
              </motion.span>
              <h3 className="mt-4 text-xl font-bold text-[#00132d]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {step.description}
              </p>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="mt-14 flex justify-center"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <motion.a
            className="inline-flex items-center justify-center bg-[#FBCD2F] px-6 py-4 text-base font-bold text-[#00132d] transition hover:bg-[#00132d] hover:text-white"
            href="#mulai-konsultasi"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            Mulai Konsultasi
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}