// app/components/app-sidebar.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import HomeLink from "./home-link";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";


export function AppSidebar({ ...props }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user");
        // console.log(response)
        if (!response.ok) throw new Error("Failed to fetch user");
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b flex shrink-0 h-16 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <HomeLink user={user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
