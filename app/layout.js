import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EnjeraPressList.Com — Free Rental & Property Listings",
  description: "Find or list rental properties and real estate for sale in Ethiopia and the US. 100% free, no agents, no fees. Connect directly with landlords.",
  keywords: "rental listings, Ethiopia real estate, Ethiopian rentals, property for sale, enjera press list",
  openGraph: {
    title: "EnjeraPressList.Com — Free Rental & Property Listings",
    description: "Find or list rental properties for free. No agents, no fees.",
    url: "https://www.enjerapresslist.com",
    siteName: "EnjeraPressList.Com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
