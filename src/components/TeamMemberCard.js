"use client";

import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function TeamMemberCard({ member, index }) {
  return (
    <article className="group" tabIndex={0}>
      <div className="relative overflow-hidden rounded-[26px] border-2 border-brand-panel/70 bg-white transition-all duration-300 ease-out md:group-hover:-translate-y-1 md:group-hover:border-4 md:group-hover:border-orange md:group-hover:shadow-[0_22px_45px_rgb(23_36_61_/_14%)]">
        <div className="absolute left-3 top-3 z-20 flex h-9 min-w-9 items-center justify-center rounded-full border border-white/50 bg-deep-navy/80 px-2 text-[9px] font-black tracking-[0.15em] text-white shadow-lg backdrop-blur-md">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="relative aspect-square overflow-hidden">
          {member.image ? (
            <Image
              src={member.image}
              alt={`Foto ${member.name}`}
              fill
              priority={index === 0}
              sizes="(max-width: 640px) 76vw, (max-width: 1024px) 300px, 320px"
              className="object-cover transition-[filter,transform] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] md:group-hover:brightness-75"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-brand-surface-blue text-5xl font-black text-deep-navy">
              {getInitials(member.name)}
            </div>
          )}
        </div>

        <div className="h-[3px] w-0 bg-orange transition-all duration-500 ease-out md:group-hover:w-full" />
      </div>

      <div className="pb-2 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-[20px] font-black leading-tight tracking-[-0.035em] text-deep-navy transition-colors duration-300 md:group-hover:text-brand-blue">
              {member.name}
            </h3>
            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-hot-pink">
              {member.role}
            </p>
          </div>
          <span className="hidden shrink-0 pt-1 text-[10px] font-black tracking-[0.14em] text-deep-navy/25 sm:block">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {member.description ? (
          <div className="max-h-0 overflow-hidden rounded-xl border border-transparent bg-deep-navy px-3 text-white opacity-0 transition-[max-height,opacity,padding] duration-500 ease-out md:group-focus:max-h-40 md:group-focus:pb-4 md:group-focus:pt-3 md:group-focus:opacity-100 md:group-hover:max-h-40 md:group-hover:pb-4 md:group-hover:pt-3 md:group-hover:opacity-100">
            <p className="text-xs leading-[1.7] text-white/80">{member.description}</p>
          </div>
        ) : null}

        <div className="mt-4 inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.14em] text-deep-navy md:hidden">
          View profile <FaArrowRight className="-rotate-45 text-[10px]" />
        </div>
      </div>
    </article>
  );
}
