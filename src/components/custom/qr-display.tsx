"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { useState } from "react";
import { QRCodeCanvas } from "./qr-code-canvas";

interface QRDisplayProps {
  qrCodeUrl: string;
  tableName?: string;
  type: "table" | "menu";
  restaurantName?: string;
}

export function QRDisplay({
  qrCodeUrl,
  tableName,
  type,
  restaurantName,
}: QRDisplayProps) {
  const [combinedImageUrl, setCombinedImageUrl] = useState<string | null>(null);
  
  // Debug logging
  console.log('QRDisplay props:', { qrCodeUrl, tableName, type, restaurantName });

  const handleDownload = () => {
    if (!combinedImageUrl) return;

    const link = document.createElement("a");
    link.href = combinedImageUrl;
    link.download = getFileName();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileName = () => {
    if (type === "menu") return "menu-qrcode.png";
    const sanitizedName = tableName?.toLowerCase().replace(/\s+/g, "-") || "table";
    return `${sanitizedName}-qrcode.png`;
  };

  const getTitle = () => {
    if (type === "menu") return "Menu QR Code";
    return `${tableName || 'Table'} QR Code`;
  };

  return (
    <Card className="p-6 flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold">{getTitle()}</h3>
      <div className="w-84 h-84">
        <QRCodeCanvas
          qrCodeUrl={qrCodeUrl}
          width={556}
          height={756}
          target={type}
          targetId={tableName || ""}
          onImageGenerated={setCombinedImageUrl}
          restaurantName={restaurantName}
        />
      </div>
      <Button
        onClick={handleDownload}
        className="w-full"
        disabled={!combinedImageUrl}
      >
        <Download className="mr-2 h-4 w-4" />
        Download QR Code
      </Button>
    </Card>
  );
} 