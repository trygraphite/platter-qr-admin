"use client";

import {
  ChevronsUpDown,
  LogOut,
  Building2,
  CreditCard,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAccountDetails, useActiveBusiness } from "@/hooks/useAccount";
import { useAuthStore } from "@/store/auth";
import { removeAuthToken } from "@/utils/cookies";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { setUser } = useAuthStore();
  const {
    data: accountData,
    isLoading: accountLoading,
    error: accountError,
  } = useAccountDetails();
  const {
    data: businessData,
    isLoading: businessLoading,
    error: businessError,
  } = useActiveBusiness();

  // Extract user data from the API response
  const userData = accountData?.data;
  const businessInfo = businessData?.data;

  // Generate initials from first and last name
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Generate business initials from business name
  const getBusinessInitials = (businessName: string) => {
    return businessName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle logout
  const handleLogout = () => {
    try {
      // Clear auth token from cookies
      removeAuthToken();

      // Clear user data from store
      setUser(null);

      // Show success message
      toast.success("Logged out successfully", {
        description: "You have been logged out of your account.",
      });

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed", {
        description: "Please try again.",
      });
    }
  };

  // Handle switch business (placeholder for now)
  const handleSwitchBusiness = () => {
    // toast.info("Switch Business", {
    //   description: "Business switching functionality coming soon!",
    // });
    router.push("/businesses");
  };

  // Handle view plans (placeholder for now)
  const handleViewPlans = () => {
    toast.info("View Plans", {
      description: "Subscription plans page coming soon!",
    });
    // TODO: Navigate to plans/subscription page
    // router.push("/plans");
  };

  // Handle profile settings
  const handleProfileSettings = () => {
    router.push("/settings");
  };

  // Show loading state
  if (accountLoading || businessLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <Avatar className="size-8 rounded-[4px]">
              <AvatarFallback className="rounded-[4px]">...</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Loading...</span>
              <span className="truncate text-xs">Loading...</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Show error state
  if (accountError || businessError || !userData || !businessInfo) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <Avatar className="size-8 rounded-[4px]">
              <AvatarFallback className="rounded-[4px]">!</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Error</span>
              <span className="truncate text-xs">Failed to load data</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const fullName = `${userData.firstName} ${userData.lastName}`;
  const userEmail = userData.email?.value || "";
  const userInitials = getInitials(userData.firstName, userData.lastName);
  const businessName = businessInfo.name;
  const businessLogo = businessInfo.logo;
  const businessInitials = getBusinessInitials(businessName);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-[4px]">
                <Image
                  src={businessLogo || userInitials}
                  alt={fullName}
                  className="rounded-[4px]"
                  width={40}
                  height={40}
                />
                <AvatarFallback className="rounded-[4px]">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{fullName}</span>
                <span className="truncate text-xs">{businessName}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <Image
                    src={businessLogo || ""}
                    width={40}
                    height={40}
                    alt={fullName}
                  />
                  <AvatarFallback className="rounded-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{fullName}</span>
                  <span className="truncate text-xs">{userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Business Section */}
            <DropdownMenuItem disabled className="opacity-60">
              <div className="flex items-center gap-2 w-full">
                <Avatar className="h-6 w-6 rounded">
                  <Image
                    src={businessLogo || ""}
                    alt={businessName}
                    width={40}
                    height={40}
                  />
                  <AvatarFallback className="rounded text-xs">
                    {businessInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-xs leading-tight">
                  <span className="truncate font-medium">{businessName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Active Business
                  </span>
                </div>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Action Items */}
            <DropdownMenuItem onClick={handleProfileSettings}>
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleSwitchBusiness}>
              <Building2 className="mr-2 h-4 w-4" />
              Switch Business
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleViewPlans}>
              <CreditCard className="mr-2 h-4 w-4" />
              View Plans
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Theme Toggle */}
            <DropdownMenuItem asChild>
              <div className="flex items-center justify-between w-full">
                <span>Theme</span>
                <ThemeToggle />
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
