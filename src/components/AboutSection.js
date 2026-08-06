"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function AboutSection() {
  return (
    <section
      id="tentang-kami"
      className="relative overflow-hidden bg-[#00132d] bg-cover bg-center px-4 py-14 text-white [font-family:Arial,sans-serif] sm:px-6 sm:py-24 lg:px-8"
      style={{ backgroundImage: "url('/images/Portofolio.png')" }}
    >
      <div className="absolute inset-0 bg-[#00132d]/80" />
      <div className="absolute inset-x-0 top-0 z-10 h-1 bg-[linear-gradient(90deg,#17E9E5_0%,#FBCD2F_50%,#DF00A8_100%)]" />
      <div className="relative z-10 mx-auto grid max-w-[1240px] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#00AFC1] sm:text-sm">
            Tentang Kami
          </p>
          <h2 className="max-w-3xl text-3xl font-black leading-[1.08] sm:text-5xl">
            Perusahaan Penyedia Jasa Digital Profesional Bergaransi
          </h2>
          <div className="mt-6 max-w-2xl space-y-4 text-sm leading-7 text-white/70 sm:mt-8 sm:text-base">
            <p>
              Sebisa Project hadir sebagai partner kreatif dan strategis untuk
              membantu bisnis, brand, maupun personal brand berkembang lebih
              cepat di era digital. Kami percaya setiap ide besar layak
              diwujudkan dengan eksekusi yang tepat, desain yang menarik, serta
              strategi yang menghasilkan dampak nyata.
            </p>
            <p>
              Kami melayani kebutuhan B2B maupun B2C, mulai dari pengembangan
              branding, desain kreatif, produksi konten, pengelolaan social
              media, iklan digital, pembuatan website, hingga solusi bisnis
              yang disesuaikan dengan kebutuhan Anda.
            </p>
            <p>
              Dengan pendekatan profesional, fleksibel, dan berorientasi hasil,
              kami tidak hanya mengerjakan proyek, tetapi membangun hubungan
              kerja sama jangka panjang yang saling menguntungkan.
            </p>
          </div>
          <p className="mt-7 border-l-4 border-[#FBCD2F] pl-4 text-base font-black leading-6 text-white sm:text-lg">
            Dari Ide Menjadi Realita, Dari Strategi Menjadi Hasil.
          </p>
        </motion.div>

        <motion.div
          className="relative min-h-[360px] overflow-hidden bg-[#00264d] p-5 sm:min-h-[480px] sm:p-8"
          initial={{ opacity: 0, x: 28, scale: 0.97 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[28px] border-[#17E9E5]/15" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border-[28px] border-[#FBCD2F]/20" />
          <div className="absolute inset-5 border border-white/15 sm:inset-8" />
          <div className="relative flex h-full min-h-[320px] flex-col items-center justify-center bg-[#00132d] p-8 sm:min-h-[416px]">
            <Image
              src="/images/logo-sebisa-project.png"
              alt="Logo Sebisa Project"
              width={420}
              height={180}
              className="h-auto w-full max-w-[300px] object-contain"
              priority={false}
            />
            <span className="mt-8 border border-white/20 px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/65">
              Partner kreatif dan strategis
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}