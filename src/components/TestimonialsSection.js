"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa6";

function Rating({ value }) {
  return (
    <div className="flex items-center gap-1 text-orange" aria-label={`Rating ${value} dari 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar key={star} className={star <= Math.round(value) ? "" : "opacity-25"} aria-hidden="true" />
      ))}
      <span className="ml-1 text-xs font-black text-white/60">{value}/5</span>
    </div>
  );
}

export default function TestimonialsSection({ testimonials = [] }) {
  const railRef = useRef(null);

  const scrollTestimonials = (direction) => {
    railRef.current?.scrollBy({ left: direction * 360, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 text-deep-navy [content-visibility:auto] [contain-intrinsic-size:680px] sm:px-6 sm:py-24 lg:px-8">
      <div className="brand-top-line absolute inset-x-0 top-0 h-1" />
      <div className="relative z-10 mx-auto max-w-[1240px]">
        <motion.div
          className="flex flex-col justify-between gap-6 border-b border-deep-navy/15 pb-8 sm:flex-row sm:items-end"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-brand-blue sm:text-sm">
              Kata mereka
            </p>
            <h2 className="max-w-2xl text-4xl font-black uppercase leading-[0.96] tracking-[-0.04em] text-deep-navy sm:text-6xl lg:text-[60px]">
              Cerita baik dari brand yang bertumbuh bersama kami.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-brand-muted sm:text-lg">
              Pengalaman nyata dari klien yang mempercayakan ide, konten, dan strategi digitalnya kepada Sebisa Project.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              aria-label="Testimoni sebelumnya"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-deep-navy/25 text-deep-navy transition hover:border-brand-blue hover:bg-brand-blue hover:text-white"
              title="Testimoni sebelumnya"
              type="button"
              onClick={() => scrollTestimonials(-1)}
            >
              <FaArrowLeft aria-hidden="true" />
            </button>
            <button
              aria-label="Testimoni berikutnya"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-deep-navy/25 text-deep-navy transition hover:border-brand-blue hover:bg-brand-blue hover:text-white"
              title="Testimoni berikutnya"
              type="button"
              onClick={() => scrollTestimonials(1)}
            >
              <FaArrowRight aria-hidden="true" />
            </button>
          </div>
        </motion.div>

        {testimonials.length > 0 ? (
          <div ref={railRef} className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {testimonials.map((testimonial, index) => (
              <motion.article
                className="flex min-h-[300px] w-[min(86vw,350px)] shrink-0 snap-start flex-col rounded-2xl bg-deep-navy p-6 text-white shadow-[0_16px_35px_rgb(23_36_61_/_18%)] sm:w-[350px]"
                key={`${testimonial.brand}-${index}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.04, ease: "easeOut" }}
              >
                <Rating value={testimonial.rating} />
                <blockquote className="mt-6 flex-1 text-base leading-7 text-white/90">
                  “{testimonial.testimoni}”
                </blockquote>
                <div className="mt-6 border-t border-white/15 pt-4">
                  <p className="font-black text-white">{testimonial.client}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-brand-blue-light">
                    {testimonial.brand}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-sm text-brand-muted">Testimoni klien segera hadir.</p>
        )}
      </div>
    </section>
  );
}
