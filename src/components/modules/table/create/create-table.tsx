"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Info, QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApi } from "@/network";
import { CreateBusinessTableRequest } from "@/types/apiRequest/business.request";
import { QUERY_KEYS } from "@/keys/query-keys";
import { generateQRCode, generateTableQRUrl } from "@/utils/qr-code";
import { QRDisplay } from "@/components/custom/qr-display";
import { useAccountDetails, useActiveBusiness } from "@/hooks/useAccount";

const tableSchema = z.object({
  name: z.string().min(1, "Table name is required"),
});

type TableFormData = z.infer<typeof tableSchema>;

const CreateTable = () => {
  const { businessApi } = useApi();
  const queryClient = useQueryClient();
  const { data: accountData } = useAccountDetails();
  const { data: activeBusinessData } = useActiveBusiness();
  const [showQRCode, setShowQRCode] = useState(false);
  const [createdTable, setCreatedTable] = useState<{
    name: string;
    link: string;
  } | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  // Debug logging
  console.log("accountData:", accountData);
  const primaryBusiness = accountData?.data?.businesses?.find(
    (b) => b.isPrimary
  );
  const subdomain = activeBusinessData?.data?.subdomain;
  console.log("primaryBusiness:", primaryBusiness);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TableFormData>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      name: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: CreateBusinessTableRequest) => {
      const response = await businessApi.createTable(payload);
      return response;
    },
    onSuccess: async (response) => {
      const table = response.data;
      console.log("Table response:", table);
      // Generate unique table link: tableID-tableName (kebab-case)
      const kebabName = table.name.toLowerCase().replace(/\s+/g, "-");
      const uniqueTableLink = `${table._id}-${kebabName}`;
      setCreatedTable({ name: table.name, link: uniqueTableLink });
      // Generate QR code URL using subdomain and base domain
      const tableUrl = generateTableQRUrl(
        subdomain?.toLowerCase().replace(/\s+/g, "-") || "",
        process.env.NEXT_PUBLIC_BASE_DOMAIN || "",
        uniqueTableLink
      );
      try {
        const qrCodeDataUrl = await generateQRCode(tableUrl);
        setQrCodeUrl(qrCodeDataUrl);
        setShowQRCode(true);
        toast.success("Table created successfully! QR code generated.");
      } catch (error) {
        console.error("Error generating QR code:", error);
        toast.success("Table created successfully!");
      }
      reset();
      // Invalidate tables query to refresh the list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_BUSINESS_TABLES],
      });
    },
    onError: () => {
      toast.error("Failed to create table");
    },
  });

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="max-w-md mx-auto bg-transparent space-y-6 p-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <Label className="text-lg">Create Table</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <span className="text-white">
                  Create a new table for your restaurant. Tables help organize
                  seating and orders.
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Table Name</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="e.g. Table 1, VIP Table, Outdoor 1"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full text-white"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            "Creating..."
          ) : (
            <>
              <QrCode className="w-4 h-4 mr-2" />
              Create Table & Generate QR Code
            </>
          )}
        </Button>
      </form>

      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Table QR Code Generated</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {qrCodeUrl && createdTable && (
              <QRDisplay
                qrCodeUrl={qrCodeUrl}
                tableName={createdTable.name}
                type="table"
                restaurantName={primaryBusiness?.name || "The Sauce"}
              />
            )}
            {/* Debug info */}
            {qrCodeUrl && createdTable && (
              <div className="text-xs text-muted-foreground mt-2">
                Debug: tableName={createdTable.name}, restaurantName=
                {primaryBusiness?.name || "The Sauce"}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateTable;
