import { auth } from "@/auth";
import CmsSidebar from "@/components/cms/CmsSidebar";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Konten Website | CMS Sebisa Project",
};

export default async function CmsContentPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-brand-surface text-deep-navy">
      <CmsSidebar />
      <main className="min-h-screen lg:pl-72">
        <div className="brand-top-line h-2" />
        <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-20 sm:px-8 lg:px-10 lg:pt-10">
          <header className="border-b-2 border-deep-navy/10 pb-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Website</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Konten website tetap</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Tulisan utama website dijaga tetap konsisten oleh tim. Gunakan menu Website untuk mengelola kuis konsultasi dan logo mitra.
            </p>
          </header>
          <div className="mt-8">
            <div className="rounded-2xl border border-deep-navy/10 bg-white p-6 text-sm leading-6 text-slate-600 shadow-[0_12px_28px_rgb(23_36_61_/_8%)] sm:p-8">
              <p className="font-black text-deep-navy">Tidak ada yang perlu diubah di sini.</p>
              <p className="mt-2">Teks inti website sudah diatur oleh tim agar tampil konsisten. Untuk perubahan yang sering dilakukan, buka menu Kuis konsultasi atau Mitra.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
