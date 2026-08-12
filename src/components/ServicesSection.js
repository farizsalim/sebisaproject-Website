"use client";

import axios from "axios";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCamera,
  FaCartShopping,
  FaChartLine,
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

export default function ServicesSection() {
  const [serviceGroups, setServiceGroups] = useState([]);
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
    const loadServices = async () => {
      try {
        const response = await axios.get("/data/services.json");
        setServiceGroups(response.data);
      } catch {
        setError("Daftar layanan belum dapat dimuat.");
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

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
              {filteredServices.map((service, index) => (
                    <motion.article
                      key={service.name}
                      className={`group relative flex h-[300px] w-[min(82vw,310px)] shrink-0 snap-start flex-col overflow-hidden border-2 border-deep-navy/20 bg-white p-4 text-deep-navy shadow-[5px_5px_0_var(--brand-hot-pink)] transition-colors hover:border-orange hover:shadow-[6px_6px_0_var(--brand-orange)] sm:w-[310px] sm:p-5 lg:h-[310px] ${index % 2 === 1 ? "lg:mt-5" : ""}`}
                      initial={false}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                    >
                      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-blue/10 transition-transform duration-500 group-hover:scale-150" />
                      <div className="relative flex min-h-[62px] items-start justify-between gap-3">
                        <span className="flex h-10 w-10 items-center justify-center border border-brand-blue/40 bg-brand-blue/10 text-sm font-black text-brand-blue">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="flex max-w-[70%] flex-col items-end gap-2 text-right">
                          <p className="max-w-full pt-1 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-deep-navy/70">
                            {service.category}
                          </p>
                          {service.flashSale ? (
                            <span className="border-2 border-deep-navy bg-hot-pink px-2 py-1 text-[10px] font-black uppercase leading-none tracking-[0.08em] text-deep-navy shadow-[2px_2px_0_var(--brand-orange)]">
                              Flash Sale -{service.discount}%
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="relative mt-3 flex h-11 min-w-11 w-fit shrink-0 items-center justify-center gap-2 border-l-2 border-orange bg-brand-surface-alt px-3 text-lg text-deep-navy">
                        {getServiceIcons(service.name).map((ServiceIcon) => (
                          <ServiceIcon key={ServiceIcon.name} aria-hidden="true" />
                        ))}
                      </div>
                      <h4 className="relative mt-4 line-clamp-2 text-base font-black leading-snug text-deep-navy sm:text-lg">
                        {service.name}
                      </h4>
                      <p className="relative mt-2 line-clamp-2 text-xs leading-5 text-slate-600">
                        {service.description}
                      </p>
                      <div className="relative mt-auto flex items-end justify-between gap-3 border-t border-deep-navy/15 pt-3">
                        <div>
                          {service.flashSale ? (
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-hot-pink">
                              Hemat {service.discount}%
                            </p>
                          ) : null}
                          <span className="text-[11px] text-slate-500 line-through">
                            {service.originalPrice}
                          </span>
                        </div>
                        <span className="text-xl font-black text-orange">
                          {service.price}
                        </span>
                      </div>
                    </motion.article>
              ))}
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
