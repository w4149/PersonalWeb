import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n";
import { PreviewSetup } from "@/components/preview-setup";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Xie Yike",
  description: "Xie Yike's personal website.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        <PreviewSetup />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
