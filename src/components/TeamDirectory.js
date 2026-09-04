"use client";

import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function MemberCard({ member, index }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/15 bg-deep-navy p-3 text-white shadow-[0_18px_35px_rgb(23_36_61_/_18%)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_42px_rgb(23_36_61_/_25%)]">
      <div className="relative mb-4 aspect-[0.88] overflow-hidden rounded-xl border border-white/10 bg-brand-surface-alt">
        {member.image ? (
          <Image
            src={member.image}
            alt={`Foto ${member.name}`}
            fill
            sizes="(max-width: 640px) 86vw, (max-width: 1024px) 310px, 340px"
            className="object-cover grayscale-[15%] transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#E5F7FD_0%,#81CEEF_100%)] text-4xl font-black text-deep-navy">
            {getInitials(member.name)}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-deep-navy/85 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-orange">
          {member.role}
        </div>
      </div>
      <div className="relative flex items-start gap-4">
        <div className="min-w-0 pt-1">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-hot-pink">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-1 text-base font-black leading-tight sm:text-lg">
            {member.name}
          </h3>
          <p className="mt-2 text-xs leading-5 text-white/65">
            {member.description}
          </p>
        </div>
      </div>
    </article>
  );
}

function TeamCarousel({ team }) {
  const membersRailRef = useRef(null);

  const scrollMembers = (direction) => {
    membersRailRef.current?.scrollBy({
      left: direction * 340,
      behavior: "smooth",
    });
  };

  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-4 border-l-4 border-orange pl-4">
        <div className="min-w-0 max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-hot-pink">
              Studio unit
            </p>
            <h2 className="text-2xl font-black uppercase leading-tight text-deep-navy sm:text-3xl">
              {team.name}
            </h2>
            <span className="border border-deep-navy/20 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-deep-navy">
              {team.members.length} anggota
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{team.description}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            aria-label={`${team.name} sebelumnya`}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-deep-navy text-deep-navy transition hover:border-orange hover:bg-orange"
            title={`${team.name} sebelumnya`}
            type="button"
            onClick={() => scrollMembers(-1)}
          >
            <FaArrowLeft aria-hidden="true" />
          </button>
          <button
            aria-label={`${team.name} berikutnya`}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-deep-navy text-deep-navy transition hover:border-orange hover:bg-orange"
            title={`${team.name} berikutnya`}
            type="button"
            onClick={() => scrollMembers(1)}
          >
            <FaArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        ref={membersRailRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {team.members.map((member, index) => (
          <div
            className="w-[min(86vw,320px)] shrink-0 snap-start sm:w-[310px] lg:w-[340px]"
            key={member.name}
          >
            <MemberCard member={member} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function TeamDirectory({ initialTeams = [] }) {
  const [teams, setTeams] = useState(initialTeams);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <p className="py-16 text-center text-slate-500">Memuat data tim...</p>;
  }

  if (error) {
    return <p className="py-16 text-center font-bold text-orange">{error}</p>;
  }

  return (
    <div className="space-y-16">
      {teams.map((team) => (
        <TeamCarousel key={team.name} team={team} />
      ))}
    </div>
  );
}
