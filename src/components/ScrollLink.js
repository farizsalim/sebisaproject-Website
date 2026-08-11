"use client";

import { usePathname } from "next/navigation";

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

    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <a className={className} href={href} onClick={handleClick}>
      {children}
    </a>
  );
}
