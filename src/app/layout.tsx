import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { CartProvider } from "@/hooks/use-cart";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Toko Briyani — Authentic Aromatic Briyani & Indian-Inspired Kitchen",
    template: "%s | Toko Briyani",
  },
  description:
    "Discover rich whole spices, fragrant long-grain basmati rice, and the comforting taste of freshly steamed Briyani crafted for every gathering. Order online for pickup or delivery.",
  openGraph: {
    title: "Toko Briyani — An Aroma Worth Gathering For",
    description:
      "Freshly steamed Chicken Briyani, Beef Briyani, Royal Special Briyani, Chicken Tikka, Samosa, Garlic Naan, and chilled Mango Lassi.",
    type: "website",
    locale: "id_ID",
    siteName: "Toko Briyani",
    images: [{ url: "/images/hero-briyani.jpg", width: 1200, height: 900, alt: "Toko Briyani Signature Briyani" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#FCFAF6] font-sans text-[#272923]">
        <CartProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#173F35",
                color: "#FCFAF6",
                border: "1px solid #285747",
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
