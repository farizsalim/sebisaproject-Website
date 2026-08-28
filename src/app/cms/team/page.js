import { auth } from "@/auth";
import TeamManager from "@/components/cms/TeamManager";
import CmsSidebar from "@/components/cms/CmsSidebar";
import { redirect } from "next/navigation";

export const metadata = { title: "Team | CMS Sebisa Project" };

export default async function CmsTeamPage() {
  if (!await auth()) redirect("/login");
  return <div className="min-h-screen bg-brand-surface text-deep-navy"><CmsSidebar /><main className="min-h-screen lg:pl-72"><div className="brand-top-line h-2" /><div className="mx-auto max-w-[1440px] px-5 pb-12 pt-20 sm:px-8 lg:px-10 lg:pt-10"><header className="border-b-2 border-deep-navy/10 pb-8"><p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Website</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Team</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Kelola divisi, anggota, dan foto team yang tampil di website.</p></header><div className="mt-8"><TeamManager /></div></div></main></div>;
}
