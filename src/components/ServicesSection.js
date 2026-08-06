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
  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter((service) => service.category === activeCategory);

  return (
    <section
      id="layanan"
      className="relative overflow-hidden bg-[#00132d] px-4 py-14 text-white [font-family:Arial,sans-serif] sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#17E9E5_0%,#DF00A8_50%,#FFB400_100%)]" />
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          className="max-w-2xl"
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#17E9E5]">
            Layanan Sebisa Project
          </p>
          <h2 className="text-3xl font-black leading-tight sm:text-4xl">
            Pilih layanan yang membantu idemu berkembang.
          </h2>
          <p className="mt-5 text-base leading-7 text-white/70 sm:text-lg">
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
                ? "bg-[#FBCD2F] text-[#00132d]"
                : "border border-white/25 text-white/75 hover:border-[#17E9E5] hover:text-[#17E9E5]"
            }`}
            type="button"
            onClick={() => setActiveCategory("all")}
          >
            Semua bidang
          </button>
          {serviceGroups.map((group) => (
            <button
              key={group.id}
              className={`shrink-0 px-3 py-2 text-xs font-bold transition ${
                activeCategory === group.category
                  ? "bg-[#FBCD2F] text-[#00132d]"
                  : "border border-white/25 text-white/75 hover:border-[#17E9E5] hover:text-[#17E9E5]"
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
          <p className="mt-12 text-[#FBCD2F]">{error}</p>
        ) : (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="min-w-0 text-lg font-bold sm:text-xl">
                {activeCategory === "all" ? "Semua layanan" : activeCategory}
              </h3>
              <div className="flex items-center gap-3">
                <span className="hidden text-xs text-white/50 sm:inline">
                  Geser untuk menjelajah
                </span>
                <div className="flex gap-2">
                  <button
                    aria-label="Layanan sebelumnya"
                    className="flex h-9 w-9 items-center justify-center border border-white/25 text-white transition hover:border-[#17E9E5] hover:text-[#17E9E5]"
                    title="Layanan sebelumnya"
                    type="button"
                    onClick={() => scrollServices(-1)}
                  >
                    <FaArrowLeft aria-hidden="true" />
                  </button>
                  <button
                    aria-label="Layanan berikutnya"
                    className="flex h-9 w-9 items-center justify-center border border-white/25 text-white transition hover:border-[#17E9E5] hover:text-[#17E9E5]"
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
              ref={servicesRailRef}
              className="flex items-stretch snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {filteredServices.map((service, index) => (
                    <motion.article
                      key={service.name}
                      className="flex h-[285px] w-[min(82vw,310px)] shrink-0 snap-start flex-col border border-white/15 bg-[#00264d]/75 p-4 transition-all hover:border-[#DF00A8] hover:shadow-[0_0_22px_rgba(223,0,168,0.22)] sm:w-[310px] sm:p-5"
                      initial={false}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                    >
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
                        {service.category}
                      </p>
                      <div className="mb-3 flex items-center gap-2 text-lg text-[#17E9E5]">
                        {getServiceIcons(service.name).map((ServiceIcon) => (
                          <ServiceIcon key={ServiceIcon.name} aria-hidden="true" />
                        ))}
                      </div>
                      <h4 className="text-base font-bold leading-snug text-white">
                        {service.name}
                      </h4>
                      <div className="mt-4 flex flex-wrap items-baseline gap-2">
                        <span className="text-sm text-white/45 line-through">
                          {service.originalPrice}
                        </span>
                        <span className="text-xl font-black text-[#FBCD2F]">
                          {service.price}
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-4 text-xs leading-5 text-white/65">
                        {service.description}
                      </p>
                    </motion.article>
              ))}
            </div>
          </div>
        )}

        <div className="mt-14 flex justify-center">
          <a
            className="bg-[#FBCD2F] px-6 py-4 text-base font-bold text-[#00132d] transition hover:bg-white"
            href="#konsultasi"
          >
            Konsultasikan Kebutuhanmu
          </a>
        </div>
      </div>
    </section>
  );
}
