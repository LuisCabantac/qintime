import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QInTime",
  description:
    "Web app for simplifying school event attendance with QR code scanning. Automates check-in/out, tracks time, and provides real-time attendance data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#f8f9fa] antialiased`}>
        {children}
      </body>
    </html>
  );
}
