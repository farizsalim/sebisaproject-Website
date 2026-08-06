"use client";

import Image from "next/image";
import { motion } from "motion/react";

const clientLogos = [
  "kz6ioaghyw3kmkvwz7yk.jpg",
  "maikqfdco0mdqzdes9rk.jpg",
  "nmbmqpznqsnxkomctlcq.png",
  "nw93zb4qxwurzf7ft3xh.jpg",
  "os8tcp9nik7wsad6ue14.jpg",
  "oxxaqqf8bnu3fsesyaik.png",
  "qji75vzy0hugwukj6pqk.jpg",
  "qufzwby9ewkq3wxg4spa.jpg",
  "rukhngiy5u7svcw7mrw5.png",
  "tkhe4seypxp6rnfhzevq.png",
  "udm67fgb1gepoojgoaaw.png",
  "xfzma5xqnnbx5xhfjszd.jpg",
  "xwebvnwgflzm1gcmlhek.jpg",
  "yemqrqcwtcoxyxytubtv.jpg",
  "zjraydlxceah8cbwedzd.jpg",
];

export default function ClientsSection() {
  return (
    <section
      id="mitra"
      className="relative overflow-hidden bg-[#f7f9fc] px-4 py-12 text-[#00132d] [font-family:Arial,sans-serif] sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#17E9E5_0%,#FBCD2F_50%,#DF00A8_100%)]" />
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#00AFC1] sm:text-sm">
            Mitra Sebisa Project
          </p>
          <h2 className="max-w-xl text-2xl font-black leading-tight sm:text-4xl">
            Mereka yang pernah bertumbuh bersama kami.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Setiap logo membawa cerita, kebutuhan, dan tantangan yang kami bantu
            kerjakan bersama.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.12 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.055 } },
          }}
        >
          {clientLogos.map((logo, index) => (
            <motion.div
              key={logo}
              className="group flex h-28 items-center justify-center border border-[#00132d]/10 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#17E9E5] hover:shadow-[0_10px_24px_rgba(0,19,45,0.1)] sm:h-32"
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <Image
                src={`/Client/${logo}`}
                alt={`Logo mitra Sebisa Project ${index + 1}`}
                width={220}
                height={140}
                className="h-full w-full object-contain grayscale opacity-65 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}