"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, MapPin, MessageSquare } from "lucide-react";

export default function SidebarNav() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Order History", href: "/dashboard/orders", icon: History },
    { name: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    { name: "Reviews", href: "/dashboard/reviews", icon: MessageSquare },
  ];

  return (
    <nav className="sidebar-menu">
      {links.map((link) => {
        const Icon = link.icon;
        // Exact match for base, prefix match for nested paths under /orders etc.
        const isActive = link.href === "/dashboard" 
          ? pathname === "/dashboard" 
          : pathname?.startsWith(link.href);

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`sidebar-nav-item ${isActive ? "active" : ""}`}
          >
            <Icon size={18} />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
