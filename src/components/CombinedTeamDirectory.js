"use client";

import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import TeamMemberCard from "@/components/TeamMemberCard";

export default function CombinedTeamDirectory({ teams }) {
  const pageSize = 8;
  const [pageStart, setPageStart] = useState(0);
  const allMembers = teams.flatMap((team) =>
    (team.members || []).map((member) => ({ ...member, teamName: team.name }))
  );
  const visibleMembers = allMembers.slice(pageStart, pageStart + pageSize);
  const lastPageStart = Math.max(
    0,
    Math.floor((allMembers.length - 1) / pageSize) * pageSize
  );
  const canPrev = pageStart > 0;
  const canNext = pageStart < lastPageStart;

  const movePage = (direction) => {
    setPageStart((current) =>
      Math.min(lastPageStart, Math.max(0, current + direction * pageSize))
    );
  };

  return (
    <div className="relative bg-brand-surface">
      <div className="mx-auto max-w-[1240px] px-4 pb-0 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
        <div className="mb-8 flex justify-end">
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!canPrev}
              onClick={() => movePage(-1)}
              aria-label="Lihat anggota sebelumnya"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-deep-navy/20 text-deep-navy transition hover:-translate-y-0.5 hover:bg-deep-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
            >
              <FaArrowLeft />
            </button>
            <button
              type="button"
              disabled={!canNext}
              onClick={() => movePage(1)}
              aria-label="Lihat anggota berikutnya"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-deep-navy text-white transition hover:-translate-y-0.5 hover:bg-brand-blue disabled:cursor-not-allowed disabled:opacity-25"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {visibleMembers.map((member, index) => (
            <div key={`${member.teamName}-${member.name}-${pageStart + index}`} className="min-w-0">
              <TeamMemberCard member={member} index={pageStart + index} />
            </div>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between border-t border-deep-navy/10 pt-4 text-[10px] font-black uppercase tracking-[0.14em] text-deep-navy/45">
          <span>Geser 8 anggota</span>
          <span>{Math.floor(pageStart / pageSize) + 1} / {Math.max(1, Math.ceil(allMembers.length / pageSize))}</span>
        </div>
      </div>
    </div>
  );
}
