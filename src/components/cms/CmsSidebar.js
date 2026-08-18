"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaBars,
  FaBriefcase,
  FaChevronDown,
  FaFileLines,
  FaRightFromBracket,
  FaXmark,
} from "react-icons/fa6";

const navigationItems = [
  {
    label: "Konten Website",
    href: "/cms/content",
    icon: FaFileLines,
    children: [
      { label: "Navigasi Website", section: "navbar" },
      { label: "Hero / Halaman Utama", section: "hero" },
      { label: "Mitra", href: "/cms/clients" },
      { label: "Tentang Kami", section: "about" },
      { label: "Pertanyaan Umum", section: "faq" },
      { label: "CTA Penutup", section: "finalCta" },
      { label: "Footer", section: "footer" },
    ],
  },
  {
    label: "Layanan",
    href: "/cms/services",
    icon: FaBriefcase,
  },
];

function NavigationLinks({ onNavigate, pathname }) {
  const [openMenu, setOpenMenu] = useState(pathname === "/cms/content");

  return (
    <nav className="mt-8 space-y-1" aria-label="Navigasi CMS">
      <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
        Workspace
      </p>
      {navigationItems.map(({ label, href, icon: Icon, children }) => (
        <div key={href}>
          {!children ? (
            <Link
              className={`group flex w-full items-center gap-3 border-l-2 px-3 py-3 text-left text-sm font-bold transition ${pathname === href ? "border-orange bg-white/10 text-white" : "border-transparent text-white/65 hover:border-brand-blue hover:bg-white/10 hover:text-white"}`}
              href={href}
              onClick={onNavigate}
            >
              <Icon className="w-4 text-brand-blue-light transition group-hover:text-orange" aria-hidden="true" />
              {label}
            </Link>
          ) : null}
          {children ? (
          <button
            className={`group flex w-full items-center justify-between gap-3 border-l-2 px-3 py-3 text-left text-sm font-bold transition ${pathname === href ? "border-orange bg-white/10 text-white" : "border-transparent text-white/65 hover:border-brand-blue hover:bg-white/10 hover:text-white"}`}
            type="button"
            aria-expanded={openMenu}
            onClick={() => setOpenMenu((open) => !open)}
          >
            <span className="flex items-center gap-3">
              <Icon className="w-4 text-brand-blue-light transition group-hover:text-orange" aria-hidden="true" />
              {label}
            </span>
            <FaChevronDown className={`w-3 transition-transform ${openMenu ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
          ) : null}
          {openMenu ? (
            children ? <div className="ml-4 border-l border-white/15 pl-3">
              {children.map(({ label: childLabel, section, href: childHref }) => (
                <Link
                  className="block border-l-2 border-transparent px-3 py-2 text-xs font-bold text-white/60 transition hover:border-orange hover:bg-white/10 hover:text-white"
                  href={childHref || `${href}?section=${section}`}
                  key={childHref || section}
                  onClick={onNavigate}
                >
                  {childLabel}
                </Link>
              ))}
            </div> : null
          ) : null}
        </div>
      ))}
    </nav>
  );
}

export default function CmsSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  function handleSignOut() {
    signOut({ callbackUrl: "/login" });
  }

  return (
    <>
      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Tutup sidebar" : "Buka sidebar"}
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center border-2 border-deep-navy bg-orange text-deep-navy shadow-[3px_3px_0_var(--brand-hot-pink)] lg:hidden"
        type="button"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <FaXmark aria-hidden="true" /> : <FaBars aria-hidden="true" />}
      </button>

      {isOpen ? (
        <button
          aria-label="Tutup sidebar"
          className="fixed inset-0 z-40 bg-deep-navy/60 lg:hidden"
          type="button"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      <aside
        className={`brand-footer-gradient fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r-2 border-white/10 px-5 py-7 text-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <Link className="min-w-0" href="/cms/content" onClick={() => setIsOpen(false)}>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue-light">
              Sebisa Project
            </p>
            <p className="mt-2 text-2xl font-black tracking-tight text-white">CMS</p>
          </Link>
          <button
            aria-label="Tutup sidebar"
            className="flex h-9 w-9 items-center justify-center border border-white/20 text-white/60 transition hover:border-hot-pink hover:bg-hot-pink hover:text-deep-navy lg:hidden"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            <FaXmark aria-hidden="true" />
          </button>
        </div>

        <NavigationLinks onNavigate={() => setIsOpen(false)} pathname={pathname} />

        <div className="mt-auto border-t border-white/10 pt-5">
          <button
            className="flex items-center gap-3 px-3 py-3 text-sm font-bold text-white/65 transition hover:bg-white/10 hover:text-white"
            type="button"
            onClick={handleSignOut}
          >
            <FaRightFromBracket className="w-4 text-hot-pink" aria-hidden="true" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
