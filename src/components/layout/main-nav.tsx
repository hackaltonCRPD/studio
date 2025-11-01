

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileSearch,
  FilePlus,
  Users,
  BrainCircuit,
  MessageSquare,
  HelpCircle,
  BookUser,
  Bell,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  allowedRoles: UserRole[];
  badge?: string;
  subItems?: NavItem[];
  roleSpecificHref?: Partial<Record<UserRole, string>>;
};

const navItems: NavItem[] = [
  { 
    href: "/dashboard", 
    label: "Dashboard", 
    icon: LayoutDashboard, 
    allowedRoles: ["admin", "rc_staff", "police", "reporter", "finder"],
    roleSpecificHref: {
      "rc_staff": "/rc-staff/dashboard",
      "police": "/police/dashboard"
    }
  },
  { href: "/documents/report", label: "Report Document", icon: FilePlus, allowedRoles: ["reporter", "finder", "admin", "rc_staff"] },
  { href: "/documents/search", label: "Search Documents", icon: FileSearch, allowedRoles: ["admin", "rc_staff", "police", "reporter", "finder"] },
  { href: "/match-finder", label: "Match Finder", icon: BrainCircuit, allowedRoles: ["admin", "rc_staff"] },
  { 
    href: "/admin", 
    label: "Admin", 
    icon: Users, 
    allowedRoles: ["admin"],
    subItems: [
        { href: "/admin", label: "Users", icon: Users, allowedRoles: ["admin"]},
        { href: "/admin/feedback", label: "Feedback", icon: MessageSquare, allowedRoles: ["admin"]},
        { href: "/admin/enquiries", label: "Enquiries", icon: HelpCircle, allowedRoles: ["admin"]},
    ]
  },
  { href: "/notifications", label: "Notifications", icon: Bell, allowedRoles: ["admin", "rc_staff", "police", "reporter", "finder"] },
  { href: "/guide", label: "User Guide", icon: BookUser, allowedRoles: ["admin", "rc_staff", "police", "reporter", "finder"] },
  { href: "/feedback", label: "Feedback", icon: MessageSquare, allowedRoles: ["reporter", "finder", "rc_staff", "police"] },
  { href: "/enquiry", label: "Enquiry", icon: HelpCircle, allowedRoles: ["reporter", "finder", "rc_staff", "police"] },
];

export function MainNav({ userRole, className, ...props }: React.HTMLAttributes<HTMLElement> & { userRole: UserRole }) {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');

  return (
    <div
      className={cn("flex flex-col space-y-1", className)}
      {...props}
    >
      {navItems.map((item) => {
        if (!item.allowedRoles.includes(userRole)) {
            return null;
        }

        const href = item.roleSpecificHref?.[userRole] || item.href;

        return item.subItems && userRole === 'admin' ? (
            <Accordion key={item.href} type="single" collapsible defaultValue={isAdminPath ? "admin-main" : ""}>
              <AccordionItem value="admin-main" className="border-b-0">
                <AccordionTrigger className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:no-underline",
                    pathname.startsWith(item.href) && "bg-muted text-primary"
                )}>
                   <div className="flex items-center gap-3">
                     <item.icon className="h-4 w-4" />
                     {item.label}
                   </div>
                </AccordionTrigger>
                <AccordionContent className="pl-4 pt-1">
                  {item.subItems.map(subItem => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        pathname === subItem.href && "bg-muted text-primary"
                      )}
                    >
                      <subItem.icon className="h-4 w-4" />
                      {subItem.label}
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
             (!item.subItems || userRole !== 'admin') &&
             <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname.startsWith(href) && href !== "/" && "bg-muted text-primary",
                  pathname === href && "bg-muted text-primary",
                  item.href === '/admin' && 'hidden' // hide base admin link for admins, it's in the accordion
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
          )
        }
      )}
    </div>
  );
}
