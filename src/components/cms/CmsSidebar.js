"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBars,
  FaChevronDown,
  FaFileLines,
  FaMoneyBillWave,
  FaGaugeHigh,
  FaGear,
  FaUserPlus,
  FaRightFromBracket,
  FaXmark,
} from "react-icons/fa6";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/cms",
    icon: FaGaugeHigh,
  },
  {
    label: "Website",
    href: "/cms/clients",
    icon: FaFileLines,
    activePaths: ["/cms/quiz", "/cms/clients", "/cms/content", "/cms/behind-scenes", "/cms/team", "/cms/testimonials"],
    children: [
      { label: "Kuis konsultasi", href: "/cms/quiz" },
      { label: "Mitra", href: "/cms/clients" },
      { label: "Studi kasus", href: "/cms/content" },
      { label: "Behind the scenes", href: "/cms/behind-scenes" },
      { label: "Team", href: "/cms/team" },
      { label: "Testimonials", href: "/cms/testimonials" },
      { label: "Kontak", href: "/cms/content/settings?section=footer" },
    ],
  },
  {
    label: "Penjualan",
    href: "/cms/services",
    icon: FaMoneyBillWave,
    activePaths: ["/cms/services", "/cms/coupons", "/cms/payments"],
    children: [
      { label: "Layanan & paket", href: "/cms/services" },
      { label: "Kupon", href: "/cms/coupons" },
      { label: "Ringkasan pembayaran", href: "/cms/payments" },
      { label: "Transaksi", href: "/cms/payments/transactions" },
    ],
  },
  {
    label: "Pengaturan",
    href: "/cms/settings",
    icon: FaGear,
  },
  {
    label: "Daftarkan akun",
    href: "/cms/users",
    icon: FaUserPlus,
    requiredRole: "SUPER_ADMIN",
  },
];

function NavigationLinks({ onNavigate, pathname }) {
  const searchParams = useSearchParams();
  const currentSection = searchParams.get("section");
  const activeGroupPaths = ["/cms/quiz", "/cms/clients", "/cms/content", "/cms/behind-scenes", "/cms/team", "/cms/testimonials", "/cms/services", "/cms/coupons", "/cms/payments"];
  const hasActiveGroup = activeGroupPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const [openMenu, setOpenMenu] = useState(hasActiveGroup);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (hasActiveGroup) setOpenMenu(true);
  }, [hasActiveGroup]);

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((session) => setUserRole(session?.user?.role || ""))
      .catch(() => setUserRole(""));
  }, []);

  return (
    <nav className="mt-8 space-y-1" aria-label="Navigasi CMS">
      <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
        Workspace
      </p>
      {navigationItems.filter((item) => !item.requiredRole || item.requiredRole === userRole).map(({ label, href, icon: Icon, children, activePaths }) => {
        const isActive = (activePaths || [href]).some((path) => pathname === path || pathname.startsWith(`${path}/`));
        return <div key={href}>
          {!children ? (
            <Link
              className={`group flex w-full items-center gap-3 rounded-xl border-l-2 px-3 py-3 text-left text-sm font-bold transition ${isActive ? "border-orange bg-white/10 text-white" : "border-transparent text-white/65 hover:border-brand-blue hover:bg-white/10 hover:text-white"}`}
              href={href}
              aria-current={isActive ? "page" : undefined}
              onClick={onNavigate}
            >
              <Icon className="w-4 text-brand-blue-light transition group-hover:text-orange" aria-hidden="true" />
              {label}
            </Link>
          ) : null}
          {children ? (
            <div className={`flex w-full items-center rounded-xl border-l-2 text-sm font-bold transition ${isActive ? "border-orange bg-white/10 text-white" : "border-transparent text-white/65"}`}>
              <Link className="group flex min-w-0 flex-1 items-center gap-3 px-3 py-3 hover:text-white" href={href} aria-current={isActive ? "page" : undefined} onClick={onNavigate}>
                <Icon className="w-4 shrink-0 text-brand-blue-light transition group-hover:text-orange" aria-hidden="true" />
                <span>{label}</span>
              </Link>
              <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/10 hover:text-white" type="button" aria-label={`${openMenu ? "Tutup" : "Buka"} menu ${label}`} aria-expanded={openMenu} onClick={() => setOpenMenu((open) => !open)}>
                <FaChevronDown className={`w-3 transition-transform ${openMenu ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
            </div>
          ) : null}
          {openMenu ? (
            children ? <div className="ml-4 border-l border-white/15 pl-3">
              {children.map(({ label: childLabel, section, href: childHref }) => {
                const childPath = childHref?.split("?")[0];
                const isChildActive = childHref
                  ? pathname === childPath || pathname.startsWith(`${childPath}/`)
                  : pathname === href && currentSection === section;
                return <Link
                  className={`relative block rounded-lg border-l-2 px-3 py-2 text-xs font-bold transition ${isChildActive ? "border-orange bg-orange/15 text-white" : "border-transparent text-white/60 hover:border-orange hover:bg-white/10 hover:text-white"}`}
                  href={childHref || `${href}?section=${section}`}
                  aria-current={isChildActive ? "page" : undefined}
                  key={childHref || section}
                  onClick={onNavigate}
                >
                  {isChildActive ? <span className="absolute -left-[5px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-orange" /> : null}
                  {childLabel}
                </Link>;
              })}
            </div> : null
          ) : null}
        </div>;
      })}
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
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border-2 border-deep-navy bg-orange text-deep-navy shadow-[0_8px_20px_rgb(23_36_61_/_22%)] lg:hidden"
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
          <Link className="min-w-0" href="/cms" onClick={() => setIsOpen(false)}>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue-light">
              Sebisa Project
            </p>
            <p className="mt-2 text-2xl font-black tracking-tight text-white">CMS</p>
          </Link>
          <button
            aria-label="Tutup sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 transition hover:border-hot-pink hover:bg-hot-pink hover:text-deep-navy lg:hidden"
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
