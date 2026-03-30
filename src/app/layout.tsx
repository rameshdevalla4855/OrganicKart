import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";
import WhatsAppButton from "@/components/WhatsAppButton";
import BottomNav from "@/components/BottomNav";
import { Metadata } from "next";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shresta Organics | Pure Food • Pure Life",
  description: "Authentic, cold-pressed oils and organic essentials delivered from farm to your home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${playfair.variable} ${inter.variable} font-inter antialiased bg-background text-foreground flex flex-col min-h-screen`}>
        <AuthProvider>
          <LayoutWrapper>
            {children}
            <WhatsAppButton />
            <BottomNav />
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
