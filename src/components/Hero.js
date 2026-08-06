"use client";

import { motion } from "motion/react";
import { Fragment } from "react";

const headingSegments = [
  { text: "Punya", className: "text-white", spaceAfter: true },
  { text: "Ide Digital", className: "text-[#FBCD2F]", spaceAfter: true },
  { text: "?", className: "text-white", spaceAfter: true },
  { text: "Tapi", className: "text-white", spaceAfter: true },
  { text: "Bingung", className: "text-white", spaceAfter: true },
  { text: "Untuk", className: "text-white", spaceAfter: true },
  { text: "Memulainya?", className: "text-white", spaceAfter: false },
];

export default function Hero() {
  return (
    <section
      className="relative -mt-[90px] box-border flex min-h-[520px] items-center justify-center bg-cover bg-center px-4 pb-10 pt-[100px] [font-family:Arial,sans-serif] sm:-mt-[100px] sm:min-h-[600px] sm:px-6 sm:pt-[110px] lg:px-8"
      style={{ backgroundImage: "url('/images/Portofolio.png')" }}
    >
      <div className="absolute inset-0 bg-[#00132d]/70" />
      <div className="relative mx-auto flex w-full max-w-7xl justify-center">
        <div className="max-w-4xl text-center">
          <motion.h1
            aria-label="Punya Ide Digital? Tapi Bingung Untuk Memulainya?"
            className="text-3xl font-black leading-[1.15] sm:text-5xl lg:text-[56px]"
            initial={false}
          >
            {headingSegments.map((segment, segmentIndex) => (
              <Fragment key={segment.text}>
                <span
                  className={`inline-block ${segment.className}`}
                  aria-hidden="true"
                >
                  {Array.from(segment.text).map((character, characterIndex) => (
                    <motion.span
                      key={`${segment.text}-${characterIndex}`}
                      className="inline-block"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.05,
                        delay: (segmentIndex * 11 + characterIndex) * 0.02,
                        ease: "easeOut",
                      }}
                    >
                      {character === " " ? "\u00a0" : character}
                    </motion.span>
                  ))}
                </span>
                {segment.spaceAfter ? (
                  <span aria-hidden="true">&nbsp;</span>
                ) : null}
              </Fragment>
            ))}
          </motion.h1>

          <div className="mt-7 flex min-h-[70px] w-full flex-col items-stretch justify-start gap-3 sm:flex-row sm:items-center sm:justify-center">
            <motion.a
              className="inline-flex min-h-[52px] items-center justify-center rounded-sm bg-[#FBCD2F] px-6 py-4 text-base font-bold text-[#00132d] transition hover:bg-white sm:min-w-[190px]"
              href="#konsultasi"
              initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
            >
              Ayo Kita Mulai !
            </motion.a>
            <motion.a
              className="inline-flex min-h-[52px] items-center justify-center rounded-sm border border-[#DF00A8] px-6 py-4 text-base font-bold text-white transition hover:bg-[#DF00A8] hover:text-white sm:min-w-[190px]"
              href="#layanan"
              initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.65, ease: "easeOut" }}
            >
              Pilihan layanan
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}