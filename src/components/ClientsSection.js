"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const clientLogos = [
  "kz6ioaghyw3kmkvwz7yk.png",
  "maikqfdco0mdqzdes9rk.png",
  "nmbmqpznqsnxkomctlcq.png",
  "nw93zb4qxwurzf7ft3xh.png",
  "os8tcp9nik7wsad6ue14.png",
  "oxxaqqf8bnu3fsesyaik.png",
  "qji75vzy0hugwukj6pqk.png",
  "qufzwby9ewkq3wxg4spa.png",
  "rukhngiy5u7svcw7mrw5.png",
  "tkhe4seypxp6rnfhzevq.png",
  "udm67fgb1gepoojgoaaw.png",
  "xfzma5xqnnbx5xhfjszd.png",
  "xwebvnwgflzm1gcmlhek.png",
  "yemqrqcwtcoxyxytubtv.png",
  "zjraydlxceah8cbwedzd.png",
];

const groupLogos = (size) =>
  Array.from({ length: Math.ceil(clientLogos.length / size) }, (_, groupIndex) =>
    clientLogos.slice(groupIndex * size, groupIndex * size + size),
  );

const tabletLogoGroups = groupLogos(3);
const desktopVisibleCount = 5;
const desktopMaxIndex = Math.max(clientLogos.length - desktopVisibleCount, 0);

function LogoCard({ logo, index }) {
  return (
    <div className="flex h-36 items-center justify-center p-2 sm:h-40 sm:p-3 lg:h-48 lg:p-4">
      <Image
        src={`/Client/${logo}`}
        alt={`Logo mitra Sebisa Project ${index + 1}`}
        width={320}
        height={240}
        className="h-full w-full object-contain opacity-75"
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
      setActiveDesktopGroup((current) =>
        current >= desktopMaxIndex ? 0 : current + 1,
      );
    }, 4200);

    return () => window.clearInterval(interval);
  }, []);

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
          <div className="relative overflow-hidden px-12 py-8">
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
                    className="h-40 w-full object-contain"
                  />
                </div>
              ))}
            </div>
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
              className="flex transition-transform duration-1000 ease-out"
              style={{ transform: `translateX(-${activeDesktopGroup * (100 / desktopVisibleCount)}%)` }}
            >
              {clientLogos.map((logo, logoIndex) => (
                <div className="min-w-[20%] px-2" key={`desktop-${logo}`}>
                  <LogoCard logo={logo} index={logoIndex} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}