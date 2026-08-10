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
      className="relative overflow-hidden bg-[linear-gradient(135deg,#06466B_0%,#21BCFB_100%)] bg-cover bg-center px-4 py-14 text-white [content-visibility:auto] [contain-intrinsic-size:900px] [font-family:Arial,sans-serif] sm:px-6 sm:py-16 lg:px-8"
      style={{ backgroundImage: "url('/images/Portofolio.png')" }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(6,70,107,0.84)_0%,rgba(6,70,107,0.68)_55%,rgba(33,188,251,0.62)_100%)]" />
      <div className="absolute inset-x-0 top-0 z-10 h-1 bg-[linear-gradient(90deg,#21BCFB_0%,#81CEEF_100%)]" />
      <div className="relative z-10 mx-auto max-w-[1240px]">
        <motion.div
          className="max-w-2xl"
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p id="layanan" className="scroll-mt-[82px] mb-3 text-sm font-black uppercase tracking-[0.24em] text-[#FF7A18] sm:scroll-mt-[102px] sm:text-sm">
            Layanan Sebisa Project
          </p>
          <h2 className="text-3xl font-black uppercase leading-[1.02] tracking-tight [text-shadow:3px_3px_0_#FF7A18] sm:text-4xl lg:text-[48px]">
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
                ? "border-2 border-[#06466B] bg-[#FF7A18] text-[#06466B] shadow-[2px_2px_0_#F51686]"
                : "border border-[#F51686]/70 text-white/90 hover:border-[#FF7A18] hover:bg-[#FF7A18] hover:text-[#06466B]"
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
                  ? "border-2 border-[#06466B] bg-[#FF7A18] text-[#06466B] shadow-[2px_2px_0_#F51686]"
                  : "border border-[#F51686]/70 text-white/90 hover:border-[#FF7A18] hover:bg-[#FF7A18] hover:text-[#06466B]"
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
          <p className="mt-12 text-[#FF7A18]">{error}</p>
        ) : (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="min-w-0 text-lg font-bold sm:text-xl">
                {activeCategory === "all" ? "Semua layanan" : activeCategory}
              </h3>
              <div className="flex items-center gap-3">
                <span className="hidden text-xs text-white/80 sm:inline">
                  Geser untuk menjelajah
                </span>
                <div className="flex gap-2">
                  <button
                    aria-label="Layanan sebelumnya"
                    className="flex h-9 w-9 items-center justify-center border-2 border-[#F51686] text-white transition hover:-translate-y-0.5 hover:border-[#FF7A18] hover:bg-[#FF7A18] hover:text-[#06466B]"
                    title="Layanan sebelumnya"
                    type="button"
                    onClick={() => scrollServices(-1)}
                  >
                    <FaArrowLeft aria-hidden="true" />
                  </button>
                  <button
                    aria-label="Layanan berikutnya"
                    className="flex h-9 w-9 items-center justify-center border-2 border-[#F51686] text-white transition hover:-translate-y-0.5 hover:border-[#FF7A18] hover:bg-[#FF7A18] hover:text-[#06466B]"
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
              className="flex items-stretch snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden pb-8 pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {filteredServices.map((service, index) => (
                    <motion.article
                      key={service.name}
                      className={`group relative flex h-[300px] w-[min(82vw,310px)] shrink-0 snap-start flex-col overflow-hidden border-2 border-[#06466B]/20 bg-white p-4 text-[#06466B] shadow-[5px_5px_0_rgba(245,22,134,0.55)] transition-colors hover:border-[#FF7A18] hover:shadow-[6px_6px_0_#FF7A18] sm:w-[310px] sm:p-5 lg:h-[310px] ${index % 2 === 1 ? "lg:mt-5" : ""}`}
                      initial={false}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                    >
                      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#21BCFB]/10 transition-transform duration-500 group-hover:scale-150" />
                      <div className="relative flex items-start justify-between gap-3">
                        <span className="flex h-10 w-10 items-center justify-center border border-[#21BCFB]/40 bg-[#21BCFB]/10 text-sm font-black text-[#21BCFB]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <p className="max-w-[72%] pt-1 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-[#06466B]/70">
                          {service.category}
                        </p>
                      </div>
                      <div className="relative mt-5 flex h-11 min-w-11 w-fit shrink-0 items-center justify-center gap-2 border-l-2 border-[#FF7A18] bg-[#E5F7FD] px-3 text-lg text-[#06466B]">
                        {getServiceIcons(service.name).map((ServiceIcon) => (
                          <ServiceIcon key={ServiceIcon.name} aria-hidden="true" />
                        ))}
                      </div>
                      <h4 className="relative mt-4 line-clamp-2 text-base font-black leading-snug text-[#06466B] sm:text-lg">
                        {service.name}
                      </h4>
                      <p className="relative mt-2 line-clamp-2 text-xs leading-5 text-slate-600">
                        {service.description}
                      </p>
                      <div className="relative mt-auto flex items-end justify-between gap-3 border-t border-[#06466B]/15 pt-3">
                        <span className="text-[11px] text-slate-500 line-through">
                          {service.originalPrice}
                        </span>
                        <span className="text-xl font-black text-[#FF7A18]">
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
            className="border-2 border-[#06466B] bg-[#FF7A18] px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-[#06466B] shadow-[4px_4px_0_#F51686] transition hover:-translate-y-1 hover:bg-white"
            href="#konsultasi"
          >
            Konsultasikan Kebutuhanmu
          </ScrollLink>
        </div>
      </div>
    </section>
  );
}
