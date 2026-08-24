import { auth } from "@/auth";
import CmsSidebar from "@/components/cms/CmsSidebar";
import { redirect } from "next/navigation";

export const metadata = { title: "Pengaturan | CMS Sebisa Project" };

export default async function CmsSettingsPage() {
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
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Pengaturan</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Kelola informasi akses akun yang sedang digunakan untuk CMS.
            </p>
          </header>
          <section className="mt-8 max-w-2xl rounded-2xl border border-deep-navy/10 bg-white p-5 shadow-[0_12px_28px_rgb(23_36_61_/_8%)] sm:p-7" aria-labelledby="account-settings-title">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Akun aktif</p>
            <h2 id="account-settings-title" className="mt-2 text-2xl font-black">Informasi akses</h2>
            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-xl bg-brand-surface p-4"><dt className="font-bold text-slate-500">Nama</dt><dd className="mt-1 font-black">{session.user?.name || "-"}</dd></div>
              <div className="rounded-xl bg-brand-surface p-4"><dt className="font-bold text-slate-500">Email</dt><dd className="mt-1 break-all font-black">{session.user?.email || "-"}</dd></div>
              <div className="rounded-xl bg-brand-surface p-4"><dt className="font-bold text-slate-500">Peran</dt><dd className="mt-1 font-black">{session.user?.role || "-"}</dd></div>
            </dl>
            <p className="mt-6 border-l-4 border-orange bg-orange/10 px-4 py-3 text-sm leading-6 text-deep-navy">
              Pengaturan kredensial dan konfigurasi pembayaran tetap dikelola melalui proses keamanan server.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
