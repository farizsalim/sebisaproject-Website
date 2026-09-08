"use client";

import { useEffect, useState } from "react";
import CombinedTeamDirectory from "@/components/CombinedTeamDirectory";

export default function TeamDirectory({ initialTeams = [] }) {
  const [teams] = useState(initialTeams);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[340px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-deep-navy/15 border-t-orange" />
          <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-muted">
            Memuat tim
          </p>
        </div>
      </div>
    );
  }

  if (!teams.length) {
    return (
      <div className="rounded-[24px] border border-deep-navy/10 bg-white px-6 py-20 text-center">
        <p className="text-lg font-black text-deep-navy">Belum ada data tim.</p>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <CombinedTeamDirectory teams={teams} />
    </div>
  );
}
