import QRCode from "qrcode";

export async function generateQrDataUrl(textOrUrl: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(textOrUrl, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 320,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    return dataUrl;
  } catch (err) {
    console.error("QR Code generation error:", err);
    throw err;
  }
}
