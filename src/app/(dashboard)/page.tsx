"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccountDetails } from '@/hooks/useAccount';

const Dashboard = () => {
  const router = useRouter();
  const { data: accountData, isLoading } = useAccountDetails();
  const user = accountData?.data;

  useEffect(() => {
    if (!isLoading && user?.accountType === 'staff') {
      router.replace('/orders');
    }
  }, [isLoading, user, router]);

  if (isLoading || user?.accountType === 'staff') {
    return null;
  }

  return (
    <div className='text-primary-500'>Dashboard</div>
  );
}

export default Dashboard