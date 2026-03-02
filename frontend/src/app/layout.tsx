import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Breathometer AI — Air Quality & Lung Health Intelligence",
  description: "AI-native, real-time respiratory risk intelligence platform combining live pollution data with calibrated ensemble ML",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F9FAFB] min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
