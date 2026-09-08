"use client";

import { motion } from "motion/react";
import { FaArrowRight, FaCheck } from "react-icons/fa6";
import {
  formatTime,
  getCurrentServicePrice,
  getServiceBenefits,
  getServiceIcons,
  getTimeRemaining,
  isFlashSaleActive,
} from "@/components/services/serviceHelpers";

function BenefitList({ service, dark = false }) {
  const benefits = getServiceBenefits(service.description, service.benefits);
  return (
    <ul className="mt-3 grid gap-1.5">
      {benefits.slice(0, 2).map((benefit) => (
        <li className="flex items-start gap-2" key={benefit}>
          <span className={`mt-[2px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${dark ? "bg-brand-blue/20" : "bg-brand-blue/10"}`}>
            <FaCheck className={`text-[7px] ${dark ? "text-brand-blue-light" : "text-brand-blue"}`} />
          </span>
          <span className={`line-clamp-1 text-[10px] font-bold leading-4 ${dark ? "text-white/75" : "text-deep-navy/70"}`}>
            {benefit}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function FlashSaleCard({ service, onOpen }) {
  const benefits = getServiceBenefits(service.description, service.benefits);
  const timeRemaining = service.flashSaleEndsAt ? getTimeRemaining(service.flashSaleEndsAt) : null;
  const ServiceIcons = getServiceIcons(service.name);
  return (
    <article className="group flex w-[84vw] max-w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-[22px] border border-deep-navy/10 bg-white text-deep-navy shadow-[0_12px_28px_rgb(0_0_0_/_13%)] sm:w-[310px] lg:w-[320px]">
      <div className="border-b border-deep-navy/10 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center gap-1 rounded-xl bg-brand-surface-alt text-sm text-brand-blue ring-1 ring-deep-navy/10 sm:h-11 sm:w-11 sm:text-base">
            {ServiceIcons.map((Icon) => <Icon key={Icon.name} />)}
          </div>
          <span className="rounded-full bg-hot-pink px-2.5 py-1.5 text-[8px] font-black uppercase tracking-[0.08em] text-deep-navy">Hemat {service.discount}%</span>
        </div>
        <p className="mt-4 text-[8px] font-black uppercase tracking-[0.15em] text-brand-blue">{service.category}</p>
        <h4 className="mt-1 line-clamp-2 min-h-[42px] text-[18px] font-black leading-[1.15] tracking-[-0.02em]">{service.name}</h4>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-end justify-between gap-3"><div>{service.originalPrice && <p className="text-[10px] font-bold text-deep-navy/35 line-through">{service.originalPrice}</p>}<p className="mt-1 text-[25px] font-black leading-none tracking-[-0.04em] text-orange">{service.price}</p></div><p className="max-w-[90px] text-right text-[9px] font-bold leading-4 text-deep-navy/45">{service.duration || "Sesuai kebutuhan"}</p></div>
        {timeRemaining && <div className="mt-3 rounded-xl bg-hot-pink/10 p-2.5"><div className="grid grid-cols-4 gap-1">{[{ value: timeRemaining.days, label: "Hari" }, { value: formatTime(timeRemaining.hours), label: "Jam" }, { value: formatTime(timeRemaining.minutes), label: "Min" }, { value: formatTime(timeRemaining.seconds), label: "Det" }].map((item) => <div className="rounded-lg bg-white px-1 py-1.5 text-center" key={item.label}><span className="block text-xs font-black tabular-nums">{item.value}</span><span className="mt-0.5 block text-[6px] font-black uppercase tracking-[0.08em] text-deep-navy/35">{item.label}</span></div>)}</div></div>}
        <p className="mt-3 line-clamp-2 text-[11px] leading-[18px] text-deep-navy/55">{service.description}</p>
        <BenefitList service={service} />
        <button className="mt-auto pt-4" type="button" onClick={() => onOpen(service)}><span className="flex min-h-10 w-full items-center justify-between rounded-full border border-deep-navy/20 px-4 text-[11px] font-black transition hover:border-orange hover:bg-orange">Lihat rincian <FaArrowRight className="text-[9px]" /></span></button>
      </div>
    </article>
  );
}

export function ServiceCard({ service, onOpen }) {
  const benefits = getServiceBenefits(service.description, service.benefits);
  const ServiceIcons = getServiceIcons(service.name);
  const flashSaleActive = isFlashSaleActive(service);
  const timeRemaining = service.flashSaleEndsAt ? getTimeRemaining(service.flashSaleEndsAt) : null;
  return (
    <motion.article className="group relative flex w-[84vw] max-w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-[22px] border border-brand-blue/25 bg-deep-navy text-white shadow-[0_12px_28px_rgb(23_36_61_/_18%)] sm:w-[310px] lg:w-[320px]" whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
      <div className="border-b border-white/10 p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center gap-1 rounded-xl bg-white text-sm text-brand-blue sm:h-11 sm:w-11 sm:text-base">{ServiceIcons.map((Icon) => <Icon key={Icon.name} />)}</div><div className="flex flex-wrap justify-end gap-1">{service.isRecommended && <span className="rounded-full bg-brand-blue px-2 py-1.5 text-[7px] font-black uppercase tracking-[0.06em] text-white">Rekomendasi</span>}{flashSaleActive && <span className="rounded-full bg-hot-pink px-2 py-1.5 text-[7px] font-black uppercase text-deep-navy">-{service.discount}%</span>}</div></div><p className="mt-4 text-[8px] font-black uppercase tracking-[0.15em] text-white/45">{service.category}</p><h4 className="mt-1 line-clamp-2 min-h-[42px] text-[18px] font-black leading-[1.15] tracking-[-0.02em] sm:text-[19px]">{service.name}</h4><p className="mt-2 line-clamp-2 min-h-[36px] text-[11px] leading-[18px] text-white/55">{service.description}</p></div>
      <div className="flex flex-1 flex-col p-4 sm:p-5"><div className="flex items-end justify-between gap-3"><div className="min-w-0">{flashSaleActive && service.originalPrice && <p className="text-[9px] font-bold text-white/35 line-through">{service.originalPrice}</p>}<p className="mt-1 truncate text-[24px] font-black leading-none tracking-[-0.035em] text-orange">{getCurrentServicePrice(service)}</p></div><p className="max-w-[90px] shrink-0 text-right text-[9px] font-bold leading-4 text-white/45">{service.duration || "Sesuai kebutuhan"}</p></div>{flashSaleActive && timeRemaining && <div className="mt-3 flex items-center justify-between rounded-lg bg-hot-pink/10 px-2.5 py-2"><span className="text-[7px] font-black uppercase tracking-[0.08em] text-hot-pink">Promo aktif</span><span className="text-[8px] font-black text-hot-pink">{timeRemaining.days}H {formatTime(timeRemaining.hours)}:{formatTime(timeRemaining.minutes)}</span></div>}<BenefitList service={service} dark />{benefits.length > 2 && <p className="mt-2 pl-6 text-[8px] font-bold text-white/35">+{benefits.length - 2} benefit lainnya</p>}<button className="mt-auto pt-4" type="button" onClick={() => onOpen(service)}><span className="flex min-h-10 w-full items-center justify-between rounded-full border border-white/25 px-4 text-[11px] font-black text-white transition hover:border-orange hover:bg-orange hover:text-deep-navy">Lihat rincian <FaArrowRight className="text-[9px]" /></span></button></div>
    </motion.article>
  );
}
