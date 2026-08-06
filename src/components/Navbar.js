"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 [font-family:Arial,sans-serif] ${
        isScrolled
          ? "border-white/15 bg-[#00132d]/75 shadow-lg backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex min-h-[82px] w-full max-w-[1240px] items-center justify-between gap-8 px-6 py-3 lg:px-0">
        <a href="/" className="flex shrink-0 items-center gap-3 text-white">
          <span className="relative block h-[70px] w-[220px] overflow-hidden">
            <Image
              src="/images/logo-sebisa-project.png"
              alt="Sebisa Project"
              fill
              priority
              sizes="220px"
              className="object-cover object-center"
            />
          </span>
        </a>

        <div className="hidden items-center gap-6 text-[16px] font-normal text-white lg:flex">
          <a
            className="relative transition-all duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-[#17E9E5] after:transition-all after:duration-200 hover:-translate-y-0.5 hover:text-[#17E9E5] hover:after:w-full"
            href="#"
          >
            Beranda
          </a>
          <a
            className="relative transition-all duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-[#17E9E5] after:transition-all after:duration-200 hover:-translate-y-0.5 hover:text-[#17E9E5] hover:after:w-full"
            href="#"
          >
            Tentang Kami
          </a>
          <a
            className="relative transition-all duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-[#17E9E5] after:transition-all after:duration-200 hover:-translate-y-0.5 hover:text-[#17E9E5] hover:after:w-full"
            href="#layanan"
          >
            Layanan
          </a>
          <a
            className="relative transition-all duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-[#17E9E5] after:transition-all after:duration-200 hover:-translate-y-0.5 hover:text-[#17E9E5] hover:after:w-full"
            href="#studi-kasus"
          >
            Portofolio
          </a>
          <a
            className="relative transition-all duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-[#17E9E5] after:transition-all after:duration-200 hover:-translate-y-0.5 hover:text-[#17E9E5] hover:after:w-full"
            href="#"
          >
            Karir
          </a>
          <a
            className="relative transition-all duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-[#17E9E5] after:transition-all after:duration-200 hover:-translate-y-0.5 hover:text-[#17E9E5] hover:after:w-full"
            href="#"
          >
            Kontak
          </a>
        </div>

        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <a
            className="bg-[#FBCD2F] px-5 py-3 text-[15px] text-[#00132d] transition-colors hover:bg-white font-bold"
            href="#konsultasi"
          >
            Konsultasi
          </a>
        </div>

        <button
          aria-label="Buka menu navigasi"
          className="flex h-11 w-11 items-center justify-center border border-white/40 text-white lg:hidden"
          type="button"
        >
          <span className="flex w-5 flex-col gap-1.5">
            <span className="h-0.5 w-full bg-white" />
            <span className="h-0.5 w-full bg-white" />
            <span className="h-0.5 w-full bg-white" />
          </span>
        </button>
      </div>
    </nav>
  );
}