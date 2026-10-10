"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks({ items, exact = [] }: { items: Array<[string, string]>; exact?: string[] }) {
  const pathname = usePathname();
  return (
    <>
      {items.map(([label, href]) => {
        const active = exact.includes(href) ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined} className={active ? "active" : undefined}>
            {label}
          </Link>
        );
      })}
    </>
  );
}
