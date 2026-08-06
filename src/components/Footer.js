import ScrollLink from "@/components/ScrollLink";

export default function Footer() {
  return (
    <footer className="bg-[#000d20] px-4 py-10 text-white [font-family:Arial,sans-serif] sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto grid max-w-[1240px] gap-8 sm:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div>
          <p className="text-xl font-black">Sebisa Project</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/55">
            Partner kreatif dan strategis untuk membantu ide digital tumbuh
            menjadi hasil yang nyata.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#17E9E5]">
            Navigasi
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/65">
            <ScrollLink className="transition hover:text-[#17E9E5]" href="#tentang-kami">Tentang Kami</ScrollLink>
            <ScrollLink className="transition hover:text-[#17E9E5]" href="#layanan">Layanan</ScrollLink>
            <ScrollLink className="transition hover:text-[#17E9E5]" href="#studi-kasus">Kisah</ScrollLink>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#17E9E5]">
            Hubungi kami
          </p>
          <ScrollLink className="mt-4 inline-block text-sm text-white/65 transition hover:text-[#FBCD2F]" href="#konsultasi">
            Mulai dari konsultasi
          </ScrollLink>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-[1240px] border-t border-white/10 pt-5 text-xs text-white/40">
        © {new Date().getFullYear()} Sebisa Project. Semua hak dilindungi.
      </div>
    </footer>
  );
}