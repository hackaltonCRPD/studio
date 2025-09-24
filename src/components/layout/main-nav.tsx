"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileSearch,
  FilePlus,
  Users,
  BrainCircuit,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  allowedRoles: UserRole[];
  badge?: string;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, allowedRoles: ["admin", "rc_staff", "police", "reporter", "finder"] },
  { href: "/documents/report", label: "Report Document", icon: FilePlus, allowedRoles: ["reporter", "finder", "admin", "rc_staff"] },
  { href: "/documents/search", label: "Search Documents", icon: FileSearch, allowedRoles: ["admin", "rc_staff", "police", "reporter", "finder"] },
  { href: "/match-finder", label: "Match Finder", icon: BrainCircuit, allowedRoles: ["admin", "rc_staff"] },
  { href: "/admin", label: "Admin", icon: Users, allowedRoles: ["admin"] },
];

export function MainNav({ userRole, className, ...props }: React.HTMLAttributes<HTMLElement> & { userRole: UserRole }) {
  const pathname = usePathname();

  return (
    <div
      className={cn("flex flex-col space-y-1", className)}
      {...props}
    >
      {navItems.map((item) =>
        item.allowedRoles.includes(userRole) ? (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              pathname.startsWith(item.href) && item.href !== "/" && "bg-muted text-primary",
              pathname === "/" && item.href === "/" && "bg-muted text-primary"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
            {item.badge && (
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {item.badge}
              </Badge>
            )}
          </Link>
        ) : null
      )}
    </div>
  );
}
