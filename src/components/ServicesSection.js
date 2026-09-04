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
  FaMicrophone,
  FaQrcode,
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

/* ======================================================
   HELPERS
====================================================== */

function getTimeRemaining(deadline) {
  const difference = Math.max(
    0,
    new Date(deadline).getTime() - Date.now()
  );

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function isFlashSaleActive(service) {
  if (!service?.flashSale) return false;
  if (!service.flashSaleEndsAt) return true;

  return new Date(service.flashSaleEndsAt).getTime() > Date.now();
}

function getCurrentServicePrice(service) {
  return isFlashSaleActive(service)
    ? service.price
    : service.originalPrice || service.price;
}

function formatTime(value) {
  return String(value).padStart(2, "0");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatInvoiceDate(value) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(value ? new Date(value) : new Date());
}

function getServiceIcons(serviceName = "") {
  const normalizedName = serviceName.toLowerCase();

  if (
    normalizedName.includes("instagram") &&
    normalizedName.includes("tiktok")
  ) {
    return [FaInstagram, FaTiktok];
  }

  if (normalizedName.includes("instagram")) return [FaInstagram];
  if (normalizedName.includes("tiktok")) return [FaTiktok];
  if (normalizedName.includes("youtube")) return [FaYoutube];

  if (
    normalizedName.includes("podcast") ||
    normalizedName.includes("audio")
  ) {
    return [FaMicrophone];
  }

  if (
    normalizedName.includes("marketplace") ||
    normalizedName.includes("toko")
  ) {
    return [FaCartShopping];
  }

  if (normalizedName.includes("website")) return [FaGlobe];
  if (normalizedName.includes("foto")) return [FaCamera];

  return [FaChartLine];
}

function getServiceBenefits(description, benefits) {
  return (
    benefits?.length ? benefits : String(description || "").split(",")
  )
    .map((benefit) => String(benefit).trim())
    .filter(Boolean);
}

function getServiceQuestionLink(service) {
  const message = [
    "Halo Sebisa Project, saya ingin bertanya tentang layanan berikut:",
    `Layanan: ${service.name}`,
    `Harga: ${getCurrentServicePrice(service)}`,
    "Mohon bantu jelaskan apakah layanan ini sesuai dengan kebutuhan saya.",
  ].join("\n");

  return `https://wa.me/6280000000000?text=${encodeURIComponent(
    message
  )}`;
}

function getPaymentConfirmationLink(service, orderId) {
  const message = [
    "Halo Sebisa Project, saya sudah melakukan pembayaran.",
    `Layanan: ${service.name}`,
    `Order ID: ${orderId}`,
    "Mohon konfirmasi pembayaran saya.",
  ].join("\n");

  return `https://wa.me/6280000000000?text=${encodeURIComponent(
    message
  )}`;
}

/* ======================================================
   INVOICE
====================================================== */

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

    benefitLines.forEach((line, index) => {
      context.fillText(`• ${line}`, 135, 745 + index * 34);
    });

    const customerStart = 745 + benefitLines.length * 34;

    context.fillText(
      `Pembeli: ${summary.customerName}`,
      115,
      customerStart
    );

    context.fillText(
      summary.customerEmail,
      115,
      customerStart + 40
    );

    context.textAlign = "right";

    context.fillStyle = "#17243d";
    context.font = "700 25px Arial";
    context.fillText("Total dibayar", 1285, 610);

    context.fillStyle = "#2563eb";
    context.font = "900 36px Arial";

    context.fillText(
      formatCurrency(summary.totalAmount),
      1285,
      665
    );

    context.textAlign = "left";
    context.fillStyle = "#17243d";
    context.font = "700 25px Arial";

    const footerStart = 555 + detailHeight;

    context.fillText(
      "Terima kasih telah memilih Sebisa Project.",
      75,
      footerStart
    );

    context.font = "500 21px Arial";
    context.fillStyle = "#687386";

    context.fillText(
      "Invoice ini adalah bukti pembayaran yang sah.",
      75,
      footerStart + 40
    );

    const link = document.createElement("a");

    link.download = `invoice-${orderId}.png`;
    link.href = canvas.toDataURL("image/png");

    link.click();
  };

  logo.src = "/images/logo-sebisa-project.png";
}

/* ======================================================
   PAYMENT OPTIONS
====================================================== */

const paymentMethodOptions = [
  {
    value: "qris",
    label: "QRIS",
    icon: FaQrcode,
    mark: "QRIS",
    tone: "bg-blue-600 text-white",
  },
  {
    value: "bca_va",
    label: "Virtual Account BCA",
    icon: FaBuildingColumns,
    mark: "BCA",
    tone: "bg-blue-700 text-white",
  },
  {
    value: "bni_va",
    label: "Virtual Account BNI",
    icon: FaBuildingColumns,
    mark: "BNI",
    tone: "bg-orange-500 text-white",
  },
  {
    value: "bri_va",
    label: "Virtual Account BRI",
    icon: FaBuildingColumns,
    mark: "BRI",
    tone: "bg-blue-500 text-white",
  },
  {
    value: "mandiri_va",
    label: "Virtual Account Mandiri",
    icon: FaBuildingColumns,
    mark: "MANDIRI",
    tone: "bg-yellow-300 text-deep-navy",
  },
  {
    value: "cimb_va",
    label: "Virtual Account CIMB Niaga",
    icon: FaBuildingColumns,
    mark: "CIMB",
    tone: "bg-red-600 text-white",
  },
  {
    value: "gopay",
    label: "GoPay",
    icon: FaWallet,
    mark: "GoPay",
    tone: "bg-green-500 text-white",
  },
  {
    value: "shopeepay",
    label: "ShopeePay",
    icon: FaStore,
    mark: "SPay",
    tone: "bg-orange-600 text-white",
  },
];

/* ======================================================
   PROGRESS
====================================================== */

function CheckoutProgress({
  isCheckoutStep,
  paymentDetails,
}) {
  const activeIndex = paymentDetails
    ? 2
    : isCheckoutStep
      ? 1
      : 0;

  const steps = ["Paket", "Data", "Bayar"];

  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      {steps.map((label, index) => {
        const active = index <= activeIndex;

        return (
          <div key={label}>
            <div className="flex items-center">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[8px] font-black ${
                  active
                    ? "bg-brand-blue text-white"
                    : "bg-deep-navy/[0.06] text-deep-navy/30"
                }`}
              >
                0{index + 1}
              </span>

              {index < steps.length - 1 && (
                <span
                  className={`mx-2 h-px flex-1 ${
                    index < activeIndex
                      ? "bg-brand-blue"
                      : "bg-deep-navy/10"
                  }`}
                />
              )}
            </div>

            <p
              className={`mt-1.5 text-[8px] font-black uppercase tracking-[0.1em] ${
                active
                  ? "text-deep-navy"
                  : "text-deep-navy/30"
              }`}
            >
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ======================================================
   FLASH SALE CARD
====================================================== */

function FlashSaleCard({
  service,
  onOpen,
}) {
  const benefits = getServiceBenefits(
    service.description,
    service.benefits
  );

  const timeRemaining = service.flashSaleEndsAt
    ? getTimeRemaining(service.flashSaleEndsAt)
    : null;

  const ServiceIcons = getServiceIcons(service.name);

  return (
    <article className="group flex w-[84vw] max-w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-[22px] border border-deep-navy/10 bg-white text-deep-navy shadow-[0_12px_28px_rgb(0_0_0_/_13%)] sm:w-[310px] lg:w-[320px]">
      <div className="border-b border-deep-navy/10 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center gap-1 rounded-xl bg-brand-surface-alt text-sm text-brand-blue ring-1 ring-deep-navy/10 sm:h-11 sm:w-11 sm:text-base">
            {ServiceIcons.map((Icon) => (
              <Icon key={Icon.name} />
            ))}
          </div>

          <span className="rounded-full bg-hot-pink px-2.5 py-1.5 text-[8px] font-black uppercase tracking-[0.08em] text-deep-navy">
            Hemat {service.discount}%
          </span>
        </div>

        <p className="mt-4 text-[8px] font-black uppercase tracking-[0.15em] text-brand-blue">
          {service.category}
        </p>

        <h4 className="mt-1 line-clamp-2 min-h-[42px] text-[18px] font-black leading-[1.15] tracking-[-0.02em]">
          {service.name}
        </h4>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            {service.originalPrice && (
              <p className="text-[10px] font-bold text-deep-navy/35 line-through">
                {service.originalPrice}
              </p>
            )}

            <p className="mt-1 text-[25px] font-black leading-none tracking-[-0.04em] text-orange">
              {service.price}
            </p>
          </div>

          <p className="max-w-[90px] text-right text-[9px] font-bold leading-4 text-deep-navy/45">
            {service.duration || "Sesuai kebutuhan"}
          </p>
        </div>

        {timeRemaining && (
          <div className="mt-3 rounded-xl bg-hot-pink/10 p-2.5">
            <div className="grid grid-cols-4 gap-1">
              {[
                {
                  value: timeRemaining.days,
                  label: "Hari",
                },
                {
                  value: formatTime(timeRemaining.hours),
                  label: "Jam",
                },
                {
                  value: formatTime(timeRemaining.minutes),
                  label: "Min",
                },
                {
                  value: formatTime(timeRemaining.seconds),
                  label: "Det",
                },
              ].map((item) => (
                <div
                  className="rounded-lg bg-white px-1 py-1.5 text-center"
                  key={item.label}
                >
                  <span className="block text-xs font-black tabular-nums">
                    {item.value}
                  </span>

                  <span className="mt-0.5 block text-[6px] font-black uppercase tracking-[0.08em] text-deep-navy/35">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="mt-3 line-clamp-2 text-[11px] leading-[18px] text-deep-navy/55">
          {service.description}
        </p>

        <ul className="mt-3 grid gap-1.5">
          {benefits.slice(0, 2).map((benefit) => (
            <li
              className="flex items-start gap-2"
              key={benefit}
            >
              <span className="mt-[2px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-blue/10">
                <FaCheck className="text-[7px] text-brand-blue" />
              </span>

              <span className="line-clamp-1 text-[10px] font-bold leading-4 text-deep-navy/70">
                {benefit}
              </span>
            </li>
          ))}
        </ul>

        <button
          className="mt-auto pt-4"
          type="button"
          onClick={() => onOpen(service)}
        >
          <span className="flex min-h-10 w-full items-center justify-between rounded-full border border-deep-navy/20 px-4 text-[11px] font-black transition hover:border-orange hover:bg-orange">
            Lihat rincian

            <FaArrowRight className="text-[9px]" />
          </span>
        </button>
      </div>
    </article>
  );
}

/* ======================================================
   SERVICE CARD
====================================================== */

function ServiceCard({
  service,
  onOpen,
}) {
  const benefits = getServiceBenefits(
    service.description,
    service.benefits
  );

  const ServiceIcons = getServiceIcons(service.name);
  const flashSaleActive = isFlashSaleActive(service);

  const timeRemaining = service.flashSaleEndsAt
    ? getTimeRemaining(service.flashSaleEndsAt)
    : null;

  return (
    <motion.article
      className="
        group relative flex
        w-[84vw] max-w-[320px]
        shrink-0 snap-start flex-col
        overflow-hidden rounded-[22px]
        border border-brand-blue/25
        bg-deep-navy text-white
        shadow-[0_12px_28px_rgb(23_36_61_/_18%)]
        sm:w-[310px]
        lg:w-[320px]
      "
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      <div className="border-b border-white/10 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center gap-1 rounded-xl bg-white text-sm text-brand-blue sm:h-11 sm:w-11 sm:text-base">
            {ServiceIcons.map((Icon) => (
              <Icon key={Icon.name} />
            ))}
          </div>

          <div className="flex flex-wrap justify-end gap-1">
            {service.isRecommended && (
              <span className="rounded-full bg-brand-blue px-2 py-1.5 text-[7px] font-black uppercase tracking-[0.06em] text-white">
                Rekomendasi
              </span>
            )}

            {flashSaleActive && (
              <span className="rounded-full bg-hot-pink px-2 py-1.5 text-[7px] font-black uppercase text-deep-navy">
                -{service.discount}%
              </span>
            )}
          </div>
        </div>

        <p className="mt-4 text-[8px] font-black uppercase tracking-[0.15em] text-white/45">
          {service.category}
        </p>

        <h4 className="mt-1 line-clamp-2 min-h-[42px] text-[18px] font-black leading-[1.15] tracking-[-0.02em] sm:text-[19px]">
          {service.name}
        </h4>

        <p className="mt-2 line-clamp-2 min-h-[36px] text-[11px] leading-[18px] text-white/55">
          {service.description}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            {flashSaleActive &&
              service.originalPrice && (
                <p className="text-[9px] font-bold text-white/35 line-through">
                  {service.originalPrice}
                </p>
              )}

            <p className="mt-1 truncate text-[24px] font-black leading-none tracking-[-0.035em] text-orange">
              {getCurrentServicePrice(service)}
            </p>
          </div>

          <p className="max-w-[90px] shrink-0 text-right text-[9px] font-bold leading-4 text-white/45">
            {service.duration || "Sesuai kebutuhan"}
          </p>
        </div>

        {flashSaleActive && timeRemaining && (
          <div className="mt-3 flex items-center justify-between rounded-lg bg-hot-pink/10 px-2.5 py-2">
            <span className="text-[7px] font-black uppercase tracking-[0.08em] text-hot-pink">
              Promo aktif
            </span>

            <span className="text-[8px] font-black text-hot-pink">
              {timeRemaining.days}H{" "}
              {formatTime(timeRemaining.hours)}:
              {formatTime(timeRemaining.minutes)}
            </span>
          </div>
        )}

        <ul className="mt-3 grid gap-1.5">
          {benefits.slice(0, 2).map((benefit) => (
            <li
              className="flex items-start gap-2"
              key={benefit}
            >
              <span className="mt-[2px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-blue/20">
                <FaCheck className="text-[7px] text-brand-blue-light" />
              </span>

              <span className="line-clamp-1 text-[10px] font-bold leading-4 text-white/75">
                {benefit}
              </span>
            </li>
          ))}
        </ul>

        {benefits.length > 2 && (
          <p className="mt-2 pl-6 text-[8px] font-bold text-white/35">
            +{benefits.length - 2} benefit lainnya
          </p>
        )}

        <button
          className="mt-auto pt-4"
          type="button"
          onClick={() => onOpen(service)}
        >
          <span className="flex min-h-10 w-full items-center justify-between rounded-full border border-white/25 px-4 text-[11px] font-black text-white transition hover:border-orange hover:bg-orange hover:text-deep-navy">
            Lihat rincian

            <FaArrowRight className="text-[9px]" />
          </span>
        </button>
      </div>
    </motion.article>
  );
}

/* ======================================================
   MAIN
====================================================== */

export default function ServicesSection({ content }) {
  const [serviceGroups, setServiceGroups] =
    useState(content || []);

  const [activeCategories, setActiveCategories] =
    useState([]);

  const [recommendedServiceNames, setRecommendedServiceNames] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [, setCountdownTick] =
    useState(0);

  const [selectedService, setSelectedService] =
    useState(null);

  const [isCheckoutStep, setIsCheckoutStep] =
    useState(false);

  const [paymentDetails, setPaymentDetails] =
    useState(null);

  const [paymentMethod, setPaymentMethod] =
    useState("qris");

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [couponCode, setCouponCode] =
    useState("");

  const [couponPreview, setCouponPreview] =
    useState(null);

  const [isApplyingCoupon, setIsApplyingCoupon] =
    useState(false);

  const [paymentError, setPaymentError] =
    useState("");

  const [isCreatingPayment, setIsCreatingPayment] =
    useState(false);

  const flashSaleRailRef = useRef(null);
  const serviceRailRef = useRef(null);

  /* ====================================================
     DATA
  ==================================================== */

  useEffect(() => {
    setServiceGroups(content || []);
    setIsLoading(false);

    setError(
      content
        ? ""
        : "Daftar layanan belum dapat dimuat."
    );
  }, [content]);

  const services = (serviceGroups || []).flatMap(
    (group) =>
      (group.services || []).map((service) => ({
        ...service,
        category: group.category,
      }))
  );

  const filteredServices = recommendedServiceNames.length
    ? services.filter((service) => recommendedServiceNames.includes(service.name))
    : activeCategories.length
      ? services.filter((service) => activeCategories.includes(service.category))
      : services;

  const flashSaleServices =
    services.filter(
      (service) => isFlashSaleActive(service)
    );

  const flashSaleDeadlineKey =
    flashSaleServices
      .map(
        (service) =>
          `${service.name}-${
            service.flashSaleEndsAt || ""
          }`
      )
      .join("|");

  /* ====================================================
     TIMER
  ==================================================== */

  useEffect(() => {
    if (!flashSaleDeadlineKey) {
      return undefined;
    }

    const updateCountdown = () =>
      setCountdownTick(Date.now());

    updateCountdown();

    const interval =
      window.setInterval(
        updateCountdown,
        1000
      );

    return () =>
      window.clearInterval(interval);
  }, [flashSaleDeadlineKey]);

  /* ====================================================
     QUERY FILTER
  ==================================================== */

  useEffect(() => {
    const filter =
      new URLSearchParams(
        window.location.search
      ).get("filter");

    if (filter === "flash-sale") {
      setActiveCategories([]);
    }
  }, []);

  useEffect(() => {
    function applyServiceFilter(event) {
      const serviceNames = event.detail || [];
      setRecommendedServiceNames(serviceNames);
      const catalogServices = serviceGroups.flatMap((group) => (group.services || []).map((service) => ({ ...service, category: group.category })));
      setActiveCategories([...new Set(catalogServices.filter((service) => serviceNames.includes(service.name)).map((service) => service.category))]);
    }

    window.addEventListener("service-filter-change", applyServiceFilter);
    const serviceFilter = new URLSearchParams(window.location.search).get("serviceFilter");
    if (serviceFilter) applyServiceFilter({ detail: serviceFilter.split("|").filter(Boolean) });
    return () => window.removeEventListener("service-filter-change", applyServiceFilter);
  }, [serviceGroups]);

  /* ====================================================
     MODAL BODY LOCK
  ==================================================== */

  useEffect(() => {
    if (!selectedService) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedService(null);
        setIsCheckoutStep(false);
        setPaymentDetails(null);
      }
    };

    document.body.style.overflow = "hidden";

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [selectedService]);

  /* ====================================================
     PAYMENT POLLING
  ==================================================== */

  useEffect(() => {
    if (
      !paymentDetails?.orderId ||
      ["SETTLEMENT", "CAPTURE"].includes(
        paymentDetails.status
      )
    ) {
      return undefined;
    }

    const checkPaymentStatus = async () => {
      const response = await fetch(
        `/api/payments/midtrans?orderId=${encodeURIComponent(
          paymentDetails.orderId
        )}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) return;

      const result =
        await response.json();

      if (
        ["SETTLEMENT", "CAPTURE"].includes(
          result.order?.status
        )
      ) {
        setPaymentDetails((current) => ({
          ...current,
          status: result.order.status,
          paidAt: result.order.paidAt,
        }));
      }
    };

    checkPaymentStatus();

    const interval =
      window.setInterval(
        checkPaymentStatus,
        3000
      );

    return () =>
      window.clearInterval(interval);
  }, [paymentDetails]);

  /* ====================================================
     PAYMENT
  ==================================================== */

  async function startPayment(event) {
    event.preventDefault();

    setIsCreatingPayment(true);
    setPaymentError("");

    try {
      const response = await fetch(
        "/api/payments/midtrans",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            serviceId:
              selectedService.id,
            customer,
            couponCode,
            paymentMethod,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Checkout belum dapat dibuat."
        );
      }

      if (!result.payment) {
        throw new Error(
          "Instruksi pembayaran belum tersedia. Silakan coba lagi."
        );
      }

      setPaymentDetails({
        ...result.payment,
        orderId: result.orderId,
        summary: result.summary,
      });
    } catch (error) {
      setPaymentError(error.message);
    } finally {
      setIsCreatingPayment(false);
    }
  }

  async function applyCoupon() {
    setIsApplyingCoupon(true);
    setPaymentError("");

    try {
      const response = await fetch(
        "/api/payments/coupon",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            serviceId:
              selectedService.id,
            couponCode,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Kupon tidak dapat digunakan."
        );
      }

      setCouponPreview(result);
    } catch (error) {
      setCouponPreview(null);
      setPaymentError(error.message);
    } finally {
      setIsApplyingCoupon(false);
    }
  }

  /* ====================================================
     HANDLERS
  ==================================================== */

  const scrollRail = (
    railRef,
    direction,
    distance = 340
  ) => {
    railRef.current?.scrollBy({
      left: direction * distance,
      behavior: "smooth",
    });
  };

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

  /* ====================================================
     RENDER
  ==================================================== */

  return (
    <section className="relative overflow-hidden bg-white px-4 py-12 text-deep-navy [content-visibility:auto] [contain-intrinsic-size:900px] sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="brand-top-line absolute inset-x-0 top-0 z-10 h-1" />

      <div className="relative z-10 mx-auto max-w-[1280px]">
        {/* =================================================
            INTRO
        ================================================= */}

        <div className="grid gap-6 border-b border-deep-navy/10 pb-7 lg:grid-cols-[1.2fr_.8fr] lg:items-end lg:gap-16 lg:pb-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-7 rounded-full bg-orange" />

              <p
                id="layanan"
                className="scroll-mt-[82px] text-xs font-black uppercase tracking-[0.24em] text-orange sm:text-sm"
              >
                Layanan Sebisa Project
              </p>
            </div>

            <h2 className="mt-3 max-w-[780px] text-4xl font-black uppercase leading-[0.96] tracking-[-0.04em] text-deep-navy sm:text-6xl lg:text-[60px]">
              Pilih layanan yang membantu
              <span className="block text-brand-blue">
                idemu berkembang.
              </span>
            </h2>

            <p className="mt-5 max-w-[620px] text-base leading-7 text-brand-muted sm:text-lg">
              Dari strategi konten sampai website
              dan iklan digital, pilih solusi
              sesuai tujuan bisnismu.
            </p>
          </div>

          {/* MOBILE TRUST / DESKTOP STEPS */}

          <div className="grid grid-cols-3 divide-x divide-deep-navy/10 rounded-[18px] border border-deep-navy/10 bg-brand-surface px-3 py-4 shadow-[0_8px_22px_rgb(23_36_61_/_5%)] sm:px-4">
            {[
              ["01", "Pilih"],
              ["02", "Bandingkan"],
              ["03", "Mulai"],
            ].map(([number, label]) => (
              <div
                className="px-2 first:pl-1 last:pr-1"
                key={number}
              >
                <span className="text-sm font-black text-brand-blue sm:text-lg">
                  {number}
                </span>

                <p className="mt-0.5 text-[8px] font-bold text-deep-navy/50 sm:text-[10px]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p className="mt-8 text-sm text-deep-navy/60">
            Memuat daftar layanan...
          </p>
        ) : error ? (
          <p className="mt-8 text-sm text-orange">
            {error}
          </p>
        ) : (
          <>
            {/* =================================================
                FLASH SALE
            ================================================= */}

            {flashSaleServices.length > 0 && (
              <section className="mt-7 sm:mt-10">
                <div className="overflow-hidden rounded-[24px] border border-hot-pink/30 bg-deep-navy text-white shadow-[0_14px_32px_rgb(23_36_61_/_16%)] sm:rounded-[28px]">
                  <div className="border-b border-white/15 px-4 py-4 sm:px-6 sm:py-6">
                    <div className="flex items-end justify-between gap-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-hot-pink px-2.5 py-1 text-[8px] font-black uppercase text-deep-navy">
                            Limited Project Slots
                          </span>

                          <span className="text-[8px] font-black uppercase tracking-[0.14em] text-orange">
                            Slot proyek terbatas
                          </span>
                        </div>

                        <h3 className="mt-2 max-w-lg text-[22px] font-black uppercase leading-none tracking-[-0.03em] sm:text-3xl">
                          Paket pilihan dengan harga spesial.
                        </h3>

                        <p className="mt-2 max-w-md text-[11px] leading-5 text-white/50 sm:text-sm sm:leading-6">
                          Promo terbatas untuk layanan
                          terpilih.
                        </p>
                      </div>

                      <div className="hidden gap-2 sm:flex">
                        <button
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 transition hover:border-orange hover:bg-orange hover:text-deep-navy"
                          type="button"
                          onClick={() =>
                            scrollRail(
                              flashSaleRailRef,
                              -1
                            )
                          }
                        >
                          <FaArrowLeft />
                        </button>

                        <button
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 transition hover:border-orange hover:bg-orange hover:text-deep-navy"
                          type="button"
                          onClick={() =>
                            scrollRail(
                              flashSaleRailRef,
                              1
                            )
                          }
                        >
                          <FaArrowRight />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-4 sm:px-5 sm:py-5">
                    <div
                      ref={flashSaleRailRef}
                      className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {flashSaleServices.map(
                        (service) => (
                          <FlashSaleCard
                            key={`flash-${service.name}`}
                            service={service}
                            onOpen={openService}
                          />
                        )
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between sm:hidden">
                      <span className="text-[8px] font-black uppercase tracking-[0.1em] text-white/35">
                        {
                          flashSaleServices.length
                        }{" "}
                        promo
                      </span>

                      <span className="flex items-center gap-1.5 text-[8px] font-bold text-white/35">
                        Geser
                        <FaArrowRight />
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* =================================================
                SERVICES
            ================================================= */}

            <section id="layanan-katalog" className="scroll-mt-[82px] mt-9 sm:mt-12">
              <div className="flex items-end justify-between gap-5">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-brand-blue">
                    Jelajahi layanan
                  </p>

                  <h3 className="mt-1.5 max-w-xl text-[25px] font-black leading-[1] tracking-[-0.035em] sm:text-4xl">
                    Solusi sesuai kebutuhanmu.
                  </h3>

                  <p className="mt-2 max-w-lg text-[12px] leading-5 text-brand-muted sm:text-sm sm:leading-6">
                    Filter berdasarkan bidang,
                    lalu geser untuk membandingkan
                    di perangkat mobile.
                  </p>
                </div>

                <div className="hidden items-center gap-2 lg:flex">
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-deep-navy/20 transition hover:border-orange hover:bg-orange"
                    type="button"
                    onClick={() =>
                      scrollRail(
                        serviceRailRef,
                        -1
                      )
                    }
                  >
                    <FaArrowLeft />
                  </button>

                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-deep-navy/20 transition hover:border-orange hover:bg-orange"
                    type="button"
                    onClick={() =>
                      scrollRail(
                        serviceRailRef,
                        1
                      )
                    }
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </div>

              {/* FILTER */}

              <div className="sticky top-[72px] z-30 -mx-4 mt-4 border-y border-deep-navy/[0.06] bg-white/95 px-4 py-2.5 backdrop-blur-xl sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
                <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <button
                    className={`min-h-9 shrink-0 rounded-full px-3.5 text-[10px] font-bold transition ${
                      !activeCategories.length && !recommendedServiceNames.length
                        ? "border border-deep-navy bg-orange text-deep-navy"
                        : "border border-deep-navy/15 bg-white text-deep-navy/65 hover:border-orange hover:bg-orange/10"
                    }`}
                    type="button"
                    onClick={() => {
                      setActiveCategories([]);
                      setRecommendedServiceNames([]);
                    }}
                  >
                    Semua bidang
                  </button>

                  {serviceGroups.map(
                    (group) => (
                      <button
                        key={
                          group.id ||
                          group.category
                        }
                        className={`min-h-9 shrink-0 rounded-full px-3.5 text-[10px] font-bold transition ${
                          activeCategories.includes(group.category)
                            ? "border border-deep-navy bg-orange text-deep-navy"
                            : "border border-deep-navy/15 bg-white text-deep-navy/65 hover:border-orange hover:bg-orange/10"
                        }`}
                        type="button"
                        onClick={() => {
                          setRecommendedServiceNames([]);
                          setActiveCategories((currentCategories) => currentCategories.includes(group.category)
                            ? currentCategories.filter((category) => category !== group.category)
                            : [...currentCategories, group.category]);
                        }}
                      >
                        {group.category}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* HORIZONTAL RAIL */}

              <div
                ref={serviceRailRef}
                className={`
                  mt-4
                  flex snap-x snap-mandatory
                  gap-3 overflow-x-auto pb-3
                  [scrollbar-width:none]
                  [&::-webkit-scrollbar]:hidden
                  ${filteredServices.length === 1 ? "justify-center" : ""}
                `}
              >
                {filteredServices.map(
                  (service) => (
                    <ServiceCard
                      key={service.name}
                      service={service}
                      onOpen={openService}
                    />
                  )
                )}
              </div>

              {/* RAIL INDICATOR */}

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[8px] font-bold text-deep-navy/35">
                  {filteredServices.length} layanan
                </span>

                <span className="flex items-center gap-1.5 text-[8px] font-bold text-deep-navy/35">
                  Geser untuk melihat lainnya
                  <FaArrowRight />
                </span>
              </div>
            </section>

            {/* =================================================
                CONSULTATION CTA
            ================================================= */}

            <section className="mt-8 overflow-hidden rounded-[24px] border border-deep-navy/10 bg-brand-surface shadow-[0_12px_30px_rgb(23_36_61_/_6%)] sm:mt-12 sm:rounded-[28px]">
              <div className="grid lg:grid-cols-[1.1fr_.9fr]">
                <div className="p-5 sm:p-8 lg:p-10">
                  <p className="text-[9px] font-black uppercase tracking-[0.17em] text-brand-blue">
                    Masih bingung memilih?
                  </p>

                  <h3 className="mt-2 max-w-lg text-[26px] font-black uppercase leading-[0.97] tracking-[-0.035em] sm:text-4xl">
                    Ceritakan kebutuhanmu.
                    <span className="block text-brand-blue">
                      Kami bantu arahkan.
                    </span>
                  </h3>

                  <p className="mt-3 max-w-lg text-[12px] leading-5 text-brand-muted sm:text-sm sm:leading-6">
                    Diskusikan target, kondisi
                    brand, dan budget sebelum
                    menentukan layanan.
                  </p>

                  <ScrollLink
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-orange bg-orange px-5 text-[11px] font-black uppercase tracking-[0.07em] text-deep-navy transition hover:border-brand-blue hover:bg-brand-blue hover:text-white sm:w-auto sm:px-6"
                    href="#konsultasi"
                  >
                    Konsultasikan Kebutuhanmu
                  </ScrollLink>
                </div>

                <div className="hidden bg-deep-navy p-8 text-white lg:flex lg:flex-col lg:justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl text-brand-blue">
                    <FaChartLine />
                  </div>

                  <div className="mt-10">
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-orange">
                      Sebisa Project
                    </p>

                    <p className="mt-2 max-w-sm text-[21px] font-black leading-[1.1]">
                      Digital bukan soal melakukan
                      semuanya. Yang penting melakukan
                      hal yang tepat.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      {/* =================================================
          MODAL
      ================================================= */}

      {selectedService &&
      typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-deep-navy/75 p-3 backdrop-blur-sm sm:p-4"
              role="dialog"
              aria-modal="true"
              onMouseDown={(event) => {
                if (
                  event.target ===
                  event.currentTarget
                ) {
                  closeModal();
                }
              }}
            >
              <motion.div
                className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[26px] bg-brand-surface text-deep-navy shadow-2xl sm:max-w-xl sm:rounded-[26px]"
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.22,
                }}
              >
                {/* MOBILE HANDLE */}

                <div className="flex justify-center pb-1 pt-2.5 sm:hidden">
                  <span className="h-1 w-9 rounded-full bg-deep-navy/15" />
                </div>

                {/* HEADER */}

                <div className="relative shrink-0 border-b border-deep-navy/10 px-5 pb-4 pt-2 sm:px-7 sm:pb-5 sm:pt-6">
                  <button
                    aria-label="Tutup"
                    className="absolute right-4 top-2 flex h-9 w-9 items-center justify-center rounded-full text-deep-navy/60 transition hover:bg-hot-pink hover:text-white sm:right-5 sm:top-5"
                    type="button"
                    onClick={closeModal}
                  >
                    <FaXmark />
                  </button>

                  <p className="pr-12 text-[8px] font-black uppercase tracking-[0.16em] text-brand-blue">
                    {selectedService.category}
                  </p>

                  <h2 className="mt-1 pr-12 text-[22px] font-black leading-[1.08] tracking-[-0.025em] sm:text-3xl">
                    {selectedService.name}
                  </h2>

                  <CheckoutProgress
                    isCheckoutStep={
                      isCheckoutStep
                    }
                    paymentDetails={
                      paymentDetails
                    }
                  />
                </div>

                {/* BODY */}

                <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-4 sm:px-7 sm:pb-7">
                  {!isCheckoutStep && (
                    <>
                      <div className="rounded-[16px] bg-brand-surface-alt p-4">
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            {isFlashSaleActive(selectedService) &&
                              selectedService.originalPrice && (
                                <p className="text-[10px] font-bold text-deep-navy/35 line-through">
                                  {
                                    selectedService.originalPrice
                                  }
                                </p>
                              )}

                            <p className="mt-1 text-[26px] font-black leading-none tracking-[-0.04em] text-brand-blue">
                              {getCurrentServicePrice(selectedService)}
                            </p>
                          </div>

                          <p className="max-w-[120px] text-right text-[10px] font-bold leading-4 text-deep-navy/50">
                            {selectedService.duration ||
                              "Sesuai kebutuhan"}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-[12px] leading-5 text-brand-muted">
                        {
                          selectedService.description
                        }
                      </p>

                      <div className="mt-5">
                        <p className="text-xs font-black">
                          Yang kamu dapat
                        </p>

                        <ul className="mt-2.5 grid gap-2">
                          {getServiceBenefits(
                            selectedService.description,
                            selectedService.benefits
                          ).map((benefit) => (
                            <li
                              className="flex items-start gap-2.5 rounded-xl border border-deep-navy/10 p-3"
                              key={benefit}
                            >
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-blue/10">
                                <FaCheck className="text-[8px] text-brand-blue" />
                              </span>

                              <span className="text-[12px] font-bold leading-5 text-deep-navy/70">
                                {benefit}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        className="mt-5 min-h-11 w-full rounded-full bg-orange px-5 text-[12px] font-black text-deep-navy transition hover:bg-brand-blue hover:text-white disabled:opacity-60"
                        disabled={
                          !selectedService.id
                        }
                        type="button"
                        onClick={() =>
                          setIsCheckoutStep(true)
                        }
                      >
                        Beli layanan ini
                      </button>

                      <a
                        className="mt-2.5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-deep-navy/20 px-5 text-[11px] font-black transition hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
                        href={getServiceQuestionLink(
                          selectedService
                        )}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <FaWhatsapp />

                        Tanya lewat WhatsApp
                      </a>
                    </>
                  )}

                  {/* CHECKOUT */}

                  {isCheckoutStep &&
                    !paymentDetails && (
                      <form
                        className="grid gap-4"
                        onSubmit={startPayment}
                      >
                        <div>
                          <p className="text-sm font-black">
                            Data pembeli
                          </p>

                          <p className="mt-1 text-[11px] leading-5 text-brand-muted">
                            Data digunakan untuk transaksi
                            dan konfirmasi layanan.
                          </p>
                        </div>

                        <label className="grid gap-1.5">
                          <span className="text-[11px] font-bold">
                            Nama lengkap
                          </span>

                          <input
                            required
                            autoComplete="name"
                            className="min-h-12 rounded-xl border border-deep-navy/15 px-4 text-[16px] outline-none focus:border-brand-blue"
                            value={customer.name}
                            onChange={(event) =>
                              setCustomer({
                                ...customer,
                                name:
                                  event.target.value,
                              })
                            }
                          />
                        </label>

                        <label className="grid gap-1.5">
                          <span className="text-[11px] font-bold">
                            Email
                          </span>

                          <input
                            required
                            type="email"
                            autoComplete="email"
                            className="min-h-12 rounded-xl border border-deep-navy/15 px-4 text-[16px] outline-none focus:border-brand-blue"
                            value={customer.email}
                            onChange={(event) =>
                              setCustomer({
                                ...customer,
                                email:
                                  event.target.value,
                              })
                            }
                          />
                        </label>

                        <label className="grid gap-1.5">
                          <span className="text-[11px] font-bold">
                            WhatsApp
                          </span>

                          <input
                            required
                            type="tel"
                            autoComplete="tel"
                            className="min-h-12 rounded-xl border border-deep-navy/15 px-4 text-[16px] outline-none focus:border-brand-blue"
                            value={customer.phone}
                            onChange={(event) =>
                              setCustomer({
                                ...customer,
                                phone:
                                  event.target.value,
                              })
                            }
                          />
                        </label>

                        <label className="grid gap-1.5">
                          <span className="text-[11px] font-bold">
                            Kupon
                          </span>

                          <div className="flex gap-2">
                            <input
                              className="min-h-12 min-w-0 flex-1 rounded-xl border border-deep-navy/15 px-4 text-[16px] uppercase outline-none focus:border-brand-blue"
                              value={couponCode}
                              onChange={(
                                event
                              ) => {
                                setCouponCode(
                                  event.target.value.toUpperCase()
                                );

                                setCouponPreview(
                                  null
                                );
                              }}
                            />

                            <button
                              className="rounded-xl border border-deep-navy px-4 text-[10px] font-black transition hover:bg-orange disabled:opacity-60"
                              type="button"
                              disabled={
                                isApplyingCoupon ||
                                couponCode.trim()
                                  .length < 3
                              }
                              onClick={
                                applyCoupon
                              }
                            >
                              {isApplyingCoupon
                                ? "Cek..."
                                : "Pakai"}
                            </button>
                          </div>
                        </label>

                        {couponPreview && (
                          <div className="grid gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[11px]">
                            <div className="flex justify-between gap-3">
                              <span>
                                Harga layanan
                              </span>

                              <span>
                                {formatCurrency(
                                  couponPreview.originalAmount
                                )}
                              </span>
                            </div>

                            <div className="flex justify-between gap-3 text-emerald-700">
                              <span>
                                Diskon
                              </span>

                              <span>
                                -
                                {formatCurrency(
                                  couponPreview.discountAmount
                                )}
                              </span>
                            </div>

                            <div className="flex justify-between gap-3 border-t border-emerald-200 pt-2 text-sm font-black">
                              <span>
                                Total
                              </span>

                              <span>
                                {formatCurrency(
                                  couponPreview.totalAmount
                                )}
                              </span>
                            </div>
                          </div>
                        )}

                        <fieldset>
                          <legend className="text-sm font-black">
                            Metode pembayaran
                          </legend>

                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            {paymentMethodOptions.map(
                              (option) => {
                                const Icon =
                                  option.icon;

                                const selected =
                                  paymentMethod ===
                                  option.value;

                                return (
                                  <label
                                    className={`flex min-h-[62px] cursor-pointer items-center gap-3 rounded-xl border p-2.5 ${
                                      selected
                                        ? "border-brand-blue bg-brand-blue/10 ring-2 ring-brand-blue/15"
                                        : "border-deep-navy/12"
                                    }`}
                                    key={
                                      option.value
                                    }
                                  >
                                    <input
                                      className="sr-only"
                                      type="radio"
                                      name="payment"
                                      checked={
                                        selected
                                      }
                                      onChange={() =>
                                        setPaymentMethod(
                                          option.value
                                        )
                                      }
                                    />

                                    <span
                                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${option.tone}`}
                                    >
                                      <Icon />
                                    </span>

                                    <span className="min-w-0">
                                      <span className="block text-[10px] font-black">
                                        {
                                          option.mark
                                        }
                                      </span>

                                      <span className="block truncate text-[9px] text-slate-500">
                                        {
                                          option.label
                                        }
                                      </span>
                                    </span>
                                  </label>
                                );
                              }
                            )}
                          </div>
                        </fieldset>

                        {paymentError && (
                          <p className="rounded-xl bg-hot-pink/10 p-3 text-[11px] font-bold">
                            {
                              paymentError
                            }
                          </p>
                        )}

                        <button
                          className="min-h-12 rounded-full bg-orange px-5 text-[12px] font-black text-deep-navy transition hover:bg-brand-blue hover:text-white disabled:opacity-60"
                          disabled={
                            isCreatingPayment ||
                            !selectedService.id
                          }
                          type="submit"
                        >
                          {isCreatingPayment
                            ? "Menyiapkan pembayaran..."
                            : "Lanjut ke pembayaran"}
                        </button>
                      </form>
                    )}

                  {/* PAYMENT */}

                  {isCheckoutStep &&
                    paymentDetails &&
                    ([
                      "SETTLEMENT",
                      "CAPTURE",
                    ].includes(
                      paymentDetails.status
                    ) ? (
                      <div>
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700">
                          <FaCheck />
                        </div>

                        <h3 className="mt-3 text-center text-xl font-black text-emerald-700">
                          Pembayaran berhasil
                        </h3>

                        <div className="mt-5 overflow-hidden rounded-2xl border border-deep-navy/10">
                          <div className="bg-deep-navy p-4">
                            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/60">
                              Invoice pembayaran
                            </p>

                            <p className="mt-1 text-base font-black text-white">
                              {paymentDetails
                                .summary
                                ?.serviceName ||
                                selectedService.name}
                            </p>
                          </div>

                          <div className="grid gap-3 p-4 text-xs">
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500">
                                Order
                              </span>

                              <span className="break-all text-right font-black">
                                {
                                  paymentDetails.orderId
                                }
                              </span>
                            </div>

                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500">
                                Total
                              </span>

                              <span className="font-black text-brand-blue">
                                {formatCurrency(
                                  paymentDetails
                                    .summary
                                    ?.totalAmount
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-orange text-[11px] font-black"
                          type="button"
                          onClick={() =>
                            downloadInvoiceAsPng(
                              paymentDetails.summary || {
                                serviceName:
                                  selectedService.name,
                                duration:
                                  selectedService.duration,
                                customerName:
                                  customer.name,
                                customerEmail:
                                  customer.email,
                                totalAmount: 0,
                                benefits:
                                  getServiceBenefits(
                                    selectedService.description,
                                    selectedService.benefits
                                  ),
                              },
                              paymentDetails.orderId,
                              paymentDetails.paidAt
                            )
                          }
                        >
                          <FaDownload />

                          Simpan invoice
                        </button>

                        <a
                          className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-[11px] font-black text-white"
                          href={getPaymentConfirmationLink(
                            selectedService,
                            paymentDetails.orderId
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaWhatsapp />

                          Konfirmasi WhatsApp
                        </a>
                      </div>
                    ) : (
                      <div>
                        <div className="rounded-2xl bg-deep-navy p-4 text-white">
                          <p className="text-[9px] font-black uppercase text-white/50">
                            Total pembayaran
                          </p>

                          <p className="mt-1 text-xl font-black text-orange">
                            {formatCurrency(
                              paymentDetails.summary
                                ?.totalAmount
                            )}
                          </p>

                          <p className="mt-2 break-all text-[9px] text-white/40">
                            {
                              paymentDetails.orderId
                            }
                          </p>
                        </div>

                        {paymentDetails.vaNumbers
                          ?.length ? (
                          <div className="mt-4 grid gap-2">
                            {paymentDetails.vaNumbers.map(
                              (item) => (
                                <div
                                  className="rounded-xl border border-deep-navy/10 p-4"
                                  key={
                                    item.va_number
                                  }
                                >
                                  <p className="text-[9px] font-bold uppercase text-slate-500">
                                    VA {item.bank}
                                  </p>

                                  <p className="mt-1 break-all text-xl font-black">
                                    {
                                      item.va_number
                                    }
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        ) : null}

                        {paymentDetails.actions?.map(
                          (action) =>
                            action?.url ? (
                              action.name ===
                                "generate-qr-code" ||
                              action.name ===
                                "generate-qr-code-v2" ? (
                                <div
                                  className="mt-4 flex justify-center rounded-xl bg-white p-4"
                                  key={
                                    action.url
                                  }
                                >
                                  <img
                                    className="h-60 w-60 max-w-full"
                                    src={
                                      action.url
                                    }
                                    alt="QR pembayaran"
                                  />
                                </div>
                              ) : (
                                <a
                                  className="mt-4 flex min-h-11 w-full items-center justify-center rounded-full bg-orange text-[11px] font-black text-deep-navy"
                                  href={
                                    action.url
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  key={
                                    action.url
                                  }
                                >
                                  Lanjutkan pembayaran
                                </a>
                              )
                            ) : null
                        )}
                      </div>
                    ))}
                </div>
              </motion.div>
            </div>,
            document.body
          )
        : null}
    </section>
  );
}