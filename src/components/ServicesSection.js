"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaChartLine } from "react-icons/fa6";
import ScrollLink from "@/components/ScrollLink";
import { FlashSaleCard, ServiceCard } from "@/components/services/ServiceCards";
import ServiceCheckoutModal from "@/components/services/ServiceCheckoutModal";
import { getServiceBenefits, isFlashSaleActive } from "@/components/services/serviceHelpers";

export default function ServicesSection({ content }) {
  const [serviceGroups, setServiceGroups] = useState(content || []);
  const [activeCategories, setActiveCategories] = useState([]);
  const [recommendedServiceNames, setRecommendedServiceNames] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [couponCode, setCouponCode] = useState("");
  const [couponPreview, setCouponPreview] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const flashSaleRailRef = useRef(null);
  const serviceRailRef = useRef(null);

  useEffect(() => {
    setServiceGroups(content || []);
    setIsLoading(false);
    setError(content ? "" : "Daftar layanan belum dapat dimuat.");
  }, [content]);

  useEffect(() => {
    const applyServiceFilter = (event) => {
      const names = event.detail || [];
      const catalog = (serviceGroups || []).flatMap((group) => (group.services || []).map((service) => ({ ...service, category: group.category })));
      setRecommendedServiceNames(names);
      setActiveCategories([...new Set(catalog.filter((service) => names.includes(service.name)).map((service) => service.category))]);
    };
    window.addEventListener("service-filter-change", applyServiceFilter);
    const query = new URLSearchParams(window.location.search).get("serviceFilter");
    if (query) applyServiceFilter({ detail: query.split("|").filter(Boolean) });
    return () => window.removeEventListener("service-filter-change", applyServiceFilter);
  }, [serviceGroups]);

  useEffect(() => {
    if (!selectedService) return undefined;
    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event) => event.key === "Escape" && closeModal();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedService]);

  const services = useMemo(() => (serviceGroups || []).flatMap((group) => (group.services || []).map((service) => ({ ...service, category: group.category }))), [serviceGroups]);
  const flashSaleServices = services.filter(isFlashSaleActive);
  const filteredServices = recommendedServiceNames.length
    ? services.filter((service) => recommendedServiceNames.includes(service.name))
    : activeCategories.length
      ? services.filter((service) => activeCategories.includes(service.category))
      : services;

  const scrollRail = (ref, direction) => ref.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  const openService = (service) => {
    setSelectedService(service);
    setIsCheckoutStep(false);
    setPaymentDetails(null);
    setPaymentError("");
    setCouponPreview(null);
    setCouponCode("");
  };
  const closeModal = () => {
    setSelectedService(null);
    setIsCheckoutStep(false);
    setPaymentDetails(null);
    setPaymentError("");
    setCouponPreview(null);
  };

  async function startPayment(event) {
    event.preventDefault();
    setIsCreatingPayment(true);
    setPaymentError("");
    try {
      const response = await fetch("/api/payments/midtrans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ serviceId: selectedService.id, customer, couponCode, paymentMethod }) });
      const result = await response.json();
      if (!response.ok || !result.payment) throw new Error(result.error || "Instruksi pembayaran belum tersedia. Silakan coba lagi.");
      setPaymentDetails({ ...result.payment, orderId: result.orderId, summary: result.summary });
    } catch (paymentException) {
      setPaymentError(paymentException.message);
    } finally {
      setIsCreatingPayment(false);
    }
  }

  async function applyCoupon() {
    setIsApplyingCoupon(true);
    setPaymentError("");
    try {
      const response = await fetch("/api/payments/coupon", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ serviceId: selectedService.id, couponCode }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Kupon tidak dapat digunakan.");
      setCouponPreview(result);
    } catch (couponException) {
      setCouponPreview(null);
      setPaymentError(couponException.message);
    } finally {
      setIsApplyingCoupon(false);
    }
  }

  useEffect(() => {
    if (!paymentDetails?.orderId || ["SETTLEMENT", "CAPTURE"].includes(paymentDetails.status)) return undefined;
    const checkStatus = async () => {
      const response = await fetch(`/api/payments/midtrans?orderId=${encodeURIComponent(paymentDetails.orderId)}`, { cache: "no-store" });
      if (!response.ok) return;
      const result = await response.json();
      if (["SETTLEMENT", "CAPTURE"].includes(result.order?.status)) setPaymentDetails((current) => ({ ...current, status: result.order.status, paidAt: result.order.paidAt }));
    };
    checkStatus();
    const interval = window.setInterval(checkStatus, 3000);
    return () => window.clearInterval(interval);
  }, [paymentDetails]);

  return (
    <section className="relative overflow-hidden bg-white px-4 py-12 text-deep-navy [content-visibility:auto] [contain-intrinsic-size:900px] sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="brand-top-line absolute inset-x-0 top-0 z-10 h-1" />
      <div className="relative z-10 mx-auto max-w-[1280px]">
        <div className="grid gap-6 border-b border-deep-navy/10 pb-7 lg:grid-cols-[1.2fr_.8fr] lg:items-end lg:gap-16 lg:pb-10">
          <div><div className="flex items-center gap-3"><span className="h-[2px] w-7 rounded-full bg-orange" /><p id="layanan" className="scroll-mt-[82px] text-xs font-black uppercase tracking-[0.24em] text-orange sm:text-sm">Layanan Sebisa Project</p></div><h2 className="mt-3 max-w-[780px] text-4xl font-black uppercase leading-[0.96] tracking-[-0.04em] sm:text-6xl lg:text-[60px]">Pilih layanan yang membantu<span className="block text-brand-blue">idemu berkembang.</span></h2><p className="mt-5 max-w-[620px] text-base leading-7 text-brand-muted sm:text-lg">Dari strategi konten sampai website dan iklan digital, pilih solusi sesuai tujuan bisnismu.</p></div>
          <div className="grid grid-cols-3 divide-x divide-deep-navy/10 rounded-[18px] border border-deep-navy/10 bg-brand-surface px-3 py-4 shadow-[0_8px_22px_rgb(23_36_61_/_5%)] sm:px-4">{[["01", "Pilih"], ["02", "Bandingkan"], ["03", "Mulai"]].map(([number, label]) => <div className="px-2 first:pl-1 last:pr-1" key={number}><span className="text-sm font-black text-brand-blue sm:text-lg">{number}</span><p className="mt-0.5 text-[8px] font-bold text-deep-navy/50 sm:text-[10px]">{label}</p></div>)}</div>
        </div>
        {isLoading ? <p className="mt-8 text-sm text-deep-navy/60">Memuat daftar layanan...</p> : error ? <p className="mt-8 text-sm text-orange">{error}</p> : <>
          {flashSaleServices.length > 0 && <section className="mt-7 rounded-[24px] bg-deep-navy p-4 text-white shadow-[0_14px_32px_rgb(23_36_61_/_16%)] sm:mt-10 sm:rounded-[28px] sm:p-6"><div className="flex items-end justify-between gap-5"><div><span className="rounded-full bg-hot-pink px-2.5 py-1 text-[8px] font-black uppercase text-deep-navy">Limited Project Slots</span><h3 className="mt-3 text-[22px] font-black uppercase leading-none sm:text-3xl">Paket pilihan dengan harga spesial.</h3><p className="mt-2 text-[11px] text-white/50">Promo terbatas untuk layanan terpilih.</p></div><div className="hidden gap-2 sm:flex"><button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25" type="button" onClick={() => scrollRail(flashSaleRailRef, -1)}><FaArrowLeft /></button><button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25" type="button" onClick={() => scrollRail(flashSaleRailRef, 1)}><FaArrowRight /></button></div></div><div ref={flashSaleRailRef} className="mt-5 flex snap-x gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{flashSaleServices.map((service) => <FlashSaleCard key={`flash-${service.name}`} service={service} onOpen={openService} />)}</div></section>}
          <section id="layanan-katalog" className="scroll-mt-[82px] mt-9 sm:mt-12"><div className="flex items-end justify-between gap-5"><div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-brand-blue">Jelajahi layanan</p><h3 className="mt-1.5 text-[25px] font-black sm:text-4xl">Solusi sesuai kebutuhanmu.</h3><p className="mt-2 text-[12px] text-brand-muted sm:text-sm">Filter berdasarkan bidang, lalu geser untuk membandingkan.</p></div><div className="hidden gap-2 lg:flex"><button className="flex h-9 w-9 items-center justify-center rounded-full border border-deep-navy/20" type="button" onClick={() => scrollRail(serviceRailRef, -1)}><FaArrowLeft /></button><button className="flex h-9 w-9 items-center justify-center rounded-full border border-deep-navy/20" type="button" onClick={() => scrollRail(serviceRailRef, 1)}><FaArrowRight /></button></div></div><div className="mt-4 flex gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"><button className="shrink-0 rounded-full border border-deep-navy px-3.5 py-2 text-[10px] font-bold" type="button" onClick={() => { setActiveCategories([]); setRecommendedServiceNames([]); }}>Semua bidang</button>{serviceGroups.map((group) => <button className={`shrink-0 rounded-full border px-3.5 py-2 text-[10px] font-bold ${activeCategories.includes(group.category) ? "border-deep-navy bg-orange" : "border-deep-navy/15"}`} key={group.id || group.category} type="button" onClick={() => { setRecommendedServiceNames([]); setActiveCategories((current) => current.includes(group.category) ? current.filter((category) => category !== group.category) : [...current, group.category]); }}>{group.category}</button>)}</div><div ref={serviceRailRef} className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{filteredServices.map((service) => <ServiceCard key={service.name} service={service} onOpen={openService} />)}</div><div className="mt-2 flex justify-between text-[8px] font-bold text-deep-navy/35"><span>{filteredServices.length} layanan</span><span>Geser untuk melihat lainnya <FaArrowRight className="inline" /></span></div></section>
          <section className="mt-8 rounded-[24px] border border-deep-navy/10 bg-brand-surface p-5 sm:mt-12 sm:p-10"><p className="text-[9px] font-black uppercase tracking-[0.17em] text-brand-blue">Masih bingung memilih?</p><h3 className="mt-2 max-w-lg text-[26px] font-black uppercase sm:text-4xl">Ceritakan kebutuhanmu.<span className="block text-brand-blue">Kami bantu arahkan.</span></h3><p className="mt-3 max-w-lg text-sm leading-6 text-brand-muted">Diskusikan target, kondisi brand, dan budget sebelum menentukan layanan.</p><ScrollLink className="mt-5 inline-flex min-h-11 rounded-full bg-orange px-6 items-center text-[11px] font-black uppercase" href="#konsultasi">Konsultasikan Kebutuhanmu</ScrollLink></section>
        </>}
      </div>
      <ServiceCheckoutModal service={selectedService} isCheckoutStep={isCheckoutStep} paymentDetails={paymentDetails} customer={customer} setCustomer={setCustomer} couponCode={couponCode} setCouponCode={setCouponCode} couponPreview={couponPreview} isApplyingCoupon={isApplyingCoupon} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} paymentError={paymentError} isCreatingPayment={isCreatingPayment} onStartPayment={startPayment} onApplyCoupon={applyCoupon} onContinueCheckout={() => setIsCheckoutStep(true)} onClose={closeModal} />
    </section>
  );
}
