import QRCode from 'qrcode';

export async function generateQRCode(url: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      ...options
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

export function generateTableQRUrl(subdomain: string, baseDomain: string, tableLink: string): string {
  // Generate URL in format: https://{subdomain}.{baseDomain}/{tableLink}
  return `https://${subdomain}.${baseDomain}/${tableLink}`;
} 