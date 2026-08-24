import { auth } from "@/auth";
import CmsSidebar from "@/components/cms/CmsSidebar";
import QuizManager from "@/components/cms/QuizManager";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Kuis Konsultasi | CMS Sebisa Project",
};

export default async function CmsQuizPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-brand-surface text-deep-navy">
      <CmsSidebar />
      <main className="min-h-screen min-w-0 lg:pl-72">
        <div className="brand-top-line h-2" />
        <div className="mx-auto min-w-0 max-w-[1440px] overflow-hidden px-5 pb-12 pt-20 sm:px-8 lg:px-10 lg:pt-10">
          <header className="border-b-2 border-deep-navy/10 pb-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Website</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Kuis Konsultasi</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Buat pertanyaan yang membantu pengunjung menemukan paket yang paling sesuai.
            </p>
          </header>
          <div className="mt-8"><QuizManager /></div>
        </div>
      </main>
    </div>
  );
}
