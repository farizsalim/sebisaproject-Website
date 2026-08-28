import Image from "next/image";
import ScrollLink from "@/components/ScrollLink";
import { FaInstagram, FaLinkedinIn, FaTiktok, FaWhatsapp } from "react-icons/fa6";

const defaultFooterContent = {
  description: "Partner kreatif dan strategis untuk membantu ide digital tumbuh menjadi hasil yang nyata.",
  navigationTitle: "Navigasi",
  navigationLinks: ["Tentang Kami", "Layanan", "Kisah"],
  contactTitle: "Hubungi kami",
  consultationCta: "Mulai dari konsultasi",
  socialLinks: {
    instagram: "https://www.instagram.com/sebisaproject/",
    linkedin: "https://www.linkedin.com/company/sebisa-project/",
    tiktok: "https://www.tiktok.com/@sebisaproject",
    whatsapp: "https://wa.me/6280000000000",
  },
};

export default function Footer({ content }) {
  const footerContent = {
    ...defaultFooterContent,
    ...(content || {}),
    socialLinks: {
      ...defaultFooterContent.socialLinks,
      ...(content?.socialLinks || {}),
    },
  };
  const navigationLinks = footerContent.navigationLinks;
  const socialLinks = footerContent.socialLinks;
  const sectionLinks = [
    { label: "Mitra", href: "#mitra" },
    { label: "Kisah", href: "#studi-kasus" },
    { label: "Tentang Kami", href: "#tentang-kami" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <footer className="brand-footer-gradient px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[1.1fr_2fr] lg:gap-16">
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
            {footerContent.description}
          </p>
        </div>
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-blue-light">
              {footerContent.navigationTitle}
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/85">
              <ScrollLink className="transition hover:text-brand-blue-light" href="#tentang-kami">{navigationLinks[0] || "Tentang Kami"}</ScrollLink>
              <ScrollLink className="transition hover:text-brand-blue-light" href="#layanan">{navigationLinks[1] || "Layanan"}</ScrollLink>
              <ScrollLink className="transition hover:text-brand-blue-light" href="#studi-kasus">{navigationLinks[2] || "Kisah"}</ScrollLink>
              <ScrollLink className="transition hover:text-brand-blue-light" href="#konsultasi">Mulai Konsultasi</ScrollLink>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-blue-light">
              Jelajahi
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/85">
              {sectionLinks.map((link) => (
                <ScrollLink className="transition hover:text-brand-blue-light" href={link.href} key={link.href}>
                  {link.label}
                </ScrollLink>
              ))}
              <a className="transition hover:text-brand-blue-light" href="/tim">Our Teams</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-blue-light">
              {footerContent.contactTitle}
            </p>
            <p className="mt-4 max-w-[220px] text-sm leading-6 text-white/75">
              Punya ide atau kebutuhan digital? Mari bahas langkah terbaik untuk brand kamu.
            </p>
            <ScrollLink className="mt-5 inline-flex rounded-full bg-orange px-4 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-deep-navy transition hover:bg-white" href="#konsultasi">
              {footerContent.consultationCta}
            </ScrollLink>
            <div className="mt-6 flex items-center gap-3">
            <a
              aria-label="Instagram Sebisa Project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/35 text-white/85 transition hover:-translate-y-0.5 hover:border-orange hover:bg-orange hover:text-deep-navy"
              href={socialLinks.instagram}
              rel="noreferrer"
              target="_blank"
              title="Instagram"
            >
              <FaInstagram aria-hidden="true" />
            </a>
            <a
              aria-label="LinkedIn Sebisa Project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/35 text-white/85 transition hover:-translate-y-0.5 hover:border-orange hover:bg-orange hover:text-deep-navy"
              href={socialLinks.linkedin}
              rel="noreferrer"
              target="_blank"
              title="LinkedIn"
            >
              <FaLinkedinIn aria-hidden="true" />
            </a>
            <a
              aria-label="TikTok Sebisa Project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/35 text-white/85 transition hover:-translate-y-0.5 hover:border-orange hover:bg-orange hover:text-deep-navy"
              href={socialLinks.tiktok}
              rel="noreferrer"
              target="_blank"
              title="TikTok"
            >
              <FaTiktok aria-hidden="true" />
            </a>
            <a
              aria-label="WhatsApp Sebisa Project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/35 text-white/85 transition hover:-translate-y-0.5 hover:border-orange hover:bg-orange hover:text-deep-navy"
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
      </div>
      <div className="mx-auto mt-10 max-w-[1240px] border-t border-white/20 pt-5 text-xs text-white/70">
        © {new Date().getFullYear()} Sebisa Project. Semua hak dilindungi.
      </div>
    </footer>
  );
}