"use client";

import { usePathname } from "next/navigation";

export function scrollToAnchor(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const navbar = document.querySelector("nav");
  const navbarHeight = navbar?.getBoundingClientRect().height || 0;
  const targetTop = target.getBoundingClientRect().top + window.scrollY;

  window.scrollTo({
    top: Math.max(0, targetTop - navbarHeight - 16),
    behavior: "smooth",
  });
}

export default function ScrollLink({ href, className, children, onClick }) {
  const pathname = usePathname();

  const handleClick = (event) => {
    event.preventDefault();
    onClick?.(event);

    const targetId = href.replace(/^#/, "");
    if (pathname !== "/") {
      window.location.href = `/${href}`;
      return;
    }

    if (!targetId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    scrollToAnchor(targetId);
  };

  return (
    <a className={className} href={href} onClick={handleClick}>
      {children}
    </a>
  );
}
