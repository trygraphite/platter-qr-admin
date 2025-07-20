"use client";

import React, { useEffect, useState } from "react";

interface QRCodeCanvasProps {
  qrCodeUrl: string;
  width: number;
  height: number;
  target: "table" | "menu";
  targetId: string;
  onImageGenerated?: (url: string) => void;
  restaurantName?: string;
}

const backgroundImages = {
  table:
    "https://hhvjh1chgk.ufs.sh/f/31hJxXO5ls8pOpSo9By02cXudOvWY6AM75Nzg1TjRoEaIqSy",
  menu: "https://hhvjh1chgk.ufs.sh/f/31hJxXO5ls8pIOOxxjEnJ46GFk3TzvKm9yZAHRjqO2PpUlXg",
  default:
    "https://hhvjh1chgk.ufs.sh/f/31hJxXO5ls8pZQZhL8iNDmaVRkOEFwqGIW7QrxljB5ULosuX",
};

export function QRCodeCanvas({
  qrCodeUrl,
  width,
  height,
  target,
  targetId,
  restaurantName,
  onImageGenerated,
}: QRCodeCanvasProps) {
  const [combinedImageUrl, setCombinedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Debug logging
  console.log('QRCodeCanvas props:', { qrCodeUrl, width, height, target, targetId, restaurantName });

  useEffect(() => {
    let sketch: any;

    const generateCombinedImage = async () => {
      try {
        setIsLoading(true);
        const p5 = await import("p5") as any;
        sketch = new p5.default(async (p: any) => {
          let qrCode: any;
          let backgroundImage: any;

          p.setup = async () => {
            const canvas = p.createCanvas(width, height);
            
            // Load images asynchronously
            try {
              qrCode = await p.loadImage(qrCodeUrl);
              const bgImage = backgroundImages[target] || backgroundImages.default;
              backgroundImage = await p.loadImage(bgImage);
            } catch (error) {
              console.error('Error loading images:', error);
              setIsLoading(false);
              return;
            }
            
            // Draw background
            p.image(backgroundImage, 0, 0, width, height);

            // Text styling constants
            const titleMargin = 30;
            const textBelowMargin = 40;

            // Helper function to add text shadow
            const addTextShadow = (intensity = 0.8) => {
              p.drawingContext.shadowColor = `rgba(0, 0, 0, ${intensity})`;
              p.drawingContext.shadowBlur = 4;
              p.drawingContext.shadowOffsetX = 2;
              p.drawingContext.shadowOffsetY = 2;
            };

            // Helper function to reset shadow
            const resetShadow = () => {
              p.drawingContext.shadowColor = "transparent";
              p.drawingContext.shadowBlur = 0;
              p.drawingContext.shadowOffsetX = 0;
              p.drawingContext.shadowOffsetY = 0;
            };

            // Draw restaurant name at the top (if provided)
            let currentY = titleMargin;
            if (restaurantName) {
              p.textAlign(p.CENTER, p.TOP);
              p.fill(255, 255, 255, 250); // Bright white
              p.textSize(32);
              p.textStyle(p.BOLD);
              
              // Strong shadow for restaurant name
              addTextShadow(0.9);
              
              p.text(restaurantName.toUpperCase(), width / 2, currentY);
              
              resetShadow();
              
              currentY += 60;
            }

            // Draw subtitle/call-to-action
            p.textAlign(p.CENTER, p.TOP);
            p.fill(255, 255, 255, 240);
            p.textSize(24);
            p.textStyle(p.BOLD); // Made bold
            
            // Strong shadow for call-to-action
            addTextShadow(0.8);
            
            p.text("Scan to Place an Order Now!", width / 2, currentY);
            
            resetShadow();

            // Calculate QR code position
            const qrSize = Math.min(width, height) * 0.45;
            const qrX = width / 2 - qrSize / 2;
            const qrY = currentY + 130; // Space below subtitle

            // QR code container styling
            p.drawingContext.shadowColor = "rgba(0, 0, 0, 0.3)";
            p.drawingContext.shadowBlur = 25;
            p.drawingContext.shadowOffsetY = 15;

            // Draw QR code background
            p.fill(255);
            p.noStroke();
            p.rect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 20);

            // Reset shadow
            resetShadow();

            // Draw QR code
            p.image(qrCode, qrX, qrY, qrSize, qrSize);

            // Add QR code border
            p.stroke(255, 220);
            p.strokeWeight(4);
            p.noFill();
            p.rect(qrX, qrY, qrSize, qrSize, 12);

            // Target information below QR code
            const infoStartY = qrY + qrSize + textBelowMargin;

            // Add decorative line above info
            p.stroke(255, 180);
            p.strokeWeight(2);
            p.line(
              width / 2 - 80,
              infoStartY - 10,
              width / 2 + 80,
              infoStartY - 10,
            );

            // Target type
            p.textAlign(p.CENTER, p.TOP);
            p.fill(255, 255, 255, 250);
            p.textSize(28);
            p.textStyle(p.BOLD); // Made bold
            
            // Strong shadow for target text
            addTextShadow(0.8);

            p.text(target.toUpperCase(), width / 2, infoStartY + 10);

            if (targetId) {
              // Target ID (table name) - already bold, enhance shadow
              p.textSize(36);
              p.textStyle(p.BOLD);
              p.fill(255, 255, 255, 255); // Pure white
              
              // Extra strong shadow for target ID
              addTextShadow(0.9);
              
              p.text(targetId, width / 2, infoStartY + 50);
            }

            // Reset shadow
            resetShadow();

            const dataUrl = canvas.elt.toDataURL();
            setCombinedImageUrl(dataUrl);
            onImageGenerated?.(dataUrl);
            setIsLoading(false);
            p.remove();
          };
        });
      } catch (error) {
        console.error("Error generating QR code:", error);
        setIsLoading(false);
      }
    };

    generateCombinedImage();

    return () => {
      if (sketch) {
        sketch.remove();
      }
    };
  }, [qrCodeUrl, width, height, target, targetId, restaurantName, onImageGenerated]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Generating QR Code...</p>
        </div>
      </div>
    );
  }

  if (!combinedImageUrl) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Failed to generate QR code</p>
      </div>
    );
  }

  return (
    <img
      src={combinedImageUrl}
      alt="Combined QR Code"
      className="w-full h-full object-contain"
    />
  );
} 