"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccountDetails, useActiveBusiness } from '@/hooks/useAccount';
import DashboardLayout from '@/components/modules/dashboard/dashboard-layout';

const Dashboard = () => {
  const router = useRouter();
  const { data: accountData, isLoading } = useAccountDetails();
  const user = accountData?.data;
  const { error: businessError } = useActiveBusiness();

  useEffect(() => {
    if (businessError) {
      const err = businessError as any;
      if (
        err?.response?.data?.data?.error?.includes("NotFoundException") ||
        err?.response?.data?.message === "Not Found"
      ) {
        router.push("/settings");
      }
    }
  }, [businessError, router]);

  useEffect(() => {
    if (!isLoading && user?.accountType === 'staff') {
      router.replace('/orders');
    }
  }, [isLoading, user, router]);

  if (isLoading || user?.accountType === 'staff') {
    return null;
  }

  return (
    <DashboardLayout/>
  );
}

export default Dashboard