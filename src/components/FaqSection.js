export default function FaqSection({ content }) {
  return (
    <section
      className="relative overflow-hidden bg-deep-navy bg-cover bg-center px-4 py-14 text-white [content-visibility:auto] [contain-intrinsic-size:650px] [font-family:Arial,sans-serif] sm:px-6 sm:py-20 lg:px-8"
      style={{ backgroundImage: "url('/images/Portofolio.png')" }}
    >
      <div className="brand-photo-overlay absolute inset-0" />
      <div className="brand-top-line absolute inset-x-0 top-0 z-10 h-1" />
      <div className="relative z-10 mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-orange sm:text-sm">
            {content?.eyebrow}
          </p>
          <h2 className="max-w-md text-3xl font-black uppercase leading-[1.02] tracking-tight text-white [text-shadow:3px_3px_0_var(--brand-deep-navy)] sm:text-5xl lg:text-[52px]">
            {content?.title}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/90 sm:text-base sm:leading-7">
            {content?.intro}
          </p>
        </div>

        <div className="border-t border-white/15">
          {content?.items?.map((item) => (
            <details key={item.question} className="group border-b border-white/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-bold marker:hidden sm:text-base">
                {item.question}
                <span className="text-xl font-normal text-orange transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-5 pr-8 text-sm leading-6 text-white/90">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}