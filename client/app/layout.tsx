import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Layout/Navbar";
import { SolanaProvider } from "@/providers/Solana.providers";
import Footer from "@/components/Layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BountyStack",
  description: "Blockchain-powered Q&A platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SolanaProvider>
          <div className="fixed top-0 left-0 right-0 z-50">
            <Navbar />
          </div>
          <div className="pt-20">
            {children}
          </div>
          <Footer />
        </SolanaProvider>
      </body>
    </html>
  );
}