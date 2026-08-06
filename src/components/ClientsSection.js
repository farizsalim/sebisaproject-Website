"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useEffect, useState } from "react";

const clientLogos = [
  "kz6ioaghyw3kmkvwz7yk.jpg",
  "maikqfdco0mdqzdes9rk.jpg",
  "nmbmqpznqsnxkomctlcq.png",
  "nw93zb4qxwurzf7ft3xh.jpg",
  "os8tcp9nik7wsad6ue14.jpg",
  "oxxaqqf8bnu3fsesyaik.png",
  "qji75vzy0hugwukj6pqk.jpg",
  "qufzwby9ewkq3wxg4spa.jpg",
  "rukhngiy5u7svcw7mrw5.png",
  "tkhe4seypxp6rnfhzevq.png",
  "udm67fgb1gepoojgoaaw.png",
  "xfzma5xqnnbx5xhfjszd.jpg",
  "xwebvnwgflzm1gcmlhek.jpg",
  "yemqrqcwtcoxyxytubtv.jpg",
  "zjraydlxceah8cbwedzd.jpg",
];

const groupLogos = (size) =>
  Array.from({ length: Math.ceil(clientLogos.length / size) }, (_, groupIndex) =>
    clientLogos.slice(groupIndex * size, groupIndex * size + size),
  );

const tabletLogoGroups = groupLogos(3);
const desktopLogoGroups = groupLogos(5);

function LogoCard({ logo, index }) {
  return (
    <div className="group flex h-28 items-center justify-center border border-[#00132d]/10 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#17E9E5] hover:shadow-[0_10px_24px_rgba(0,19,45,0.1)] sm:h-32">
      <Image
        src={`/Client/${logo}`}
        alt={`Logo mitra Sebisa Project ${index + 1}`}
        width={220}
        height={140}
        className="h-full w-full object-contain grayscale opacity-65 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100"
      />
    </div>
  );
}

export default function ClientsSection() {
  const [activeLogo, setActiveLogo] = useState(0);
  const [activeTabletGroup, setActiveTabletGroup] = useState(0);
  const [activeDesktopGroup, setActiveDesktopGroup] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveLogo((current) => (current + 1) % clientLogos.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveTabletGroup((current) => (current + 1) % tabletLogoGroups.length);
      setActiveDesktopGroup((current) => (current + 1) % desktopLogoGroups.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, []);

  const showPreviousLogo = () => {
    setActiveLogo((current) => (current - 1 + clientLogos.length) % clientLogos.length);
  };

  const showNextLogo = () => {
    setActiveLogo((current) => (current + 1) % clientLogos.length);
  };

  return (
    <section
      id="mitra"
      className="relative overflow-hidden bg-[#f7f9fc] px-4 py-12 text-[#00132d] [content-visibility:auto] [contain-intrinsic-size:700px] [font-family:Arial,sans-serif] sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#17E9E5_0%,#FBCD2F_50%,#DF00A8_100%)]" />
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#00AFC1] sm:text-sm">
            Mitra Sebisa Project
          </p>
          <h2 className="max-w-xl text-2xl font-black leading-tight sm:text-4xl">
            Mereka yang pernah bertumbuh bersama kami.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Setiap logo membawa cerita, kebutuhan, dan tantangan yang kami bantu
            kerjakan bersama.
          </p>
        </motion.div>

        <div className="mt-10 sm:hidden">
          <div className="relative overflow-hidden border border-[#00132d]/10 bg-white px-12 py-8">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeLogo * 100}%)` }}
            >
              {clientLogos.map((logo, index) => (
                <div className="flex min-w-full items-center justify-center" key={logo}>
                  <Image
                    src={`/Client/${logo}`}
                    alt={`Logo mitra Sebisa Project ${index + 1}`}
                    width={260}
                    height={150}
                    className="h-32 w-full object-contain"
                  />
                </div>
              ))}
            </div>
            <button
              aria-label="Logo mitra sebelumnya"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-[#00132d]/15 text-[#00132d] transition hover:border-[#17E9E5] hover:text-[#00AFC1]"
              type="button"
              onClick={showPreviousLogo}
            >
              <FaChevronLeft aria-hidden="true" />
            </button>
            <button
              aria-label="Logo mitra berikutnya"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-[#00132d]/15 text-[#00132d] transition hover:border-[#17E9E5] hover:text-[#00AFC1]"
              type="button"
              onClick={showNextLogo}
            >
              <FaChevronRight aria-hidden="true" />
            </button>
          </div>
          <div className="mt-4 flex justify-center gap-1.5" aria-label="Pilih logo mitra">
            {clientLogos.map((logo, index) => (
              <button
                aria-label={`Tampilkan logo mitra ${index + 1}`}
                className={`h-1.5 transition-all ${index === activeLogo ? "w-6 bg-[#00AFC1]" : "w-1.5 bg-[#00132d]/20"}`}
                key={logo}
                type="button"
                onClick={() => setActiveLogo(index)}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 hidden sm:block lg:hidden">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${activeTabletGroup * 100}%)` }}
            >
              {tabletLogoGroups.map((group, groupIndex) => (
                <div className="grid min-w-full grid-cols-3 gap-4" key={`tablet-${groupIndex}`}>
                  {group.map((logo, logoIndex) => (
                    <LogoCard key={logo} logo={logo} index={groupIndex * 3 + logoIndex} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 hidden lg:block">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${activeDesktopGroup * 100}%)` }}
            >
              {desktopLogoGroups.map((group, groupIndex) => (
                <div className="grid min-w-full grid-cols-5 gap-4" key={`desktop-${groupIndex}`}>
                  {group.map((logo, logoIndex) => (
                    <LogoCard key={logo} logo={logo} index={groupIndex * 5 + logoIndex} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}