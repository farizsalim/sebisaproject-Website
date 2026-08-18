"use client";

import Image from "next/image";
import { motion } from "motion/react";

function LogoCard({ client, index }) {
  return (
    <div className="flex h-36 w-[80vw] shrink-0 items-center justify-center p-2 sm:h-40 sm:w-[33.333vw] sm:p-3 lg:h-48 lg:w-[20vw] lg:p-4">
      <Image
        src={client.logoPath}
        alt={client.name || `Logo mitra Sebisa Project ${index + 1}`}
        width={320}
        height={240}
        className="h-full w-full object-contain opacity-90"
      />
    </div>
  );
}

export default function ClientsSection({ content, clients = [] }) {
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
            {content?.eyebrow}
          </p>
          <h2 className="max-w-xl text-2xl font-black uppercase leading-[1.02] tracking-tight [text-shadow:3px_3px_0_var(--brand-blue-light)] sm:text-4xl lg:text-[44px]">
            {content?.titleBeforeHighlight} <span className="text-orange">{content?.titleHighlight}</span> {content?.titleAfterHighlight}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            {content?.description}
          </p>
        </motion.div>

        <div className="mt-10 overflow-hidden py-4">
          <div className="clients-marquee flex w-max">
            {[...clients, ...clients].map((client, index) => (
              <LogoCard key={`${client.id}-${index}`} client={client} index={index % clients.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}