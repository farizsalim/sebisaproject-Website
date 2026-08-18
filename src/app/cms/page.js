import { auth } from "@/auth";
import CmsSidebar from "@/components/cms/CmsSidebar";
import { redirect } from "next/navigation";

const overviewItems = [
  { label: "Total konten", value: "--", note: "Belum terhubung" },
  { label: "Layanan aktif", value: "--", note: "Belum terhubung" },
  { label: "Anggota tim", value: "--", note: "Belum terhubung" },
  { label: "Pengunjung", value: "--", note: "Belum terhubung" },
];

export const metadata = {
  title: "Dashboard CMS | Sebisa Project",
};

export default async function CmsDashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-brand-surface text-deep-navy">
      <CmsSidebar />

      <main className="min-h-screen lg:pl-72">
        <div className="brand-top-line h-2" />
        <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-20 sm:px-8 lg:px-10 lg:pt-10">
          <header className="flex flex-col justify-between gap-5 border-b-2 border-deep-navy/10 pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">
                Overview
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Dashboard
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                Pantau dan kelola aset digital Sebisa Project dari satu ruang kerja.
              </p>
            </div>
            <div className="border-2 border-deep-navy bg-orange px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-deep-navy shadow-[3px_3px_0_var(--brand-hot-pink)]">
              CMS Sebisa Project
            </div>
          </header>

          <section className="mt-8" aria-labelledby="statistik-title">
            <div className="flex items-center justify-between gap-4">
              <h2 id="statistik-title" className="text-xl font-black">
                Statistik
              </h2>
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                Segera tersedia
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {overviewItems.map((item, index) => (
                <article
                  className="border-2 border-deep-navy/10 bg-white p-5 shadow-[3px_3px_0_var(--brand-blue-light)]"
                  key={item.label}
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-bold text-slate-600">{item.label}</p>
                    <span className={`h-3 w-3 ${index % 2 === 0 ? "bg-brand-blue" : "bg-hot-pink"}`} />
                  </div>
                  <p className="mt-6 text-4xl font-black text-deep-navy">{item.value}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                    {item.note}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="border-2 border-deep-navy bg-white p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">
                Aktivitas terbaru
              </p>
              <h2 className="mt-3 text-2xl font-black">Belum ada aktivitas</h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">
                Aktivitas pengelolaan konten akan muncul di area ini setelah modul CMS mulai digunakan.
              </p>
            </div>
            <div className="brand-about-gradient border-2 border-deep-navy p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-deep-navy">
                Status sistem
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="h-3 w-3 bg-orange" />
                <p className="text-lg font-black">Siap dikembangkan</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Modul konten, layanan, tim, dan media dapat ditambahkan dari sidebar.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
