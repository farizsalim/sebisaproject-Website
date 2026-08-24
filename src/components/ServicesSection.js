"use client";

import {
  FaArrowLeft,
  FaArrowRight,
  FaBuildingColumns,
  FaCamera,
  FaCartShopping,
  FaChartLine,
  FaCheck,
  FaDownload,
  FaGlobe,
  FaInstagram,
  FaQrcode,
  FaMicrophone,
  FaStore,
  FaTiktok,
  FaWhatsapp,
  FaWallet,
  FaYoutube,
  FaXmark,
} from "react-icons/fa6";
import { motion } from "motion/react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import ScrollLink from "@/components/ScrollLink";

function getTimeRemaining(deadline) {
  const difference = Math.max(0, new Date(deadline).getTime() - Date.now());

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function formatTime(value) {
  return String(value).padStart(2, "0");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value || 0);
}

function formatInvoiceDate(value) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(value ? new Date(value) : new Date());
}

function getServiceIcons(serviceName) {
  const normalizedName = serviceName.toLowerCase();

  if (normalizedName.includes("instagram") && normalizedName.includes("tiktok")) {
    return [FaInstagram, FaTiktok];
  }
  if (normalizedName.includes("youtube")) return [FaYoutube];
  if (normalizedName.includes("podcast") || normalizedName.includes("audio")) {
    return [FaMicrophone];
  }
  if (normalizedName.includes("marketplace") || normalizedName.includes("toko")) {
    return [FaCartShopping];
  }
  if (normalizedName.includes("website")) return [FaGlobe];
  if (normalizedName.includes("foto")) return [FaCamera];
  return [FaChartLine];
}

function getServiceBenefits(description, benefits) {
  return (benefits?.length ? benefits : description.split(","))
    .map((benefit) => benefit.trim())
    .filter(Boolean);
}

function getServiceQuestionLink(service) {
  const message = [
    "Halo Sebisa Project, saya ingin bertanya tentang layanan berikut:",
    `Layanan: ${service.name}`,
    `Harga: ${service.price}`,
    "Mohon bantu jelaskan apakah layanan ini sesuai dengan kebutuhan saya.",
  ].join("\n");

  return `https://wa.me/6280000000000?text=${encodeURIComponent(message)}`;
}

function getPaymentConfirmationLink(service, orderId) {
  const message = [
    "Halo Sebisa Project, saya sudah melakukan pembayaran.",
    `Layanan: ${service.name}`,
    `Order ID: ${orderId}`,
    "Mohon konfirmasi pembayaran saya.",
  ].join("\n");
  return `https://wa.me/6280000000000?text=${encodeURIComponent(message)}`;
}

function downloadInvoiceAsPng(summary, orderId, paidAt) {
  const benefits = summary.benefits || [];
  const benefitLines = benefits.flatMap((benefit) => {
    const words = String(benefit).split(" ");
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const nextLine = line ? `${line} ${word}` : word;
      if (nextLine.length > 62) {
        lines.push(line);
        line = word;
      } else {
        line = nextLine;
      }
    });
    if (line) lines.push(line);
    return lines;
  });
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 1110 + benefitLines.length * 34;
  const context = canvas.getContext("2d");
  if (!context) return;

  context.fillStyle = "#f7f6f1";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#17243d";
  context.fillRect(0, 0, canvas.width, 250);

  const logo = new Image();
  logo.onload = () => {
    context.drawImage(logo, 75, 55, 360, 140);
    context.fillStyle = "#ffb000";
    context.fillRect(75, 230, 1250, 6);
    context.fillStyle = "#17243d";
    context.font = "900 44px Arial";
    context.fillText("INVOICE PEMBAYARAN", 75, 340);
    context.font = "700 27px Arial";
    context.fillStyle = "#687386";
    context.fillText(`Order ID: ${orderId}`, 75, 390);
    context.fillText(formatInvoiceDate(paidAt), 75, 430);
    context.fillStyle = "#ffffff";
    const detailHeight = 350 + benefitLines.length * 34;
    context.fillRect(75, 485, 1250, detailHeight);
    context.fillStyle = "#17243d";
    context.font = "900 32px Arial";
    context.fillText("Detail transaksi", 115, 545);
    context.font = "700 27px Arial";
    context.fillText(summary.serviceName, 115, 610);
    context.font = "500 23px Arial";
    context.fillStyle = "#687386";
    context.fillText(summary.duration, 115, 650);
    context.fillStyle = "#17243d";
    context.font = "700 24px Arial";
    context.fillText("Isi paket:", 115, 705);
    context.font = "500 22px Arial";
    context.fillStyle = "#687386";
    benefitLines.forEach((line, index) => context.fillText(`• ${line}`, 135, 745 + index * 34));
    const customerStart = 745 + benefitLines.length * 34;
    context.fillText(`Pembeli: ${summary.customerName}`, 115, customerStart);
    context.fillText(summary.customerEmail, 115, customerStart + 40);
    context.textAlign = "right";
    context.fillStyle = "#17243d";
    context.font = "700 25px Arial";
    context.fillText("Total dibayar", 1285, 610);
    context.fillStyle = "#2563eb";
    context.font = "900 36px Arial";
    context.fillText(formatCurrency(summary.totalAmount), 1285, 665);
    context.textAlign = "left";
    context.fillStyle = "#17243d";
    context.font = "700 25px Arial";
    const footerStart = 555 + detailHeight;
    context.fillText("Terima kasih telah memilih Sebisa Project.", 75, footerStart);
    context.font = "500 21px Arial";
    context.fillStyle = "#687386";
    context.fillText("Invoice ini adalah bukti pembayaran yang sah.", 75, footerStart + 40);
    const link = document.createElement("a");
    link.download = `invoice-${orderId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  logo.src = "/images/logo-sebisa-project.png";
}

const paymentMethodOptions = [
  { value: "qris", label: "QRIS", icon: FaQrcode, mark: "QRIS", tone: "bg-blue-600 text-white" },
  { value: "bca_va", label: "Virtual Account BCA", icon: FaBuildingColumns, mark: "BCA", tone: "bg-blue-700 text-white" },
  { value: "bni_va", label: "Virtual Account BNI", icon: FaBuildingColumns, mark: "BNI", tone: "bg-orange-500 text-white" },
  { value: "bri_va", label: "Virtual Account BRI", icon: FaBuildingColumns, mark: "BRI", tone: "bg-blue-500 text-white" },
  { value: "mandiri_va", label: "Virtual Account Mandiri", icon: FaBuildingColumns, mark: "MANDIRI", tone: "bg-yellow-300 text-deep-navy" },
  { value: "cimb_va", label: "Virtual Account CIMB Niaga", icon: FaBuildingColumns, mark: "CIMB", tone: "bg-red-600 text-white" },
  { value: "gopay", label: "GoPay", icon: FaWallet, mark: "GoPay", tone: "bg-green-500 text-white" },
  { value: "shopeepay", label: "ShopeePay", icon: FaStore, mark: "SPay", tone: "bg-orange-600 text-white" },
];

export default function ServicesSection({ content }) {
  const [serviceGroups, setServiceGroups] = useState(content || []);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [, setCountdownTick] = useState(0);
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
  const servicesRailRef = useRef(null);
  const flashSaleRailRef = useRef(null);

  const scrollServices = (direction) => {
    servicesRailRef.current?.scrollBy({
      left: direction * 330,
      behavior: "smooth",
    });
  };

  const scrollFlashSale = (direction) => {
    flashSaleRailRef.current?.scrollBy({
      left: direction * 330,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setServiceGroups(content || []);
    setIsLoading(false);
    setError(content ? "" : "Daftar layanan belum dapat dimuat.");
  }, [content]);

  const services = serviceGroups.flatMap((group) =>
    group.services.map((service) => ({ ...service, category: group.category })),
  );
  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter((service) => service.category === activeCategory);
  const flashSaleServices = services.filter((service) => service.flashSale);
  const flashSaleDeadlineKey = flashSaleServices
    .map((service) => `${service.name}-${service.flashSaleEndsAt || ""}`)
    .join("|");

  useEffect(() => {
    if (!flashSaleDeadlineKey) return undefined;

    const updateCountdown = () => setCountdownTick(Date.now());
    updateCountdown();
    const countdownInterval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(countdownInterval);
  }, [flashSaleDeadlineKey]);

  useEffect(() => {
    const filter = new URLSearchParams(window.location.search).get("filter");

    if (filter === "flash-sale") setActiveCategory("all");
  }, []);

  useEffect(() => {
    if (!selectedService) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedService(null);
        setIsCheckoutStep(false);
        setPaymentDetails(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedService]);

  useEffect(() => {
    if (!paymentDetails?.orderId || ["SETTLEMENT", "CAPTURE"].includes(paymentDetails.status)) return undefined;

    const checkPaymentStatus = async () => {
      const response = await fetch(`/api/payments/midtrans?orderId=${encodeURIComponent(paymentDetails.orderId)}`, { cache: "no-store" });
      if (!response.ok) return;
      const result = await response.json();
      if (["SETTLEMENT", "CAPTURE"].includes(result.order?.status)) {
        setPaymentDetails((current) => ({ ...current, status: result.order.status, paidAt: result.order.paidAt }));
      }
    };

    checkPaymentStatus();
    const statusInterval = window.setInterval(checkPaymentStatus, 3000);
    return () => window.clearInterval(statusInterval);
  }, [paymentDetails]);

  async function startPayment(event) {
    event.preventDefault();
    setIsCreatingPayment(true);
    setPaymentError("");
    try {
      const response = await fetch("/api/payments/midtrans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: selectedService.id, customer, couponCode, paymentMethod }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Checkout belum dapat dibuat.");
      if (!result.payment) throw new Error("Instruksi pembayaran belum tersedia. Silakan coba lagi.");
      setPaymentDetails({ ...result.payment, orderId: result.orderId, summary: result.summary });
      setIsCreatingPayment(false);
    } catch (paymentRequestError) {
      setPaymentError(paymentRequestError.message);
      setIsCreatingPayment(false);
    }
  }

  async function applyCoupon() {
    setIsApplyingCoupon(true);
    setPaymentError("");
    try {
      const response = await fetch("/api/payments/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: selectedService.id, couponCode }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Kupon tidak dapat digunakan.");
      setCouponPreview(result);
    } catch (couponError) {
      setCouponPreview(null);
      setPaymentError(couponError.message);
    } finally {
      setIsApplyingCoupon(false);
    }
  }

  return (
    <section
      className="relative overflow-hidden bg-white px-4 py-20 text-deep-navy [content-visibility:auto] [contain-intrinsic-size:900px] sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="brand-top-line absolute inset-x-0 top-0 z-10 h-1" />
      <div className="relative z-10 mx-auto max-w-[1240px]">
        <motion.div
          className="max-w-2xl"
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p id="layanan" className="scroll-mt-[82px] mb-3 text-sm font-black uppercase tracking-[0.24em] text-brand-blue sm:scroll-mt-[102px] sm:text-sm">
            Layanan Sebisa Project
          </p>
          <h2 className="text-4xl font-black uppercase leading-[0.96] tracking-[-0.04em] text-deep-navy sm:text-6xl lg:text-[68px]">
            Pilih layanan yang membantu idemu berkembang.
          </h2>
          <p className="mt-5 text-base leading-7 text-brand-muted sm:text-lg">
            Dari strategi konten sampai website dan iklan digital, kami bantu
            membangun kebutuhan digital bisnismu dengan lebih terarah.
          </p>
        </motion.div>

        {isLoading ? (
            <p className="mt-12 text-deep-navy/60">Memuat daftar layanan...</p>
        ) : error ? (
          <p className="mt-12 text-orange">{error}</p>
        ) : (
          <div className="mt-8">
            {flashSaleServices.length > 0 ? (
              <div className="mb-10 rounded-3xl border-2 border-hot-pink/30 bg-deep-navy p-4 text-white shadow-[0_16px_35px_rgb(23_36_61_/_18%)] sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/15 pb-4">
                  <div className="min-w-0"><p className="text-xs font-black uppercase tracking-[0.2em] text-orange">Promo terbatas</p><h3 className="mt-2 text-2xl font-black uppercase leading-none text-white sm:text-4xl">Flash Sale pilihan</h3><p className="mt-2 max-w-md text-sm font-medium leading-6 text-white/65">Harga khusus untuk kebutuhan digitalmu, sebelum waktunya berakhir.</p></div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <span className="rounded-full bg-hot-pink px-3 py-2 text-xs font-black text-deep-navy">{flashSaleServices.length} promo aktif</span>
                    <div className="flex gap-2">
                      <button
                        aria-label="Promo Flash Sale sebelumnya"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 text-white transition hover:-translate-y-0.5 hover:border-orange hover:bg-orange hover:text-deep-navy"
                        title="Promo Flash Sale sebelumnya"
                        type="button"
                        onClick={() => scrollFlashSale(-1)}
                      >
                        <FaArrowLeft aria-hidden="true" />
                      </button>
                      <button
                        aria-label="Promo Flash Sale berikutnya"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 text-white transition hover:-translate-y-0.5 hover:border-orange hover:bg-orange hover:text-deep-navy"
                        title="Promo Flash Sale berikutnya"
                        type="button"
                        onClick={() => scrollFlashSale(1)}
                      >
                        <FaArrowRight aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
                <div ref={flashSaleRailRef} className="mt-5 flex items-start gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {flashSaleServices.map((service, index) => {
                    const benefits = getServiceBenefits(service.description, service.benefits);
                    const visibleBenefits = benefits.slice(0, 2);
                    const timeRemaining = service.flashSaleEndsAt ? getTimeRemaining(service.flashSaleEndsAt) : null;

                    return (
                      <motion.article
                        key={`flash-${service.name}`}
                        className={`group relative flex w-[min(82vw,310px)] shrink-0 flex-col overflow-hidden rounded-2xl border border-deep-navy/15 bg-white p-5 text-deep-navy shadow-[0_16px_35px_rgb(23_36_61_/_16%)] transition hover:-translate-y-1 sm:w-[310px] sm:p-6 ${index % 2 === 1 ? "lg:mt-5" : ""}`}
                        initial={false}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5 }}
                        viewport={{ once: false, amount: 0.15 }}
                        transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                      >
                        <span className="relative z-10 mb-4 w-fit rounded-full bg-hot-pink px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-deep-navy">
                          Flash Sale -{service.discount}%
                        </span>
                        <div className="relative flex items-start justify-between gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg border-l-2 border-orange bg-brand-surface-alt text-lg text-brand-blue">
                            {getServiceIcons(service.name).map((ServiceIcon) => (
                              <ServiceIcon key={ServiceIcon.name} aria-hidden="true" />
                            ))}
                          </div>
                        </div>
                        <p className="relative mt-5 text-[10px] font-black uppercase tracking-[0.16em] text-deep-navy/55">{service.category}</p>
                        <h4 className="relative mt-2 min-h-[3.4rem] line-clamp-2 text-xl font-black leading-tight text-deep-navy">{service.name}</h4>
                        <div className="relative mt-4 border-b border-deep-navy/15 pb-4">
                          <p className="mb-1 flex items-baseline gap-2 text-deep-navy/45">
                            <span className="text-base font-black line-through sm:text-lg">{service.originalPrice}</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-deep-navy/45">harga normal</span>
                          </p>
                          <span className="block text-2xl font-black text-orange sm:text-[27px]">{service.price}</span>
                          <p className="mt-1 text-sm text-deep-navy/60">{service.duration || "Sesuai kebutuhan"}</p>
                          {timeRemaining ? <p className="mt-2 text-xs font-black uppercase tracking-[0.08em] text-hot-pink">Berakhir {timeRemaining.days}H : {formatTime(timeRemaining.hours)}J : {formatTime(timeRemaining.minutes)}M : {formatTime(timeRemaining.seconds)}D</p> : null}
                        </div>
                        <p className="relative mt-3 line-clamp-2 text-sm leading-5 text-deep-navy/65">
                          {service.description}
                        </p>
                        <ul className="relative mt-3 grid gap-2 text-sm font-bold leading-5 text-deep-navy/85">
                          {visibleBenefits.map((benefit) => (
                            <li className="flex items-start gap-3" key={benefit}>
                              <FaCheck className="mt-1 shrink-0 text-brand-blue-light" aria-hidden="true" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                        {benefits.length > visibleBenefits.length ? <p className="relative mt-2 text-xs font-bold text-deep-navy/55">+{benefits.length - visibleBenefits.length} benefit lainnya</p> : null}
                        <button className="relative mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-deep-navy/30 px-4 py-3 text-center text-sm font-black text-deep-navy transition hover:border-orange hover:bg-orange" type="button" onClick={() => { setSelectedService(service); setIsCheckoutStep(false); setPaymentDetails(null); setPaymentError(""); setCouponPreview(null); }}>
                          Lihat rincian
                        </button>
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            ) : null}
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="min-w-0 text-lg font-bold text-deep-navy sm:text-xl">
                {activeCategory === "all" ? "Semua layanan" : activeCategory}
              </h3>
              <div className="flex items-center gap-3">
                <span className="hidden text-xs text-deep-navy/60 sm:inline">
                  Geser untuk menjelajah
                </span>
                <div className="flex gap-2">
                  <button
                    aria-label="Layanan sebelumnya"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-deep-navy/30 text-deep-navy transition hover:-translate-y-0.5 hover:border-orange hover:bg-orange hover:text-deep-navy"
                    title="Layanan sebelumnya"
                    type="button"
                    onClick={() => scrollServices(-1)}
                  >
                    <FaArrowLeft aria-hidden="true" />
                  </button>
                  <button
                    aria-label="Layanan berikutnya"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-deep-navy/30 text-deep-navy transition hover:-translate-y-0.5 hover:border-orange hover:bg-orange hover:text-deep-navy"
                    title="Layanan berikutnya"
                    type="button"
                    onClick={() => scrollServices(1)}
                  >
                    <FaArrowRight aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            <div
              className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Filter bidang layanan"
            >
              <button
                className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold transition ${
                  activeCategory === "all"
                    ? "border border-deep-navy bg-orange text-deep-navy"
                    : "border border-deep-navy/20 text-deep-navy/75 hover:border-orange hover:bg-orange hover:text-deep-navy"
                }`}
                type="button"
                onClick={() => setActiveCategory("all")}
              >
                Semua bidang
              </button>
              {serviceGroups.map((group) => (
                <button
                  key={group.id}
                  className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold transition ${
                    activeCategory === group.category
                      ? "border border-deep-navy bg-orange text-deep-navy"
                      : "border border-deep-navy/20 text-deep-navy/75 hover:border-orange hover:bg-orange hover:text-deep-navy"
                  }`}
                  type="button"
                  onClick={() => setActiveCategory(group.category)}
                >
                  {group.category}
                </button>
              ))}
            </div>
            <div
              ref={servicesRailRef}
              className="flex items-start snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden pb-8 pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {filteredServices.map((service, index) => {
                const benefits = getServiceBenefits(service.description, service.benefits);
                const visibleBenefits = benefits.slice(0, 2);
                const isRecommended = service.isRecommended;
                const timeRemaining = service.flashSaleEndsAt ? getTimeRemaining(service.flashSaleEndsAt) : null;

                return (
                  <motion.article
                    key={service.name}
                    className={`group relative flex w-[min(82vw,310px)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-brand-blue/35 bg-deep-navy p-5 text-white shadow-[0_16px_35px_rgb(23_36_61_/_22%)] transition hover:-translate-y-1 sm:w-[310px] sm:p-6 ${index % 2 === 1 ? "lg:mt-5" : ""}`}
                    initial={false}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                  >
                    {isRecommended ? (
                      <span className="relative z-10 mb-4 w-fit rounded-full bg-brand-blue px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-white">
                        Paling direkomendasikan
                      </span>
                    ) : null}
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg border-l-2 border-orange bg-brand-surface-alt text-lg text-brand-blue">
                        {getServiceIcons(service.name).map((ServiceIcon) => (
                          <ServiceIcon key={ServiceIcon.name} aria-hidden="true" />
                        ))}
                      </div>
                      {service.flashSale ? (
                        <span className="rounded-full border border-deep-navy bg-hot-pink px-2 py-1 text-[10px] font-black uppercase leading-none tracking-[0.08em] text-deep-navy">
                          Flash Sale -{service.discount}%
                        </span>
                      ) : null}
                    </div>
                    <p className="relative mt-5 text-[10px] font-black uppercase tracking-[0.16em] text-white/60">
                      {service.category}
                    </p>
                    <h4 className="relative mt-2 min-h-[3.4rem] line-clamp-2 text-xl font-black leading-tight text-white">
                      {service.name}
                    </h4>
                    <div className="relative mt-4 border-b border-white/15 pb-4">
                      {service.flashSale && service.originalPrice ? (
                        <p className="mb-1 flex items-baseline gap-2 text-white/45">
                          <span className="text-base font-black line-through sm:text-lg">{service.originalPrice}</span>
                          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/45">harga normal</span>
                        </p>
                      ) : null}
                      <span className="block text-2xl font-black text-orange sm:text-[27px]">
                        {service.price}
                      </span>
                      <p className="mt-1 text-sm text-white/60">
                        {service.duration || "Sesuai kebutuhan"}
                      </p>
                      {service.flashSale && timeRemaining ? (
                        <p className="mt-2 text-xs font-black uppercase tracking-[0.08em] text-hot-pink">
                          Berakhir {timeRemaining.days}H : {formatTime(timeRemaining.hours)}J : {formatTime(timeRemaining.minutes)}M : {formatTime(timeRemaining.seconds)}D
                        </p>
                      ) : null}
                    </div>
                    <p className="relative mt-3 line-clamp-2 text-sm leading-5 text-white/65">
                      {service.description}
                    </p>
                    <ul className="relative mt-3 grid gap-2 text-sm font-bold leading-5 text-white/85">
                      {visibleBenefits.map((benefit) => (
                        <li className="flex items-start gap-3" key={benefit}>
                          <FaCheck className="mt-1 shrink-0 text-brand-blue-light" aria-hidden="true" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    {benefits.length > visibleBenefits.length ? <p className="relative mt-2 text-xs font-bold text-white/50">+{benefits.length - visibleBenefits.length} benefit lainnya</p> : null}
                    <button className="relative mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-white/50 px-4 py-3 text-center text-sm font-black text-white transition hover:border-orange hover:bg-orange hover:text-deep-navy" type="button" onClick={() => { setSelectedService(service); setIsCheckoutStep(false); setPaymentDetails(null); setPaymentError(""); setCouponPreview(null); }}>
                      Lihat rincian
                    </button>
                  </motion.article>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-14 flex justify-center">
          <ScrollLink
            className="rounded-full border-2 border-orange bg-orange px-7 py-4 text-sm font-black uppercase tracking-[0.08em] text-deep-navy transition hover:-translate-y-1 hover:border-brand-blue hover:bg-orange"
            href="#konsultasi"
          >
            Konsultasikan Kebutuhanmu
          </ScrollLink>
        </div>
      </div>
      {selectedService && typeof document !== "undefined" ? createPortal((
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-deep-navy/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="service-detail-title">
          <div className="relative flex max-h-[calc(100dvh-1rem)] w-full max-w-xl flex-col overflow-y-auto overscroll-contain rounded-3xl bg-brand-surface p-5 text-deep-navy shadow-2xl sm:max-h-[92vh] sm:p-8">
            <button aria-label="Tutup rincian layanan" className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-deep-navy/60 transition hover:bg-hot-pink hover:text-white" type="button" onClick={() => { setSelectedService(null); setIsCheckoutStep(false); setPaymentDetails(null); setCouponPreview(null); }}><FaXmark aria-hidden="true" /></button>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-blue">{isCheckoutStep ? "Data pembelian" : "Rincian layanan"}</p>
            <h2 id="service-detail-title" className="mt-3 pr-10 text-3xl font-black leading-tight">{selectedService.name}</h2>
            {!isCheckoutStep ? <p className="mt-2 text-sm font-bold text-slate-500">{selectedService.category} · {selectedService.duration || "Sesuai kebutuhan"}</p> : null}
            {!isCheckoutStep ? <div className="mt-5 border-y border-deep-navy/10 py-5">
              {selectedService.flashSale && selectedService.originalPrice ? <p className="text-sm font-bold text-slate-400 line-through">{selectedService.originalPrice}</p> : null}
              <p className="mt-1 text-3xl font-black text-brand-blue">{selectedService.price}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">Paket ini mencakup:</p>
              <ul className="mt-3 grid gap-3 text-sm font-bold leading-5">{getServiceBenefits(selectedService.description, selectedService.benefits).map((benefit) => <li className="flex items-start gap-3" key={benefit}><FaCheck className="mt-1 shrink-0 text-brand-blue" aria-hidden="true" />{benefit}</li>)}</ul>
              <button className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-orange px-5 py-3 text-sm font-black text-deep-navy transition hover:bg-brand-blue hover:text-white disabled:opacity-60" disabled={!selectedService.id} type="button" onClick={() => setIsCheckoutStep(true)}>Beli layanan ini</button>
              <a className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-deep-navy/20 px-5 py-3 text-center text-sm font-black text-deep-navy transition hover:border-[#25D366] hover:bg-[#25D366] hover:text-white" href={getServiceQuestionLink(selectedService)} rel="noreferrer" target="_blank"><FaWhatsapp aria-hidden="true" /> Masih ragu? Tanya lewat WhatsApp</a>
            </div> : null}
            {isCheckoutStep && !paymentDetails ? <form className="mt-6 grid gap-3" onSubmit={startPayment}>
              <p className="text-sm font-black">Data pembeli</p>
              <input required className={"w-full rounded-xl border border-deep-navy/15 bg-white px-3 py-3 text-sm outline-none focus:border-brand-blue"} placeholder="Nama lengkap" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} />
              <input required className={"w-full rounded-xl border border-deep-navy/15 bg-white px-3 py-3 text-sm outline-none focus:border-brand-blue"} type="email" placeholder="Email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} />
              <input required className={"w-full rounded-xl border border-deep-navy/15 bg-white px-3 py-3 text-sm outline-none focus:border-brand-blue"} placeholder="Nomor WhatsApp" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} />
              <label className="grid gap-2 text-sm font-bold">Kode kupon (opsional)<div className="flex gap-2"><input className="min-w-0 flex-1 rounded-xl border border-deep-navy/15 bg-white px-3 py-3 text-sm uppercase outline-none focus:border-brand-blue" maxLength={40} placeholder="Contoh: SEBISA10" value={couponCode} onChange={(event) => { setCouponCode(event.target.value.toUpperCase()); setCouponPreview(null); }} /><button className="shrink-0 rounded-xl border border-deep-navy px-3 py-2 text-xs font-black transition hover:bg-orange disabled:opacity-60" disabled={isApplyingCoupon || couponCode.trim().length < 3} type="button" onClick={applyCoupon}>{isApplyingCoupon ? "Cek..." : "Terapkan"}</button></div></label>
              {couponPreview ? <div className="grid gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-xs"><div className="flex justify-between gap-3"><span>Harga layanan</span><span>{formatCurrency(couponPreview.originalAmount)}</span></div><div className="flex justify-between gap-3 text-emerald-700"><span>Diskon {couponPreview.couponCode}</span><span>-{formatCurrency(couponPreview.discountAmount)}</span></div><div className="mt-1 flex justify-between gap-3 border-t border-emerald-200 pt-2 text-sm font-black"><span>Total pembayaran</span><span>{formatCurrency(couponPreview.totalAmount)}</span></div></div> : null}
              <fieldset className="grid gap-2"><legend className="text-sm font-bold">Pilih metode pembayaran</legend><div className="grid gap-2 sm:grid-cols-2">{paymentMethodOptions.map((option) => { const PaymentIcon = option.icon; const isSelected = paymentMethod === option.value; return <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${isSelected ? "border-brand-blue bg-brand-blue/10 ring-2 ring-brand-blue/15" : "border-deep-navy/12 bg-white hover:border-brand-blue/50"}`} key={option.value}><input className="sr-only" type="radio" name="paymentMethod" value={option.value} checked={isSelected} onChange={() => setPaymentMethod(option.value)} /><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[10px] font-black ${option.tone}`}><PaymentIcon aria-hidden="true" className="text-base" /></span><span className="min-w-0"><span className="block text-xs font-black uppercase tracking-[0.04em]">{option.mark}</span><span className="mt-0.5 block text-xs font-bold text-slate-500">{option.label.replace("Virtual Account ", "VA ")}</span></span><span className={`ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-brand-blue" : "border-deep-navy/25"}`}>{isSelected ? <span className="h-2 w-2 rounded-full bg-brand-blue" /> : null}</span></label>; })}</div></fieldset>
              <p className="rounded-xl bg-brand-blue/10 px-3 py-3 text-xs leading-5 text-deep-navy/75">Kupon akan diverifikasi saat pembayaran dibuat. Harga resmi layanan dan diskon dihitung oleh server.</p>
              {paymentError ? <p className="rounded-xl bg-hot-pink/10 px-3 py-3 text-sm font-bold text-deep-navy">{paymentError}</p> : null}
              <button className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-orange px-5 py-3 text-sm font-black text-deep-navy transition hover:bg-brand-blue hover:text-white disabled:opacity-60" disabled={isCreatingPayment || !selectedService.id} type="submit">{isCreatingPayment ? "Menyiapkan pembayaran..." : "Lanjut ke pembayaran"}</button>
              {!selectedService.id ? <p className="text-center text-xs text-slate-500">Pembelian online tersedia setelah layanan terhubung ke database.</p> : null}
              <button className="mt-1 text-sm font-bold text-slate-500 underline underline-offset-4" type="button" onClick={() => setIsCheckoutStep(false)}>Kembali ke rincian</button>
            </form> : null}
            {isCheckoutStep && paymentDetails ? ["SETTLEMENT", "CAPTURE"].includes(paymentDetails.status) ? <div className="mt-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700"><FaCheck aria-hidden="true" /></div>
              <h3 className="mt-4 text-center text-2xl font-black text-emerald-700">Pembayaran berhasil</h3>
              <p className="mt-2 text-center text-sm leading-6 text-slate-600">Transaksi Anda sudah dikonfirmasi oleh Midtrans. Invoice pembayaran Anda tersedia di bawah.</p>
              <div className="mt-5 overflow-hidden rounded-2xl border border-deep-navy/10 bg-white shadow-sm">
                <div className="bg-deep-navy px-5 py-4"><img className="h-12 w-auto object-contain object-left" src="/images/logo-sebisa-project.png" alt="Sebisa Project" /><p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-white/65">Invoice pembayaran</p></div>
                <div className="grid gap-4 p-5 text-sm">
                  <div className="flex items-start justify-between gap-4 border-b border-deep-navy/10 pb-4"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">ID transaksi</p><p className="mt-1 break-all font-black text-deep-navy">{paymentDetails.orderId}</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">LUNAS</span></div>
                  <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Paket yang dibeli</p><p className="mt-1 text-lg font-black text-deep-navy">{paymentDetails.summary?.serviceName || selectedService.name}</p><p className="text-xs font-bold text-slate-500">{paymentDetails.summary?.duration || selectedService.duration || "Sesuai kebutuhan"}</p><p className="mt-3 text-xs font-black uppercase tracking-[0.1em] text-slate-500">Isi paket</p><ul className="mt-2 grid gap-2 text-sm font-bold leading-5">{(paymentDetails.summary?.benefits || getServiceBenefits(selectedService.description, selectedService.benefits)).map((benefit) => <li className="flex items-start gap-2" key={benefit}><FaCheck className="mt-1 shrink-0 text-brand-blue" aria-hidden="true" />{benefit}</li>)}</ul></div>
                  <div className="grid gap-2 border-t border-deep-navy/10 pt-4 sm:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Atas nama</p><p className="mt-1 font-black">{paymentDetails.summary?.customerName || customer.name}</p><p className="break-all text-xs text-slate-500">{paymentDetails.summary?.customerEmail || customer.email}</p><p className="text-xs text-slate-500">{paymentDetails.summary?.customerPhone || customer.phone}</p></div><div className="sm:text-right"><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Total dibayar</p><p className="mt-1 text-xl font-black text-brand-blue">{formatCurrency(paymentDetails.summary?.totalAmount)}</p><p className="text-xs text-slate-500">{formatInvoiceDate(paymentDetails.paidAt)}</p></div></div>
                </div>
              </div>
              <button className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-orange px-5 py-3 text-sm font-black text-deep-navy transition hover:bg-brand-blue hover:text-white" type="button" onClick={() => downloadInvoiceAsPng(paymentDetails.summary || { serviceName: selectedService.name, duration: selectedService.duration, customerName: customer.name, customerEmail: customer.email, totalAmount: 0, benefits: getServiceBenefits(selectedService.description, selectedService.benefits) }, paymentDetails.orderId, paymentDetails.paidAt)}><FaDownload aria-hidden="true" /> Simpan invoice sebagai PNG</button>
              <a className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-black text-white" href={getPaymentConfirmationLink(selectedService, paymentDetails.orderId)} rel="noreferrer" target="_blank"><FaWhatsapp aria-hidden="true" /> Konfirmasi lewat WhatsApp</a>
              <button className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-deep-navy/20 px-5 py-3 text-sm font-black text-deep-navy" type="button" onClick={() => { setSelectedService(null); setIsCheckoutStep(false); setPaymentDetails(null); }}>Kembali ke halaman utama</button>
            </div> : <div className="mt-5">
              <div className="overflow-hidden rounded-2xl border border-deep-navy/10 bg-white shadow-sm"><div className="bg-deep-navy px-4 py-3"><p className="text-xs font-black uppercase tracking-[0.14em] text-white/70">Ringkasan transaksi</p><p className="mt-1 text-lg font-black text-white">{paymentDetails.summary?.serviceName || selectedService.name}</p></div><div className="grid gap-3 p-4 text-sm sm:grid-cols-2"><div><p className="text-xs font-bold uppercase text-slate-500">Atas nama</p><p className="mt-1 font-black">{paymentDetails.summary?.customerName || customer.name}</p><p className="break-all text-xs text-slate-500">{paymentDetails.summary?.customerEmail || customer.email}</p></div><div className="sm:text-right"><p className="text-xs font-bold uppercase text-slate-500">Total pembayaran</p><p className="mt-1 text-xl font-black text-brand-blue">{formatCurrency(paymentDetails.summary?.totalAmount)}</p><p className="break-all text-xs text-slate-500">ID: {paymentDetails.orderId}</p></div></div></div>
              <p className="mt-4 text-sm leading-6 text-slate-600">Selesaikan pembayaran melalui instruksi berikut. Status akan diperbarui otomatis setelah Midtrans menerima pembayaran.</p>
              {paymentDetails.vaNumbers?.length ? <div className="mt-4 grid gap-3">{paymentDetails.vaNumbers.map((vaNumber) => <div className="rounded-xl border border-deep-navy/10 bg-white p-4" key={vaNumber.va_number}><p className="text-xs font-black uppercase text-slate-500">Virtual Account {vaNumber.bank}</p><p className="mt-2 text-2xl font-black tracking-wider">{vaNumber.va_number}</p></div>)}</div> : null}
              {paymentDetails.actions?.map((action) => action?.url ? (action.name === "generate-qr-code" || action.name === "generate-qr-code-v2" ? <div className="mt-4 flex justify-center rounded-xl bg-white p-5" key={`${action.name}-${action.url}`}><img className="h-64 w-64" src={action.url} alt="QR pembayaran" /></div> : <a className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-orange px-5 py-3 text-sm font-black text-deep-navy" href={action.url} key={`${action.name}-${action.url}`} rel="noreferrer" target="_blank">Lanjutkan pembayaran</a>) : null)}
              {!paymentDetails.vaNumbers?.length && !paymentDetails.actions?.length ? <p className="mt-4 rounded-xl bg-orange/20 px-4 py-3 text-sm font-bold">Instruksi pembayaran sedang disiapkan. Simpan order Anda dan tunggu notifikasi.</p> : null}
              {paymentError ? <p className="mt-3 rounded-xl bg-brand-blue/10 px-3 py-3 text-sm font-bold text-deep-navy">{paymentError}</p> : null}
            </div> : null}
          </div>
        </div>
      ), document.body) : null}
    </section>
  );
}
