"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { items } from "../constants/nav-items";
import { useAccountDetails } from '@/hooks/useAccount';

interface NavItem {
  name: string;
  url?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

export function NavMain() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { data: accountData, isLoading, error } = useAccountDetails();
  const user = accountData?.data;

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuButton disabled>Loading...</SidebarMenuButton>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  if (error || !user) {
    return null;
  }

  // If staff, only show Orders
  const filteredItems = user.accountType === 'staff'
    ? items.filter((item) => item.name === 'Orders')
    : items;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>
      <SidebarMenu>
        {filteredItems.map((item: NavItem) => (
          <div key={item.name}>
            {/* Main Navigation Item */}
            <SidebarMenuButton
              asChild
              className={`hover:bg-muted border border-transparent hover:border-border flex items-center gap-2 px-3 py-2 ${
                pathname === item.url ? "bg-muted border-border" : ""
              }`}
              onClick={() =>
                item.children
                  ? setOpenDropdown(
                      openDropdown === item.name ? null : item.name,
                    )
                  : null
              }
            >
              <Link href={item.url || "#"} className="flex items-center w-full">
                <item.icon
                  className={`${pathname === item.url ? "text-primary" : "text-foreground"}`}
                />
                <span className="ml-2">{item.name}</span>
                {item.children && (
                  <ChevronDown
                    className={`ml-auto transition-transform ${
                      openDropdown === item.name ? "rotate-180" : ""
                    }`}
                  />
                )}
              </Link>
            </SidebarMenuButton>

            {/* Dropdown Items */}
            {item.children && openDropdown === item.name && (
              <SidebarMenu className="pl-6">
                {item.children.map((child: NavItem) => (
                  <SidebarMenuItem key={child.name}>
                    <SidebarMenuButton
                      asChild
                      className="flex items-center gap-2 px-3 py-2"
                    >
                      <Link
                        href={child.url || "#"}
                        className="flex items-center w-full"
                      >
                        <child.icon className="text-muted-foreground" />
                        <span className="ml-2">{child.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
