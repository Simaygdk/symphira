import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FCMInitializer } from "./fcm-init";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Symphira",
  description: "Where music finds purpose.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-black text-white">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <FCMInitializer />
        {children}
      </body>
    </html>
  );
}
