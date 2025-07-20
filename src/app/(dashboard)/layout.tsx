import React from "react";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import DynamicBreadcrumb from "@/components/app-sidebar/dynamic-breadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-center justify-start overflow-auto px-4 py-8 md:px-8 lg:px-12">
          <div className="w-full">
            <DynamicBreadcrumb />
            <div className="mt-6 rounded-xl shadow-md p-6 md:p-10">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
