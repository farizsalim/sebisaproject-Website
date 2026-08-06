"use client";

import { motion } from "motion/react";
import { FaComments, FaCompass, FaLightbulb, FaListCheck } from "react-icons/fa6";
import ScrollLink from "@/components/ScrollLink";

const consultationSteps = [
  {
    number: "01",
    icon: FaLightbulb,
    title: "Jawab pertanyaan singkat",
    description:
      "Ceritakan ide, tantangan, dan tujuan digitalmu lewat beberapa pertanyaan sederhana.",
  },
  {
    number: "02",
    icon: FaListCheck,
    title: "Dapatkan rekomendasi layanan",
    description:
      "Jawabanmu akan membantu mengarahkanmu ke layanan yang paling sesuai dengan kebutuhanmu.",
  },
  {
    number: "03",
    icon: FaCompass,
    title: "Pahami langkah berikutnya",
    description:
      "Lihat gambaran solusi dan pilihan langkah yang bisa kamu ambil bersama Sebisa Project.",
  },
  {
    number: "04",
    icon: FaComments,
    title: "Butuh diskusi lebih lanjut?",
    description:
      "Setelah melihat rekomendasi, kamu bisa melanjutkan diskusi dengan admin Sebisa Project melalui WhatsApp.",
  },
];

function ConsultationStep({ step, index }) {
  const StepIcon = step.icon;

  return (
    <motion.article
      className="relative border-t-2 border-[#FBCD2F] pt-4"
      initial={{ opacity: 0, y: -8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{ y: -6 }}
    >
      <div className="relative z-10 flex w-fit items-center gap-3 bg-[#f7f9fc] pr-3">
        <span className="flex h-9 w-9 items-center justify-center border border-[#00132d]/15 bg-[#f7f9fc] text-[#17aeb0]">
          <StepIcon aria-hidden="true" />
        </span>
        <motion.span
          className={`inline-block text-sm font-bold tracking-[0.15em] ${
            index % 2 === 1 ? "text-[#DF00A8]" : "text-[#00AFC1]"
          }`}
          whileHover={{ scale: 1.12, x: 3 }}
          transition={{ type: "spring", stiffness: 300, damping: 16 }}
        >
          {step.number}
        </motion.span>
      </div>
      <h3 className="mt-4 text-xl font-bold text-[#00132d]">{step.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
    </motion.article>
  );
}

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
        viewport={{ once: false }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#d5a900]">
            Konsultasi layanan
          </p>
          <motion.h2
            className="text-3xl font-black leading-tight text-[#00132d] sm:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            Jawab, temukan, lalu <motion.span
              className="inline-block text-[#FBCD2F]"
              whileHover={{ scale: 1.06, rotate: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
            >mulai</motion.span> dengan arah yang lebih jelas.
          </motion.h2>
          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
            Tidak perlu menebak harus mulai dari mana. Isi identitas singkat,
            jawab beberapa pertanyaan, lalu dapatkan rekomendasi layanan yang
            sesuai dengan kebutuhanmu.
          </p>
        </motion.div>

        <div className="relative mt-14 grid gap-8 md:grid-cols-4 md:gap-5">
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-[#00132d]/15 md:block" />
          {consultationSteps.map((step, index) => (
            <ConsultationStep key={step.number} step={step} index={index} />
          ))}
        </div>

        <motion.div
          className="mt-14 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            <ScrollLink
              className="inline-flex items-center justify-center bg-[#FBCD2F] px-6 py-4 text-base font-bold text-[#00132d] transition hover:bg-[#00132d] hover:text-white"
              href="#konsultasi"
              aria-label="Mulai konsultasi"
            >
              Mulai Konsultasi
            </ScrollLink>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}