"use client";

import {
  FaArrowLeft,
  FaArrowRight,
  FaCamera,
  FaCartShopping,
  FaChartLine,
  FaCheck,
  FaGlobe,
  FaInstagram,
  FaMicrophone,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa6";
import { motion } from "motion/react";
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

function getPurchaseLink(service) {
  const message = [
    "Halo Sebisa Project, saya ingin membeli paket berikut:",
    `Paket: ${service.name}`,
    `Harga: ${service.price}`,
    `Durasi: ${service.duration || "Sesuai kebutuhan"}`,
  ].join("\n");

  return `https://wa.me/6280000000000?text=${encodeURIComponent(message)}`;
}

export default function ServicesSection({ content }) {
  const [serviceGroups, setServiceGroups] = useState(content || []);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(null);
  const servicesRailRef = useRef(null);

  const scrollServices = (direction) => {
    servicesRailRef.current?.scrollBy({
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
  const flashSaleDeadline = services.find((service) => service.flashSale)?.flashSaleEndsAt;
  const filteredServices =
    activeCategory === "all"
      ? services
      : activeCategory === "flash-sale"
        ? services.filter((service) => service.flashSale)
      : services.filter((service) => service.category === activeCategory);

  useEffect(() => {
    if (!flashSaleDeadline) return undefined;

    const updateCountdown = () => setTimeRemaining(getTimeRemaining(flashSaleDeadline));
    updateCountdown();
    const countdownInterval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(countdownInterval);
  }, [flashSaleDeadline]);

  useEffect(() => {
    const filter = new URLSearchParams(window.location.search).get("filter");

    if (filter === "flash-sale") {
      setActiveCategory("flash-sale");
    }
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-deep-navy bg-cover bg-center px-4 py-14 text-white [content-visibility:auto] [contain-intrinsic-size:900px] [font-family:Arial,sans-serif] sm:px-6 sm:py-16 lg:px-8"
      style={{ backgroundImage: "url('/images/Portofolio.png')" }}
    >
      <div className="brand-photo-overlay absolute inset-0" />
      <div className="brand-top-line absolute inset-x-0 top-0 z-10 h-1" />
      <div className="relative z-10 mx-auto max-w-[1240px]">
        <motion.div
          className="max-w-2xl"
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p id="layanan" className="scroll-mt-[82px] mb-3 text-sm font-black uppercase tracking-[0.24em] text-orange sm:scroll-mt-[102px] sm:text-sm">
            Layanan Sebisa Project
          </p>
          <h2 className="text-3xl font-black uppercase leading-[1.02] tracking-tight text-white [text-shadow:3px_3px_0_var(--brand-deep-navy)] sm:text-5xl lg:text-[52px]">
            Pilih layanan yang membantu idemu berkembang.
          </h2>
          <p className="mt-5 text-base leading-7 text-white/90 sm:text-lg">
            Dari strategi konten sampai website dan iklan digital, kami bantu
            membangun kebutuhan digital bisnismu dengan lebih terarah.
          </p>
        </motion.div>

        <div
          className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Filter bidang layanan"
        >
          <button
            className={`shrink-0 px-3 py-2 text-xs font-bold transition ${
              activeCategory === "all"
                ? "border-2 border-deep-navy bg-orange text-deep-navy shadow-[2px_2px_0_var(--brand-hot-pink)]"
                : "border border-hot-pink/70 text-white/90 hover:border-orange hover:bg-orange hover:text-deep-navy"
            }`}
            type="button"
            onClick={() => setActiveCategory("all")}
          >
            Semua bidang
          </button>
          <button
            className={`shrink-0 px-3 py-2 text-xs font-bold transition ${
              activeCategory === "flash-sale"
                ? "border-2 border-deep-navy bg-hot-pink text-deep-navy shadow-[2px_2px_0_var(--brand-orange)]"
                : "border border-hot-pink/70 text-white/90 hover:border-orange hover:bg-hot-pink hover:text-deep-navy"
            }`}
            type="button"
            onClick={() => setActiveCategory("flash-sale")}
          >
            Flash Sale
          </button>
          {serviceGroups.map((group) => (
            <button
              key={group.id}
              className={`shrink-0 px-3 py-2 text-xs font-bold transition ${
                activeCategory === group.category
                  ? "border-2 border-deep-navy bg-orange text-deep-navy shadow-[2px_2px_0_var(--brand-hot-pink)]"
                  : "border border-hot-pink/70 text-white/90 hover:border-orange hover:bg-orange hover:text-deep-navy"
              }`}
              type="button"
              onClick={() => setActiveCategory(group.category)}
            >
              {group.category}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="mt-12 text-white/70">Memuat daftar layanan...</p>
        ) : error ? (
          <p className="mt-12 text-orange">{error}</p>
        ) : (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="min-w-0 text-lg font-bold sm:text-xl">
                {activeCategory === "all" ? "Semua layanan" : activeCategory === "flash-sale" ? "Layanan Flash Sale" : activeCategory}
              </h3>
              <div className="flex items-center gap-3">
                <span className="hidden text-xs text-white/80 sm:inline">
                  Geser untuk menjelajah
                </span>
                <div className="flex gap-2">
                  <button
                    aria-label="Layanan sebelumnya"
                    className="flex h-9 w-9 items-center justify-center border-2 border-hot-pink text-white transition hover:-translate-y-0.5 hover:border-orange hover:bg-orange hover:text-deep-navy"
                    title="Layanan sebelumnya"
                    type="button"
                    onClick={() => scrollServices(-1)}
                  >
                    <FaArrowLeft aria-hidden="true" />
                  </button>
                  <button
                    aria-label="Layanan berikutnya"
                    className="flex h-9 w-9 items-center justify-center border-2 border-hot-pink text-white transition hover:-translate-y-0.5 hover:border-orange hover:bg-orange hover:text-deep-navy"
                    title="Layanan berikutnya"
                    type="button"
                    onClick={() => scrollServices(1)}
                  >
                    <FaArrowRight aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            {activeCategory === "flash-sale" && timeRemaining ? (
              <div className="mb-2 flex flex-wrap items-center gap-3 border-l-4 border-orange bg-deep-navy/80 px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white">
                <span className="text-orange">Promo berakhir dalam</span>
                <span className="text-base text-white">
                  {timeRemaining.days}H : {formatTime(timeRemaining.hours)}J : {formatTime(timeRemaining.minutes)}M : {formatTime(timeRemaining.seconds)}D
                </span>
              </div>
            ) : null}
            <div
              ref={servicesRailRef}
              className="flex items-stretch snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden pb-8 pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {filteredServices.map((service, index) => {
                const benefits = getServiceBenefits(service.description, service.benefits);
                const isRecommended = service.isRecommended;

                return (
                  <motion.article
                    key={service.name}
                    className={`group relative flex min-h-[465px] w-[min(82vw,310px)] shrink-0 snap-start flex-col overflow-hidden border-2 p-5 text-deep-navy transition sm:w-[310px] sm:p-6 ${isRecommended ? "border-brand-blue bg-brand-surface shadow-[4px_4px_0_var(--brand-blue)]" : "border-deep-navy/15 bg-white shadow-[4px_4px_0_var(--brand-hot-pink)] hover:border-orange hover:shadow-[5px_5px_0_var(--brand-orange)]"} ${index % 2 === 1 ? "lg:mt-5" : ""}`}
                    initial={false}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                  >
                    {isRecommended ? (
                      <span className="relative z-10 mb-4 w-fit bg-brand-blue px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-[2px_2px_0_var(--brand-deep-navy)]">
                        Paling direkomendasikan
                      </span>
                    ) : null}
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center border-l-2 border-orange bg-brand-surface-alt text-lg text-brand-blue">
                        {getServiceIcons(service.name).map((ServiceIcon) => (
                          <ServiceIcon key={ServiceIcon.name} aria-hidden="true" />
                        ))}
                      </div>
                      {service.flashSale ? (
                        <span className="border-2 border-deep-navy bg-hot-pink px-2 py-1 text-[10px] font-black uppercase leading-none tracking-[0.08em] text-deep-navy shadow-[2px_2px_0_var(--brand-orange)]">
                          Flash Sale -{service.discount}%
                        </span>
                      ) : null}
                    </div>
                    <p className="relative mt-5 text-[10px] font-black uppercase tracking-[0.16em] text-deep-navy/60">
                      {service.category}
                    </p>
                    <h4 className="relative mt-2 min-h-[3.4rem] line-clamp-2 text-xl font-black leading-tight text-deep-navy">
                      {service.name}
                    </h4>
                    <div className="relative mt-4 border-b border-deep-navy/15 pb-4">
                      {service.originalPrice ? (
                        <p className="mb-1 flex items-baseline gap-2 text-slate-500">
                          <span className="text-base font-black line-through sm:text-lg">{service.originalPrice}</span>
                          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">harga normal</span>
                        </p>
                      ) : null}
                      <span className="block text-2xl font-black text-orange sm:text-[27px]">
                        {service.price}
                      </span>
                      <p className="mt-1 text-sm text-slate-500">
                        {service.duration || "Sesuai kebutuhan"}
                      </p>
                    </div>
                    <ul className="relative mt-4 grid gap-3 text-sm font-bold leading-5 text-deep-navy/85">
                      {benefits.map((benefit) => (
                        <li className="flex items-start gap-3" key={benefit}>
                          <FaCheck className="mt-1 shrink-0 text-brand-blue" aria-hidden="true" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      className="relative mt-auto inline-flex min-h-11 items-center justify-center border-2 border-deep-navy px-4 py-3 text-center text-sm font-black text-deep-navy transition hover:border-orange hover:bg-orange"
                      href={getPurchaseLink(service)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Beli sekarang
                    </a>
                  </motion.article>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-14 flex justify-center">
          <ScrollLink
            className="border-2 border-deep-navy bg-orange px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-deep-navy shadow-[4px_4px_0_var(--brand-hot-pink)] transition hover:-translate-y-1 hover:bg-white"
            href="#konsultasi"
          >
            Konsultasikan Kebutuhanmu
          </ScrollLink>
        </div>
      </div>
    </section>
  );
}
