import Image from "next/image";
import ScrollLink from "@/components/ScrollLink";
import { FaInstagram, FaLinkedinIn, FaTiktok, FaWhatsapp } from "react-icons/fa6";

export default function Footer({ content }) {
  const navigationLinks = content?.navigationLinks || [];
  const socialLinks = content?.socialLinks || {};

  return (
    <footer className="brand-footer-gradient px-4 py-10 text-white [font-family:Arial,sans-serif] sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto grid max-w-[1240px] gap-8 sm:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div>
          <span className="relative block h-14 w-[175px] overflow-hidden sm:h-16 sm:w-[205px]">
            <Image
              src="/images/logo-sebisa-project.png"
              alt="Sebisa Project"
              fill
              sizes="205px"
              className="object-cover object-left"
            />
          </span>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/85">
            {content?.description}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-blue-light">
            {content?.navigationTitle}
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/85">
            <ScrollLink className="transition hover:text-brand-blue-light" href="#tentang-kami">{navigationLinks[0]}</ScrollLink>
            <ScrollLink className="transition hover:text-brand-blue-light" href="#layanan">{navigationLinks[1]}</ScrollLink>
            <ScrollLink className="transition hover:text-brand-blue-light" href="#studi-kasus">{navigationLinks[2]}</ScrollLink>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-blue-light">
            {content?.contactTitle}
          </p>
          <ScrollLink className="mt-4 inline-block text-sm text-white/85 transition hover:text-orange" href="#konsultasi">
            {content?.consultationCta}
          </ScrollLink>
          <div className="mt-5 flex items-center gap-3">
            <a
              aria-label="Instagram Sebisa Project"
              className="flex h-10 w-10 items-center justify-center border-2 border-white/35 text-white/85 transition hover:-translate-y-0.5 hover:border-orange hover:text-orange"
              href={socialLinks.instagram}
              rel="noreferrer"
              target="_blank"
              title="Instagram"
            >
              <FaInstagram aria-hidden="true" />
            </a>
            <a
              aria-label="LinkedIn Sebisa Project"
              className="flex h-10 w-10 items-center justify-center border-2 border-white/35 text-white/85 transition hover:-translate-y-0.5 hover:border-orange hover:text-orange"
              href={socialLinks.linkedin}
              rel="noreferrer"
              target="_blank"
              title="LinkedIn"
            >
              <FaLinkedinIn aria-hidden="true" />
            </a>
            <a
              aria-label="TikTok Sebisa Project"
              className="flex h-10 w-10 items-center justify-center border-2 border-white/35 text-white/85 transition hover:-translate-y-0.5 hover:border-orange hover:text-orange"
              href={socialLinks.tiktok}
              rel="noreferrer"
              target="_blank"
              title="TikTok"
            >
              <FaTiktok aria-hidden="true" />
            </a>
            <a
              aria-label="WhatsApp Sebisa Project"
              className="flex h-10 w-10 items-center justify-center border-2 border-white/35 text-white/85 transition hover:-translate-y-0.5 hover:border-orange hover:text-orange"
              href={socialLinks.whatsapp}
              rel="noreferrer"
              target="_blank"
              title="WhatsApp"
            >
              <FaWhatsapp aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-[1240px] border-t border-white/20 pt-5 text-xs text-white/70">
        © {new Date().getFullYear()} Sebisa Project. Semua hak dilindungi.
      </div>
    </footer>
  );
}