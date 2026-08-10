"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { FaArrowRight, FaGraduationCap, FaUsers } from "react-icons/fa6";
import { useState } from "react";

export default function AboutSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      id="tentang-kami"
      className="relative overflow-hidden bg-[linear-gradient(135deg,#F4FBFE_0%,#DDF4FC_100%)] px-4 py-14 text-[#06466B] [content-visibility:auto] [contain-intrinsic-size:800px] [font-family:Arial,sans-serif] sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="absolute inset-x-0 top-0 z-10 h-1 bg-[linear-gradient(90deg,#21BCFB_0%,#81CEEF_100%)]" />
      <div className="relative z-10 mx-auto grid max-w-[1240px] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#06466B] sm:text-sm">
            Tentang Kami
          </p>
          <h2 className="max-w-3xl text-3xl font-black uppercase leading-[1.02] tracking-tight [text-shadow:3px_3px_0_#81CEEF] sm:text-5xl lg:text-[52px]">
            Perusahaan Penyedia Jasa Digital Profesional Bergaransi
          </h2>
          <div className="mt-6 max-w-2xl space-y-4 text-sm leading-7 text-slate-600 sm:mt-8 sm:text-base">
            <p>
              Sebisa Project adalah partner kreatif dan strategis untuk membantu
              bisnis, brand, dan personal brand tumbuh lebih kuat di era digital.
            </p>
            {isExpanded ? (
              <>
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
              </>
            ) : null}
          </div>
          <button
            type="button"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((expanded) => !expanded)}
            className="mt-6 border-b border-[#81CEEF] pb-1 text-sm font-bold text-[#21BCFB] transition hover:border-[#FF7A18] hover:text-[#FF7A18]"
          >
            {isExpanded ? "Sembunyikan" : "Baca selengkapnya"}
          </button>
            <p className="mt-7 border-l-4 border-[#FF7A18] pl-4 text-base font-black leading-6 text-[#06466B] sm:text-lg">
            Dari Ide Menjadi Realita, Dari Strategi Menjadi Hasil.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              className="inline-flex min-h-12 items-center gap-3 border-2 border-[#06466B] bg-white px-5 py-3 text-sm font-black text-[#06466B] shadow-[3px_3px_0_#81CEEF] transition hover:-translate-y-0.5 hover:border-[#F51686] hover:text-[#F51686]"
              href="/tim"
            >
              <FaUsers aria-hidden="true" />
              Kenalan dengan tim kami
              <FaArrowRight className="ml-auto text-[#21BCFB]" aria-hidden="true" />
            </Link>
            <Link
              className="inline-flex min-h-12 items-center gap-3 border-2 border-[#06466B] bg-white px-5 py-3 text-sm font-black text-[#06466B] shadow-[3px_3px_0_#81CEEF] transition hover:-translate-y-0.5 hover:border-[#F51686] hover:text-[#F51686]"
              href="/karir"
            >
              <FaGraduationCap aria-hidden="true" />
              Lihat program magang
              <FaArrowRight className="ml-auto text-[#21BCFB]" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="relative min-h-[360px] overflow-hidden bg-[#e5eef5] p-5 sm:min-h-[480px] sm:p-8"
          initial={{ opacity: 0, x: 28, scale: 0.97 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[28px] border-[#81CEEF]/25" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border-[28px] border-[#FF7A18]/20" />
          <div className="absolute inset-5 border border-[#06466B]/15 sm:inset-8" />
            <div
              className="relative flex h-full min-h-[320px] flex-col items-center justify-center overflow-hidden bg-cover bg-center p-8 sm:min-h-[416px]"
              style={{ backgroundImage: "url('/images/Portofolio.png')" }}
            >
            <div className="relative z-10 flex flex-col items-center">
              <Image
                src="/images/logo-sebisa-project.png"
                alt="Logo Sebisa Project"
                width={620}
                height={380}
                className=""
                priority={false}
              />
              <span className="mt-8 border border-white/35 bg-[#06466B]/70 px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
                Partner kreatif dan strategis
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}