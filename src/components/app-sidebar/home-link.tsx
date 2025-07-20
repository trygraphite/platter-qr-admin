"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import React from "react";
import { useAccountDetails } from "@/hooks/useAccount";

function HomeLink() {
  const { data: accountData, isLoading, error } = useAccountDetails();

  // Extract user data from the API response
  const userData = accountData?.data;
  // Generate initials from first and last name
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex shrink-0 h-full">
        <Link
          className="flex items-center gap-2 w-full hover:bg-muted hover:border-border border-transparent"
          href="/"
        >
          <div className="text-sidebar-primary-foreground flex aspect-square">
            <Avatar className="size-8 rounded-[4px]">
              <AvatarFallback className="rounded-[4px]">...</AvatarFallback>
            </Avatar>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium text-sm">Loading...</span>
            <span className="truncate text-xs text-primary">Loading...</span>
          </div>
        </Link>
      </div>
    );
  }

  // Show error state
  if (error || !userData) {
    return (
      <div className="flex shrink-0 h-full">
        <Link
          className="flex items-center gap-2 w-full hover:bg-muted hover:border-border border-transparent"
          href="/"
        >
          <div className="text-sidebar-primary-foreground flex aspect-square">
            <Avatar className="size-8 rounded-[4px]">
              <AvatarFallback className="rounded-[4px]">!</AvatarFallback>
            </Avatar>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium text-sm">Error</span>
            <span className="truncate text-xs text-primary">
              Failed to load
            </span>
          </div>
        </Link>
      </div>
    );
  }

  const fullName = `${userData.firstName} ${userData.lastName}`;
  const initials = getInitials(userData.firstName, userData.lastName);
  const designation = userData.designation || "User";

  return (
    <div className="flex shrink-0 h-full">
      <Link
        className="flex items-center gap-2 w-full hover:bg-muted hover:border-border border-transparent"
        href="/"
      >
        <div className="text-sidebar-primary-foreground flex aspect-square">
          <Avatar className="size-8 rounded-[4px]">
            <AvatarFallback className="rounded-[4px] bg-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium text-sm">{fullName}</span>
          <span className="truncate text-xs text-primary">{designation}</span>
        </div>
      </Link>
    </div>
  );
}

export default HomeLink;
