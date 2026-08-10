"use client";

import Image from "next/image";
import { motion } from "motion/react";

const clientLogos = [
  "kz6ioaghyw3kmkvwz7yk.png",
  "maikqfdco0mdqzdes9rk.png",
  "nmbmqpznqsnxkomctlcq.png",
  "nw93zb4qxwurzf7ft3xh.png",
  "os8tcp9nik7wsad6ue14.png",
  "oxxaqqf8bnu3fsesyaik.png",
  "qji75vzy0hugwukj6pqk.png",
  "qufzwby9ewkq3wxg4spa.png",
  "rukhngiy5u7svcw7mrw5.png",
  "tkhe4seypxp6rnfhzevq.png",
  "udm67fgb1gepoojgoaaw.png",
  "xfzma5xqnnbx5xhfjszd.png",
  "xwebvnwgflzm1gcmlhek.png",
  "yemqrqcwtcoxyxytubtv.png",
  "zjraydlxceah8cbwedzd.png",
];

function LogoCard({ logo, index }) {
  return (
    <div className="flex h-36 w-[80vw] shrink-0 items-center justify-center p-2 sm:h-40 sm:w-[33.333vw] sm:p-3 lg:h-48 lg:w-[20vw] lg:p-4">
      <Image
        src={`/Client/${logo}`}
        alt={`Logo mitra Sebisa Project ${index + 1}`}
        width={320}
        height={240}
        className="h-full w-full object-contain opacity-90"
      />
    </div>
  );
}

export default function ClientsSection() {
  return (
    <section
      id="mitra"
      className="brand-clients-gradient relative overflow-hidden px-4 py-12 text-deep-navy [content-visibility:auto] [contain-intrinsic-size:700px] [font-family:Arial,sans-serif] sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="brand-top-line absolute inset-x-0 top-0 h-1" />
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-deep-navy sm:text-sm">
            Mitra Sebisa Project
          </p>
          <h2 className="max-w-xl text-2xl font-black uppercase leading-[1.02] tracking-tight [text-shadow:3px_3px_0_var(--brand-blue-light)] sm:text-4xl lg:text-[44px]">
            Mereka yang pernah <span className="text-orange">bertumbuh</span> bersama kami.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Setiap logo membawa cerita, kebutuhan, dan tantangan yang kami bantu
            kerjakan bersama.
          </p>
        </motion.div>

        <div className="mt-10 overflow-hidden py-4">
          <div className="clients-marquee flex w-max">
            {[...clientLogos, ...clientLogos].map((logo, index) => (
              <LogoCard key={`${logo}-${index}`} logo={logo} index={index % clientLogos.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}