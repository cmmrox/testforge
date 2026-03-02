"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
};

const nav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/environments", label: "Environments" },
  { href: "/domains", label: "Domains" },
  { href: "/test-plans", label: "Test Plans" },
  { href: "/test-cases", label: "Test Cases" },
  { href: "/runs", label: "Runs" },
  { href: "/audit", label: "Audit" },
  { href: "/settings", label: "Settings" },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-2">
      {nav.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-100"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
