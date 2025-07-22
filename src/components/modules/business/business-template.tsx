"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useApi } from "@/network";
import { toast } from "sonner";
import type { AccountMeBusiness } from "@/types/apiResponse/account.payload";
import Image from "next/image";

export default function BusinessesPageTemplate() {
  const { accountApi, authApi } = useApi();
  const [businesses, setBusinesses] = useState<AccountMeBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<AccountMeBusiness | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchBusinesses() {
      setLoading(true);
      try {
        const res = await accountApi.getAccountDetails();
        setBusinesses(res.data.data.businesses || []);
      } catch {
        toast.error("Failed to load businesses");
      } finally {
        setLoading(false);
      }
    }
    fetchBusinesses();
  }, []);

  const handleBusinessClick = (business: AccountMeBusiness) => {
    setSelectedBusiness(business);
    setModalOpen(true);
  };

  const handleSwitchBusiness = async () => {
    if (!selectedBusiness) return;
    try {
      await authApi.switchToBusiness(selectedBusiness._id);
      toast.success(`Switched to business: ${selectedBusiness.name}`);
      setModalOpen(false);
      // Optionally, refetch user/business context or reload
      router.refresh();
    } catch {
      toast.error("Failed to switch business");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Businesses</h1>
      {loading ? (
        <p>Loading...</p>
      ) : businesses.length === 0 ? (
        <p>No businesses found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <div
              key={business._id}
              className="border rounded-lg p-6 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
              onClick={() => handleBusinessClick(business)}
            >
              <Image
                src={business.logo || business.image || "/vercel.svg"}
                alt={business.name}
                className=" object-cover rounded-full mb-4"
                width={60}
                height={60}
              />
              <h2 className="text-xl font-semibold mb-2">{business.name}</h2>
              {business.isPrimary && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Primary</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch Business</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to switch to <b>{selectedBusiness?.name}</b>?</p>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSwitchBusiness}>
              Yes, Switch
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
