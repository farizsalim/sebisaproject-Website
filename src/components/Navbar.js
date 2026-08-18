"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ScrollLink from "@/components/ScrollLink";

export default function Navbar({ content }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);
  const labels = content?.links || [];
  const tickerItems = content?.tickerItems || [];

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 [font-family:Arial,sans-serif] ${
        isScrolled || isMenuOpen
          ? "border-white/15 bg-deep-navy shadow-lg"
          : "border-white/10 bg-deep-navy shadow-md"
      }`}
    >
      <div className="container mx-auto flex min-h-[76px] items-center justify-between gap-4 px-4 py-2 sm:min-h-[88px] sm:px-6 sm:py-3 lg:px-8 xl:px-12">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3 text-white">
          <span className="relative block h-[58px] w-[170px] overflow-hidden sm:h-[70px] sm:w-[220px]">
            <Image
              src="/images/logo-sebisa-project.png"
              alt="Sebisa Project"
              fill
              sizes="220px"
              className="object-cover object-center"
            />
          </span>
        </Link>

        <div className="hidden items-center gap-7 text-[16px] font-normal text-white xl:gap-10 lg:flex">
          <Link
            className="relative transition-all duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-brand-blue-light after:transition-all after:duration-200 hover:-translate-y-0.5 hover:text-brand-blue-light hover:after:w-full"
            href="/"
          >
            {labels[0]}
          </Link>
          <ScrollLink
            className="relative transition-all duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-brand-blue-light after:transition-all after:duration-200 hover:-translate-y-0.5 hover:text-brand-blue-light hover:after:w-full"
            href="#tentang-kami"
          >
            {labels[1]}
          </ScrollLink>
          <ScrollLink
            className="relative transition-all duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-brand-blue-light after:transition-all after:duration-200 hover:-translate-y-0.5 hover:text-brand-blue-light hover:after:w-full"
            href="#layanan"
          >
            {labels[2]}
          </ScrollLink>
          <ScrollLink
            className="relative transition-all duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-brand-blue-light after:transition-all after:duration-200 hover:-translate-y-0.5 hover:text-brand-blue-light hover:after:w-full"
            href="#mitra"
          >
            {labels[3]}
          </ScrollLink>
          <ScrollLink
            className="relative transition-all duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-brand-blue-light after:transition-all after:duration-200 hover:-translate-y-0.5 hover:text-brand-blue-light hover:after:w-full"
            href="#studi-kasus"
          >
            {labels[4]}
          </ScrollLink>
          <Link
            className="relative transition-all duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-brand-blue-light after:transition-all after:duration-200 hover:-translate-y-0.5 hover:text-brand-blue-light hover:after:w-full"
            href="/tim"
          >
            {labels[5]}
          </Link>
        </div>

        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <ScrollLink
            className="bg-orange px-4 py-2.5 text-[13px] font-black uppercase tracking-[0.08em] text-white transition duration-200 hover:bg-[var(--foreground)]"
            href="#konsultasi"
          >
            {content?.consultationCta}
          </ScrollLink>
        </div>

        <button
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-white/70 text-white transition hover:border-hot-pink hover:bg-hot-pink lg:hidden"
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="flex w-5 flex-col gap-1.5">
            <span className="h-0.5 w-full bg-white" />
            <span className="h-0.5 w-full bg-white" />
            <span className="h-0.5 w-full bg-white" />
          </span>
        </button>
      </div>
      <div className="overflow-hidden border-t border-white/10 bg-[var(--brand-orange)] text-white">
        <div className="container mx-auto flex min-h-11 items-center gap-3 px-4 text-[11px] font-black uppercase tracking-[0.08em] sm:px-6 lg:px-8 xl:px-12">
          <Link className="shrink-0 bg-white px-2 py-1 text-[10px] tracking-[0.12em] text-[var(--brand-orange)] transition hover:bg-[var(--foreground)] hover:text-white" href="/?filter=flash-sale#layanan">
            {content?.flashSale}
          </Link>
          <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap">
            <div className="flex w-max animate-[ticker_24s_linear_infinite] gap-12 hover:[animation-play-state:paused]">
              <span>{tickerItems[0]}</span>
              <span aria-hidden="true">✦</span>
              <span>{tickerItems[1]}</span>
              <span aria-hidden="true">✦</span>
              <span>{tickerItems[0]}</span>
              <span aria-hidden="true">✦</span>
            </div>
          </div>
          <Link className="hidden shrink-0 border-2 border-white bg-white px-3 py-1.5 text-[10px] text-[var(--brand-orange)] transition hover:bg-[var(--foreground)] hover:text-white sm:block" href="/?filter=flash-sale#layanan">
            {content?.slotCta}
          </Link>
        </div>
      </div>
      {isMenuOpen ? (
        <div className="absolute left-0 right-0 top-full border-t border-white/15 bg-deep-navy/95 px-4 py-4 shadow-lg backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-1 text-sm font-bold text-white">
            <Link className="px-3 py-3 hover:bg-white/10 hover:text-brand-blue-light" href="/" onClick={closeMenu}>{labels[0]}</Link>
            <ScrollLink className="px-3 py-3 hover:bg-white/10 hover:text-brand-blue-light" href="#tentang-kami" onClick={closeMenu}>{labels[1]}</ScrollLink>
            <ScrollLink className="px-3 py-3 hover:bg-white/10 hover:text-brand-blue-light" href="#layanan" onClick={closeMenu}>{labels[2]}</ScrollLink>
            <ScrollLink className="px-3 py-3 hover:bg-white/10 hover:text-brand-blue-light" href="#mitra" onClick={closeMenu}>{labels[3]}</ScrollLink>
            <ScrollLink className="px-3 py-3 hover:bg-white/10 hover:text-brand-blue-light" href="#studi-kasus" onClick={closeMenu}>{labels[4]}</ScrollLink>
            <Link className="px-3 py-3 hover:bg-white/10 hover:text-brand-blue-light" href="/tim" onClick={closeMenu}>{labels[5]}</Link>
            <ScrollLink className="mt-2 border-2 border-deep-navy bg-orange px-3 py-3 text-center font-black uppercase tracking-[0.08em] text-deep-navy shadow-[3px_3px_0_var(--brand-hot-pink)] transition hover:bg-white" href="#konsultasi" onClick={closeMenu}>{content?.consultationCta}</ScrollLink>
          </div>
        </div>
      ) : null}
    </nav>
  );
}