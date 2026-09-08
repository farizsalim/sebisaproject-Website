"use client";

import { motion } from "motion/react";
import { createPortal } from "react-dom";
import { FaCheck, FaDownload, FaWhatsapp, FaXmark } from "react-icons/fa6";
import CheckoutProgress from "@/components/services/CheckoutProgress";
import { getCurrentServicePrice, getPaymentConfirmationLink, getServiceBenefits, formatCurrency, paymentMethodOptions } from "@/components/services/serviceHelpers";
import { downloadInvoiceAsPng } from "@/components/services/invoice";

export default function ServiceCheckoutModal({
  service,
  isCheckoutStep,
  paymentDetails,
  customer,
  setCustomer,
  couponCode,
  setCouponCode,
  couponPreview,
  isApplyingCoupon,
  paymentMethod,
  setPaymentMethod,
  paymentError,
  isCreatingPayment,
  onStartPayment,
  onApplyCoupon,
  onContinueCheckout,
  onClose,
}) {
  if (!service || typeof document === "undefined") return null;
  const benefits = getServiceBenefits(service.description, service.benefits);
  const isPaid = ["SETTLEMENT", "CAPTURE"].includes(paymentDetails?.status);

  return createPortal(
    (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-deep-navy/75 p-3 backdrop-blur-sm sm:p-4" role="dialog" aria-modal="true" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <motion.div className="relative flex h-[calc(100dvh-1.5rem)] max-h-[720px] w-full min-h-0 flex-col overflow-hidden rounded-[26px] bg-brand-surface text-deep-navy shadow-2xl sm:h-[92dvh] sm:max-w-xl" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
        <div className="flex justify-center pb-1 pt-2.5 sm:hidden"><span className="h-1 w-9 rounded-full bg-deep-navy/15" /></div>
        <div className="relative shrink-0 border-b border-deep-navy/10 px-5 pb-4 pt-2 sm:px-7 sm:pb-5 sm:pt-6">
          <button aria-label="Tutup" className="absolute right-4 top-2 flex h-9 w-9 items-center justify-center rounded-full text-deep-navy/60 transition hover:bg-hot-pink hover:text-white sm:right-5 sm:top-5" type="button" onClick={onClose}><FaXmark /></button>
          <p className="pr-12 text-[8px] font-black uppercase tracking-[0.16em] text-brand-blue">{service.category}</p>
          <h2 className="mt-1 pr-12 text-[22px] font-black leading-[1.08] tracking-[-0.025em] sm:text-3xl">{service.name}</h2>
          <CheckoutProgress isCheckoutStep={isCheckoutStep} paymentDetails={paymentDetails} />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-4 sm:px-7 sm:pb-7">
          {!isCheckoutStep && <>
            <div className="rounded-[16px] bg-brand-surface-alt p-4"><div className="flex items-end justify-between gap-4"><div>{service.originalPrice && <p className="text-[10px] font-bold text-deep-navy/35 line-through">{service.originalPrice}</p>}<p className="mt-1 text-[26px] font-black leading-none tracking-[-0.04em] text-brand-blue">{getCurrentServicePrice(service)}</p></div><p className="max-w-[120px] text-right text-[10px] font-bold leading-4 text-deep-navy/50">{service.duration || "Sesuai kebutuhan"}</p></div></div>
            <p className="mt-4 text-[12px] leading-5 text-brand-muted">{service.description}</p>
            <div className="mt-5"><p className="text-xs font-black">Yang kamu dapat</p><ul className="mt-2.5 grid gap-2">{benefits.map((benefit) => <li className="flex items-start gap-2.5 rounded-xl border border-deep-navy/10 p-3" key={benefit}><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-blue/10"><FaCheck className="text-[8px] text-brand-blue" /></span><span className="text-[12px] font-bold leading-5 text-deep-navy/70">{benefit}</span></li>)}</ul></div>
            <button className="mt-5 min-h-11 w-full rounded-full bg-orange px-5 text-[12px] font-black text-deep-navy transition hover:bg-brand-blue hover:text-white disabled:opacity-60" disabled={!service.id} type="button" onClick={onContinueCheckout}>Beli layanan ini</button>
            <a className="mt-2.5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-deep-navy/20 px-5 text-[11px] font-black transition hover:border-[#25D366] hover:bg-[#25D366] hover:text-white" href={`https://wa.me/6280000000000?text=${encodeURIComponent(`Halo Sebisa Project, saya ingin bertanya tentang layanan berikut: ${service.name}`)}`} rel="noreferrer" target="_blank"><FaWhatsapp />Tanya lewat WhatsApp</a>
          </>}
          {isCheckoutStep && !paymentDetails && <form className="grid gap-4" onSubmit={onStartPayment}>
            <div><p className="text-sm font-black">Data pembeli</p><p className="mt-1 text-[11px] leading-5 text-brand-muted">Data digunakan untuk transaksi dan konfirmasi layanan.</p></div>
            {[['name','Nama lengkap','name','text'],['email','Email','email','email'],['phone','WhatsApp','tel','tel']].map(([field,label,autocomplete,type]) => <label className="grid gap-1.5" key={field}><span className="text-[11px] font-bold">{label}</span><input required autoComplete={autocomplete} type={type} className="min-h-12 rounded-xl border border-deep-navy/15 px-4 text-[16px] outline-none focus:border-brand-blue" value={customer[field]} onChange={(event) => setCustomer({ ...customer, [field]: event.target.value })} /></label>)}
            <label className="grid gap-1.5"><span className="text-[11px] font-bold">Kupon</span><div className="flex gap-2"><input className="min-h-12 min-w-0 flex-1 rounded-xl border border-deep-navy/15 px-4 text-[16px] uppercase outline-none focus:border-brand-blue" value={couponCode} onChange={(event) => { setCouponCode(event.target.value.toUpperCase()); }} /><button className="rounded-xl border border-deep-navy px-4 text-[10px] font-black transition hover:bg-orange disabled:opacity-60" type="button" disabled={isApplyingCoupon || couponCode.trim().length < 3} onClick={onApplyCoupon}>{isApplyingCoupon ? "Cek..." : "Pakai"}</button></div></label>
            {couponPreview && <div className="grid gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[11px]"><div className="flex justify-between"><span>Harga layanan</span><span>{formatCurrency(couponPreview.originalAmount)}</span></div><div className="flex justify-between text-emerald-700"><span>Diskon</span><span>-{formatCurrency(couponPreview.discountAmount)}</span></div><div className="flex justify-between border-t border-emerald-200 pt-2 text-sm font-black"><span>Total</span><span>{formatCurrency(couponPreview.totalAmount)}</span></div></div>}
            <fieldset><legend className="text-sm font-black">Metode pembayaran</legend><div className="mt-2 grid gap-2 sm:grid-cols-2">{paymentMethodOptions.map((option) => { const Icon = option.icon; const selected = paymentMethod === option.value; return <label className={`flex min-h-[62px] cursor-pointer items-center gap-3 rounded-xl border p-2.5 ${selected ? "border-brand-blue bg-brand-blue/10 ring-2 ring-brand-blue/15" : "border-deep-navy/12"}`} key={option.value}><input className="sr-only" type="radio" name="payment" checked={selected} onChange={() => setPaymentMethod(option.value)} /><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${option.tone}`}><Icon /></span><span><span className="block text-[10px] font-black">{option.mark}</span><span className="block truncate text-[9px] text-slate-500">{option.label}</span></span></label>; })}</div></fieldset>
            {paymentError && <p className="rounded-xl bg-hot-pink/10 p-3 text-[11px] font-bold">{paymentError}</p>}
            <button className="min-h-12 rounded-full bg-orange px-5 text-[12px] font-black text-deep-navy transition hover:bg-brand-blue hover:text-white disabled:opacity-60" disabled={isCreatingPayment || !service.id} type="submit">{isCreatingPayment ? "Menyiapkan pembayaran..." : "Lanjut ke pembayaran"}</button>
          </form>}
          {isCheckoutStep && paymentDetails && <div>{isPaid ? <><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700"><FaCheck /></div><h3 className="mt-3 text-center text-xl font-black text-emerald-700">Pembayaran berhasil</h3><div className="mt-5 rounded-2xl border border-deep-navy/10 p-4 text-xs"><div className="flex justify-between gap-4"><span>Order</span><strong>{paymentDetails.orderId}</strong></div><div className="mt-3 flex justify-between gap-4"><span>Total</span><strong>{formatCurrency(paymentDetails.summary?.totalAmount)}</strong></div></div><button className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-orange text-[11px] font-black" type="button" onClick={() => downloadInvoiceAsPng(paymentDetails.summary, paymentDetails.orderId, paymentDetails.paidAt)}><FaDownload />Simpan invoice</button><a className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-[11px] font-black text-white" href={getPaymentConfirmationLink(service, paymentDetails.orderId)} target="_blank" rel="noreferrer"><FaWhatsapp />Konfirmasi WhatsApp</a></> : <div className="rounded-2xl bg-deep-navy p-4 text-white"><p className="text-[9px] font-black uppercase text-white/50">Total pembayaran</p><p className="mt-1 text-xl font-black text-orange">{formatCurrency(paymentDetails.summary?.totalAmount)}</p><p className="mt-2 break-all text-[9px] text-white/40">{paymentDetails.orderId}</p>{paymentDetails.vaNumbers?.map((item) => <div className="mt-4 rounded-xl border border-white/15 p-4" key={item.va_number}><p className="text-[9px] uppercase text-white/50">VA {item.bank}</p><p className="mt-1 text-xl font-black">{item.va_number}</p></div>)}{paymentDetails.actions?.map((action) => action?.url && <a className="mt-4 flex min-h-11 w-full items-center justify-center rounded-full bg-orange text-[11px] font-black text-deep-navy" href={action.url} target="_blank" rel="noreferrer" key={action.url}>{action.name.includes("qr") ? <img className="h-60 w-60" src={action.url} alt="QR pembayaran" /> : "Lanjutkan pembayaran"}</a>)}</div>}</div>}
        </div>
      </motion.div>
    </div>
    ),
    document.body
  );
}
