import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "@/context/WagmiProvider";
import XrplProvider from "@/context/XrplProvider";
import { headers } from "next/headers";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import "./globals.css";

const tfMonobreak = localFont({
  src: "../public/fonts/TFMonobreak-Bold.ttf",
  variable: "--font-tf-monobreak",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Numevia — Pick your number. Own your chance.",
  description:
    "Seasonal ticket draw. Connect your wallet, choose your numbers, pay with USDC.",
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const headersList = await headers();
  const cookie = headersList.get("cookie") || undefined;

  return (
    <html lang="en" className={`${tfMonobreak.variable} h-full antialiased`}>
      <body className="">
        <Providers cookie={cookie}>
          <XrplProvider>
            <Header />
            {children}
            <Footer />
          </XrplProvider>
        </Providers>
      </body>
    </html>
  );
}
