import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "(주)남서울상사 B2B 타이어 재고 관리 플랫폼",
  description: "B2B 전용 간편 발주 및 재고 관리 시스템",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "남서울B2B",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
