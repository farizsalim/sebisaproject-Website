import { auth } from "@/auth";
import CmsSidebar from "@/components/cms/CmsSidebar";
import { getClients, getServices } from "@/lib/content/siteContent";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaArrowRight, FaBriefcase, FaMoneyBillTransfer, FaTicket, FaUsers } from "react-icons/fa6";

export const metadata = {
  title: "Dashboard CMS | Sebisa Project",
};

export default async function CmsDashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const [serviceGroups, clients, transactionCount] = await Promise.all([
    getServices(),
    getClients(),
    prisma.paymentOrder.count().catch(() => 0),
  ]);
  const overviewItems = [
    { label: "Mitra tampil", value: clients.length, note: "Logo di website", href: "/cms/clients" },
    { label: "Layanan aktif", value: serviceGroups.reduce((total, group) => total + group.services.length, 0), note: `${serviceGroups.length} kategori`, href: "/cms/services" },
    { label: "Total transaksi", value: transactionCount, note: "Semua status", href: "/cms/payments/transactions" },
  ];

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
            <div className="rounded-full border border-deep-navy bg-orange px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-deep-navy shadow-[0_8px_20px_rgb(23_36_61_/_14%)]">
              CMS Sebisa Project
            </div>
          </header>

          <section className="mt-8" aria-labelledby="statistik-title">
            <div className="flex items-center justify-between gap-4">
              <h2 id="statistik-title" className="text-xl font-black">
                Statistik
              </h2>
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                Data saat ini
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {overviewItems.map((item, index) => (
                <Link
                  className="group rounded-2xl border border-deep-navy/10 bg-white p-5 shadow-[0_12px_28px_rgb(23_36_61_/_8%)] transition hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-[0_16px_32px_rgb(23_36_61_/_12%)]"
                  href={item.href}
                  key={item.label}
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-bold text-slate-600">{item.label}</p>
                    <span className={`h-3 w-3 transition group-hover:scale-125 ${index % 2 === 0 ? "bg-brand-blue" : "bg-hot-pink"}`} />
                  </div>
                  <p className="mt-6 text-4xl font-black text-deep-navy">{item.value}</p>
                  <div className="mt-2 flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">{item.note}</p><FaArrowRight className="text-brand-blue opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" aria-hidden="true" /></div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8" aria-labelledby="akses-cepat-title">
            <div className="flex items-center justify-between gap-4"><h2 id="akses-cepat-title" className="text-xl font-black">Akses cepat</h2><span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Kerja harian</span></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Edit layanan", note: "Harga dan isi paket", href: "/cms/services", icon: FaBriefcase, tone: "bg-orange" },
                { label: "Kelola mitra", note: "Logo yang tampil di website", href: "/cms/clients", icon: FaUsers, tone: "bg-brand-blue text-white" },
                { label: "Buat kupon", note: "Atur promo baru", href: "/cms/coupons", icon: FaTicket, tone: "bg-hot-pink" },
                { label: "Cek transaksi", note: "Pantau pembayaran", href: "/cms/payments/transactions", icon: FaMoneyBillTransfer, tone: "bg-deep-navy text-white" },
              ].map((action) => { const ActionIcon = action.icon; return <Link className="group flex items-center gap-3 rounded-xl border border-deep-navy/10 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-blue/40" href={action.href} key={action.label}><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${action.tone}`}><ActionIcon aria-hidden="true" /></span><span className="min-w-0"><span className="block text-sm font-black">{action.label}</span><span className="mt-1 block text-xs text-slate-500">{action.note}</span></span><FaArrowRight className="ml-auto shrink-0 text-brand-blue opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" aria-hidden="true" /></Link>; })}
            </div>
          </section>

          <section className="mt-8 grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="rounded-2xl border border-deep-navy/10 bg-white p-6 shadow-[0_12px_28px_rgb(23_36_61_/_8%)] sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">
                Aktivitas terbaru
              </p>
              <h2 className="mt-3 text-2xl font-black">Kelola bagian yang paling penting</h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">
                Gunakan Website untuk mengelola kuis dan logo mitra. Gunakan Penjualan untuk mengelola paket, promo, serta transaksi pelanggan.
              </p>
            </div>
            <div className="brand-about-gradient rounded-2xl border border-deep-navy/10 p-6 shadow-[0_12px_28px_rgb(23_36_61_/_8%)] sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-deep-navy">
                Status sistem
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="h-3 w-3 bg-orange" />
                <p className="text-lg font-black">Semua modul siap digunakan</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Pilih menu di sidebar untuk mulai mengelola website atau operasional penjualan.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
