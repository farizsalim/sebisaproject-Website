"use client";

import axios from "axios";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";

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

function MemberCard({ member, index }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-deep-navy/15 bg-white p-4 text-deep-navy shadow-[0_16px_35px_rgb(23_36_61_/_12%)] transition duration-200 hover:-translate-y-1 hover:border-orange hover:shadow-[0_20px_40px_rgb(239_93_168_/_22%)]">
      <div className="relative mb-4 aspect-square overflow-hidden rounded-xl border border-deep-navy/10 bg-brand-surface-alt">
        {member.image ? (
          <Image
            src={`${member.image}?v=${TEAM_IMAGE_VERSION}`}
            alt={`Foto ${member.name}`}
            fill
            sizes="(max-width: 640px) 86vw, (max-width: 1024px) 310px, 340px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#E5F7FD_0%,#81CEEF_100%)] text-4xl font-black text-deep-navy">
            {getInitials(member.name)}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-deep-navy/70 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white">
          {member.role}
        </div>
      </div>
      <div className="relative flex items-start gap-4">
        <div className="min-w-0 pt-1">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-1 text-sm font-black leading-tight sm:text-base">
            {member.name}
          </h3>
          <p className="mt-2 text-xs leading-5 text-slate-600">
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
            <h2 className="text-2xl font-black uppercase leading-tight text-deep-navy sm:text-3xl">
              {team.name}
            </h2>
            <span className="rounded-full bg-hot-pink px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
              {team.members.length} anggota
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{team.description}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            aria-label={`${team.name} sebelumnya`}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-hot-pink text-deep-navy transition hover:border-orange hover:bg-orange"
            title={`${team.name} sebelumnya`}
            type="button"
            onClick={() => scrollMembers(-1)}
          >
            <FaArrowLeft aria-hidden="true" />
          </button>
          <button
            aria-label={`${team.name} berikutnya`}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-hot-pink text-deep-navy transition hover:border-orange hover:bg-orange"
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

export default function TeamDirectory() {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await axios.get("/data/team.json");
        setTeams(response.data);
      } catch {
        setError("Data tim belum dapat dimuat.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTeams();
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
