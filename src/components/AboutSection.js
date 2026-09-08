"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { FaArrowRight, FaUsers } from "react-icons/fa6";
import { useState } from "react";

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

export default function AboutSection({ content, teams = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const teamPreview = teams.flatMap((team) => team.members || []);
  const visibleTeamMembers = teamPreview;

  return (
    <section
      id="tentang-kami"
      className="relative overflow-hidden bg-deep-navy bg-cover bg-center px-4 py-20 text-white [content-visibility:auto] [contain-intrinsic-size:800px] sm:px-6 sm:py-28 lg:px-8"
      style={{ backgroundImage: "url('/images/Portofolio.png')" }}
    >
      <div className="brand-photo-overlay absolute inset-0" />
      <div className="brand-top-line absolute inset-x-0 top-0 z-10 h-1" />
      <div className="relative z-10 mx-auto grid max-w-[1240px] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-orange sm:text-sm">
            {content?.eyebrow}
          </p>
          <h2 className="max-w-3xl text-4xl font-black uppercase leading-[0.96] tracking-[-0.04em] sm:text-6xl lg:text-[64px]">
            {content?.title}
          </h2>
          <div className="mt-6 max-w-2xl space-y-4 text-sm leading-7 text-white/80 sm:mt-8 sm:text-base">
            {content?.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {isExpanded ? (
              content?.expandedParagraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : null}
          </div>
          <button
            type="button"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((expanded) => !expanded)}
            className="mt-6 border-b border-brand-blue-light pb-1 text-sm font-bold text-brand-blue-light transition hover:border-orange hover:text-orange"
          >
            {isExpanded ? content?.readLess : content?.readMore}
          </button>
            <p className="mt-7 border-l-4 border-orange pl-4 text-base font-black leading-6 text-white sm:text-lg">
            {content?.tagline}
          </p>
        </motion.div>

        <motion.div
          className="relative min-h-[360px] overflow-hidden rounded-2xl border border-white/15 bg-deep-navy/40 p-3 shadow-[0_18px_40px_rgb(0_0_0_/_18%)] sm:min-h-[480px] sm:p-5"
          initial={{ opacity: 0, x: 28, scale: 0.97 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[28px] border-brand-blue-light/25" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border-[28px] border-orange/20" />
          <div className="absolute inset-5 rounded-xl border border-white/20 sm:inset-8" />
            <div
              className="relative flex h-full min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-xl bg-cover bg-center p-8 sm:min-h-[416px]"
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
      {visibleTeamMembers.length > 0 ? (
        <div className="relative z-10 mx-auto mt-14 max-w-[1240px] overflow-hidden border-y border-white/20 py-7 sm:mt-20">
          <div className="mb-5 flex flex-col gap-2 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/70">
                Orang-orang di balik Sebisa Project
              </p>
              <p className="mt-1 text-sm text-white/55">
                Kenali peran yang membuat setiap project bergerak.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-orange">
              {teamPreview.length} anggota · geser untuk menjelajah
            </span>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--brand-deep-navy)] to-transparent sm:w-28" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--brand-deep-navy)] to-transparent sm:w-28" />
            <div className="about-team-marquee flex w-max gap-5 hover:[animation-play-state:paused] sm:gap-7">
              {[...visibleTeamMembers, ...visibleTeamMembers].map((member, index) => (
                <article
                  className="team-stroke-card group relative w-[168px] shrink-0 overflow-visible rounded-xl border-[5px] border-brand-panel bg-deep-navy/50 transition-[border-color] duration-200 hover:border-transparent focus:border-transparent sm:w-[232px]"
                  key={`${member.name}-${index}`}
                  tabIndex="0"
                  aria-label={`${member.name}, ${member.role}`}
                >
                  <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-[calc(0.75rem-5px)] bg-brand-surface-alt sm:h-56 sm:w-56">
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
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep-navy via-deep-navy/90 to-transparent px-3 pb-3 pt-12 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100 sm:px-4 sm:pb-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.14em] text-orange">
                      {member.role}
                    </p>
                    <h3 className="mt-1 truncate text-sm font-black sm:text-base">
                      {member.name}
                    </h3>
                    {member.description ? (
                      <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-white/70 sm:text-xs">
                        {member.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      <div className="relative z-10 mt-8 flex justify-center sm:mt-10">
        <Link
          className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/40 bg-white px-6 py-3 text-sm font-black text-deep-navy transition hover:-translate-y-0.5 hover:bg-orange"
          href="/tim"
        >
          <FaUsers aria-hidden="true" />
          Kenali tim kami lebih dekat
          <FaArrowRight className="ml-auto text-brand-blue" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}