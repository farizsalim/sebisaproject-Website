"use client";

import { useEffect, useState } from "react";

const statusLabels = {
  SETTLEMENT: "Berhasil",
  CAPTURE: "Berhasil",
  PENDING: "Pending",
  DENY: "Ditolak",
  CANCEL: "Dibatalkan",
  EXPIRE: "Kedaluwarsa",
  REFUND: "Refund",
  UNKNOWN: "Gagal",
};

function formatRupiah(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function statusClass(status) {
  if (["SETTLEMENT", "CAPTURE"].includes(status)) return "bg-emerald-100 text-emerald-800";
  if (status === "PENDING") return "bg-orange/25 text-deep-navy";
  return "bg-hot-pink/15 text-deep-navy";
}

export default function PaymentsManager({ view = "dashboard" }) {
  const [data, setData] = useState({ summary: { successful: 0, pending: 0, failed: 0, successfulAmount: 0, total: 0 }, transactions: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPayments() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cms/payments", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal memuat transaksi.");
      setData(result);
      setError("");
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadPayments(); }, []);

  const { summary, transactions } = data;

  return (
    <div className="min-w-0">
      <header className="flex flex-col justify-between gap-4 border-b-2 border-deep-navy/10 pb-6 sm:flex-row sm:items-end">
        <div><p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Penjualan</p><h1 className="mt-2 text-3xl font-black">{view === "dashboard" ? "Ringkasan pembayaran" : "Transaksi pelanggan"}</h1><p className="mt-2 text-sm leading-6 text-slate-600">Lihat pembayaran yang masuk dan status pesanan pelanggan.</p></div>
        <button className="rounded-full border border-deep-navy bg-orange px-4 py-3 text-xs font-black uppercase tracking-[0.08em]" type="button" onClick={loadPayments}>Muat ulang</button>
      </header>
      {error ? <p className="mt-5 border-l-4 border-hot-pink bg-hot-pink/10 px-4 py-3 text-sm font-bold" role="alert">{error}</p> : null}
      {view === "dashboard" ? <>
        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ringkasan pembayaran">
          <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><p className="text-sm font-bold text-emerald-800">Berhasil</p><p className="mt-4 text-4xl font-black text-emerald-900">{summary.successful}</p><p className="mt-2 text-xs font-bold text-emerald-700">{formatRupiah(summary.successfulAmount)}</p></article>
          <article className="rounded-2xl border border-orange/40 bg-orange/10 p-5"><p className="text-sm font-bold text-deep-navy">Pending</p><p className="mt-4 text-4xl font-black">{summary.pending}</p><p className="mt-2 text-xs font-bold text-slate-500">Menunggu pembayaran</p></article>
          <article className="rounded-2xl border border-hot-pink/25 bg-hot-pink/10 p-5"><p className="text-sm font-bold">Gagal</p><p className="mt-4 text-4xl font-black">{summary.failed}</p><p className="mt-2 text-xs font-bold text-slate-500">Ditolak atau kedaluwarsa</p></article>
          <article className="rounded-2xl border border-deep-navy/10 bg-white p-5"><p className="text-sm font-bold text-slate-600">Total transaksi</p><p className="mt-4 text-4xl font-black">{summary.total}</p><p className="mt-2 text-xs font-bold text-slate-500">Data yang tersedia</p></article>
        </section>
        <section className="mt-8 rounded-2xl border border-deep-navy/10 bg-white p-5 shadow-[0_12px_28px_rgb(23_36_61_/_8%)] sm:p-7"><div className="flex items-center justify-between gap-4"><h2 className="text-xl font-black">Transaksi terbaru</h2><span className="text-xs font-bold text-slate-500">{transactions.slice(0, 5).length} transaksi</span></div><TransactionTable transactions={transactions.slice(0, 5)} isLoading={isLoading} compact /></section>
      </> : <section className="mt-7 rounded-2xl border border-deep-navy/10 bg-white p-4 shadow-[0_12px_28px_rgb(23_36_61_/_8%)] sm:p-7"><TransactionTable transactions={transactions} isLoading={isLoading} /></section>}
    </div>
  );
}

function TransactionTable({ transactions, isLoading, compact = false }) {
  if (isLoading) return <p className="py-10 text-sm text-slate-500">Memuat transaksi...</p>;
  if (!transactions.length) return <p className="py-10 text-sm text-slate-500">Belum ada transaksi pembayaran.</p>;
  return <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[1050px] border-collapse text-left text-sm"><thead><tr className="border-b-2 border-deep-navy/10 text-xs uppercase tracking-[0.08em] text-slate-500"><th className="px-3 py-3">Order / Waktu</th><th className="px-3 py-3">Pembeli</th><th className="px-3 py-3">Layanan</th><th className="px-3 py-3">Harga</th><th className="px-3 py-3">Metode</th><th className="px-3 py-3">Status</th></tr></thead><tbody>{transactions.map((transaction) => <tr className="border-b border-deep-navy/8 align-top" key={transaction.id}><td className="px-3 py-4"><p className="font-black">{transaction.orderId}</p><p className="mt-1 whitespace-nowrap text-xs text-slate-500">{formatDate(transaction.createdAt)}</p></td><td className="px-3 py-4"><p className="font-bold">{transaction.customerName}</p><p className="mt-1 text-xs text-slate-500">{transaction.customerEmail}</p><p className="text-xs text-slate-500">{transaction.customerPhone}</p></td><td className="px-3 py-4"><p className="max-w-[220px] font-bold">{transaction.service}</p>{transaction.couponCode ? <p className="mt-1 text-xs font-bold text-brand-blue">Kupon {transaction.couponCode}</p> : null}</td><td className="whitespace-nowrap px-3 py-4"><p className="font-black">{formatRupiah(transaction.grossAmount)}</p>{transaction.discountAmount ? <p className="mt-1 text-xs text-emerald-700">Hemat {formatRupiah(transaction.discountAmount)}</p> : null}</td><td className="px-3 py-4 text-xs font-bold uppercase">{transaction.paymentType || "-"}</td><td className="px-3 py-4"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusClass(transaction.status)}`}>{statusLabels[transaction.status] || transaction.status}</span>{transaction.paidAt ? <p className="mt-2 whitespace-nowrap text-xs text-slate-500">Bayar {formatDate(transaction.paidAt)}</p> : null}</td></tr>)}</tbody></table>{compact ? null : <p className="mt-4 text-xs text-slate-500">Menampilkan maksimal 500 transaksi terbaru.</p>}</div>;
}
