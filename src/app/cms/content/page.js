import { auth } from "@/auth";
import ContentManager from "@/components/cms/ContentManager";
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
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Workspace</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Konten Website</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Kelola tulisan website melalui form sederhana. Struktur section sudah ditentukan dan tidak dapat berubah.
            </p>
          </header>
          <div className="mt-8">
            <ContentManager />
          </div>
        </div>
      </main>
    </div>
  );
}
