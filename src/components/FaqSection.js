const faqItems = [
  {
    question: "Bagaimana kalau hasilnya belum sesuai?",
    answer:
      "Kami menyamakan kebutuhan, ruang lingkup, dan arah visual sejak awal. Setiap layanan memiliki alur revisi dan titik review yang disepakati agar hasil dapat disempurnakan bersama.",
  },
  {
    question: "Berapa lama proses pengerjaannya?",
    answer:
      "Durasi bergantung pada jenis layanan dan kompleksitas kebutuhan. Setelah konsultasi singkat, kami akan membantu memberikan gambaran timeline yang realistis.",
  },
  {
    question: "Apakah bisa membuat paket custom?",
    answer:
      "Bisa. Layanan dapat disusun sesuai tujuan, prioritas, dan anggaran bisnis Anda, baik untuk kebutuhan satu kali maupun kerja sama berkelanjutan.",
  },
  {
    question: "Apakah Sebisa Project melayani UMKM?",
    answer:
      "Tentu. Kami membantu bisnis dari berbagai skala menemukan kebutuhan digital yang paling penting untuk dikerjakan terlebih dahulu.",
  },
  {
    question: "Apa arti layanan profesional bergaransi?",
    answer:
      "Garansi berarti kami berkomitmen pada kejelasan scope, komunikasi, dan proses review sesuai layanan yang disepakati. Detail cakupan garansi akan dijelaskan sebelum pekerjaan dimulai.",
  },
];

export default function FaqSection() {
  return (
    <section className="relative overflow-hidden bg-[#00132d] px-4 py-14 text-white [content-visibility:auto] [contain-intrinsic-size:650px] [font-family:Arial,sans-serif] sm:px-6 sm:py-20 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#17E9E5_0%,#FBCD2F_50%,#DF00A8_100%)]" />
      <div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#00AFC1] sm:text-sm">
            Pertanyaan umum
          </p>
          <h2 className="max-w-md text-3xl font-black leading-tight sm:text-4xl">
            Masih ada yang ingin kamu pastikan?
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
            Kami buat jawabannya sesederhana mungkin supaya kamu bisa mulai
            dengan lebih tenang dan jelas.
          </p>
        </div>

        <div className="border-t border-white/15">
          {faqItems.map((item) => (
            <details key={item.question} className="group border-b border-white/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-bold marker:hidden sm:text-base">
                {item.question}
                <span className="text-xl font-normal text-[#17E9E5] transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-5 pr-8 text-sm leading-6 text-white/65">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}