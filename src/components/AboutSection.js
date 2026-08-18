"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { FaArrowRight, FaUsers } from "react-icons/fa6";
import { useEffect, useState } from "react";

const TEAM_IMAGE_VERSION = "20260811";

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function AboutSection({ content }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [teamPreview, setTeamPreview] = useState([]);

  useEffect(() => {
    const loadTeamPreview = async () => {
      try {
        const response = await fetch("/data/team.json");
        const teams = await response.json();
        setTeamPreview(teams.flatMap((team) => team.members));
      } catch {
        setTeamPreview([]);
      }
    };

    loadTeamPreview();
  }, []);

  return (
    <section
      id="tentang-kami"
      className="brand-about-gradient relative overflow-hidden px-4 py-14 text-deep-navy [content-visibility:auto] [contain-intrinsic-size:800px] [font-family:Arial,sans-serif] sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="brand-top-line absolute inset-x-0 top-0 z-10 h-1" />
      <div className="relative z-10 mx-auto grid max-w-[1240px] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-deep-navy sm:text-sm">
            {content?.eyebrow}
          </p>
          <h2 className="max-w-3xl text-3xl font-black uppercase leading-[1.02] tracking-tight [text-shadow:3px_3px_0_var(--brand-blue-light)] sm:text-5xl lg:text-[52px]">
            {content?.title}
          </h2>
          <div className="mt-6 max-w-2xl space-y-4 text-sm leading-7 text-brand-muted sm:mt-8 sm:text-base">
            {content?.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {isExpanded ? (
              content?.expandedParagraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : null}
          </div>
          <button
            type="button"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((expanded) => !expanded)}
            className="mt-6 border-b border-brand-blue-light pb-1 text-sm font-bold text-brand-blue transition hover:border-orange hover:text-orange"
          >
            {isExpanded ? content?.readLess : content?.readMore}
          </button>
            <p className="mt-7 border-l-4 border-orange pl-4 text-base font-black leading-6 text-deep-navy sm:text-lg">
            {content?.tagline}
          </p>
        </motion.div>

        <motion.div
          className="relative min-h-[360px] overflow-hidden bg-brand-panel p-5 sm:min-h-[480px] sm:p-8"
          initial={{ opacity: 0, x: 28, scale: 0.97 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[28px] border-brand-blue-light/25" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border-[28px] border-orange/20" />
          <div className="absolute inset-5 border border-deep-navy/15 sm:inset-8" />
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
              <span className="mt-8 border border-white/35 bg-deep-navy/70 px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
                Partner kreatif dan strategis
              </span>
            </div>
          </div>
        </motion.div>
      </div>
      {teamPreview.length > 0 ? (
        <div className="relative z-10 mx-auto mt-14 max-w-[1240px] overflow-hidden border-y border-deep-navy/10 py-7 sm:mt-20">
          <p className="mb-5 text-center text-xs font-black uppercase tracking-[0.22em] text-deep-navy/70">
            Orang-orang di balik Sebisa Project
          </p>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--brand-surface)] to-transparent sm:w-28" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--brand-surface)] to-transparent sm:w-28" />
            <div className="about-team-marquee flex w-max gap-5 hover:[animation-play-state:paused] sm:gap-7">
              {[...teamPreview, ...teamPreview].map((member, index) => (
                <div className="w-[168px] shrink-0 sm:w-[232px]" key={`${member.name}-${index}`}>
                  <div className="relative mx-auto h-40 w-40 overflow-hidden bg-brand-surface-alt sm:h-56 sm:w-56">
                    {member.image ? (
                      <Image
                        src={`${member.image}?v=${TEAM_IMAGE_VERSION}`}
                        alt={`Foto ${member.name}`}
                        fill
                        sizes="224px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-brand-blue-light text-lg font-black text-deep-navy">
                        {getInitials(member.name)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      <div className="relative z-10 mt-8 flex justify-center sm:mt-10">
        <Link
          className="inline-flex min-h-12 items-center gap-3 border-2 border-deep-navy bg-white px-5 py-3 text-sm font-black text-deep-navy shadow-[3px_3px_0_var(--brand-blue-light)] transition hover:-translate-y-0.5 hover:border-hot-pink hover:text-hot-pink"
          href="/tim"
        >
          <FaUsers aria-hidden="true" />
          Kenali lebih dekat
          <FaArrowRight className="ml-auto text-brand-blue" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}