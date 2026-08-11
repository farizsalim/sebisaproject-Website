"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ScrollLink from "@/components/ScrollLink";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 [font-family:Arial,sans-serif] ${
        isScrolled || isMenuOpen
          ? "border-white/15 bg-deep-navy/95 shadow-lg backdrop-blur-md"
          : "border-white/10 bg-deep-navy/90 shadow-md backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1240px] items-center justify-between gap-4 px-4 py-2 sm:min-h-[82px] sm:px-6 sm:py-3 lg:px-0">
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

        <div className="hidden items-center gap-6 text-[16px] font-normal text-white lg:flex">
          <Link
            className="relative transition-all duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-brand-blue-light after:transition-all after:duration-200 hover:-translate-y-0.5 hover:text-brand-blue-light hover:after:w-full"
            href="/"
          >
            Beranda
          </Link>
          <ScrollLink
            className="relative transition-all duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-brand-blue-light after:transition-all after:duration-200 hover:-translate-y-0.5 hover:text-brand-blue-light hover:after:w-full"
            href="#tentang-kami"
          >
            Tentang Kami
          </ScrollLink>
          <ScrollLink
            className="relative transition-all duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-brand-blue-light after:transition-all after:duration-200 hover:-translate-y-0.5 hover:text-brand-blue-light hover:after:w-full"
            href="#layanan"
          >
            Layanan
          </ScrollLink>
          <ScrollLink
            className="relative transition-all duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-brand-blue-light after:transition-all after:duration-200 hover:-translate-y-0.5 hover:text-brand-blue-light hover:after:w-full"
            href="#mitra"
          >
            Mitra
          </ScrollLink>
          <ScrollLink
            className="relative transition-all duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-brand-blue-light after:transition-all after:duration-200 hover:-translate-y-0.5 hover:text-brand-blue-light hover:after:w-full"
            href="#studi-kasus"
          >
            Kisah
          </ScrollLink>
          <Link
            className="relative transition-all duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-brand-blue-light after:transition-all after:duration-200 hover:-translate-y-0.5 hover:text-brand-blue-light hover:after:w-full"
            href="/tim"
          >
            Our Teams
          </Link>
        </div>

        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <ScrollLink
            className="border-2 border-deep-navy bg-orange px-5 py-3 text-[13px] font-black uppercase tracking-[0.08em] text-deep-navy shadow-[3px_3px_0_var(--brand-hot-pink)] transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[5px_5px_0_var(--brand-hot-pink)]"
            href="#konsultasi"
          >
            Mulai Konsultasi
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
      {isMenuOpen ? (
        <div className="absolute left-0 right-0 top-full border-t border-white/15 bg-deep-navy/95 px-4 py-4 shadow-lg backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-1 text-sm font-bold text-white">
            <Link className="px-3 py-3 hover:bg-white/10 hover:text-brand-blue-light" href="/" onClick={closeMenu}>Beranda</Link>
            <ScrollLink className="px-3 py-3 hover:bg-white/10 hover:text-brand-blue-light" href="#tentang-kami" onClick={closeMenu}>Tentang Kami</ScrollLink>
            <ScrollLink className="px-3 py-3 hover:bg-white/10 hover:text-brand-blue-light" href="#layanan" onClick={closeMenu}>Layanan</ScrollLink>
            <ScrollLink className="px-3 py-3 hover:bg-white/10 hover:text-brand-blue-light" href="#mitra" onClick={closeMenu}>Mitra</ScrollLink>
            <ScrollLink className="px-3 py-3 hover:bg-white/10 hover:text-brand-blue-light" href="#studi-kasus" onClick={closeMenu}>Kisah</ScrollLink>
            <Link className="px-3 py-3 hover:bg-white/10 hover:text-brand-blue-light" href="/tim" onClick={closeMenu}>Our Teams</Link>
            <ScrollLink className="mt-2 border-2 border-deep-navy bg-orange px-3 py-3 text-center font-black uppercase tracking-[0.08em] text-deep-navy shadow-[3px_3px_0_var(--brand-hot-pink)] transition hover:bg-white" href="#konsultasi" onClick={closeMenu}>Mulai Konsultasi</ScrollLink>
          </div>
        </div>
      ) : null}
    </nav>
  );
}