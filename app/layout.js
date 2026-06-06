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
  title: "EnjeraPressList.Com — Free Rental & Property Listings Ethiopia & USA",
  description: "Find or list rental properties and real estate for sale in Ethiopia and USA. 100% free, no agents, no fees. Browse apartments, houses, condos. ቤት ኪራይ እና ሽያጭ ዝርዝሮች።",
  keywords: "rental listings Ethiopia, Ethiopian rentals, property for sale Ethiopia, Addis Ababa rentals, Washington DC rentals, enjera press list, free property listings, ቤት ኪራይ, ቤት ሽያጭ, አፓርትመንት ኪራይ",
  metadataBase: new URL("https://www.enjerapresslist.com"),
  alternates: {
    canonical: "https://www.enjerapresslist.com",
  },
  openGraph: {
    title: "EnjeraPressList.Com — Free Rental & Property Listings",
    description: "Find or list rental properties for free in Ethiopia and USA. No agents, no fees. Connect directly with landlords.",
    url: "https://www.enjerapresslist.com",
    siteName: "EnjeraPressList.Com",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://www.enjerapresslist.com/logo.gif",
        width: 400,
        height: 400,
        alt: "EnjeraPressList.Com Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "EnjeraPressList.Com — Free Rental & Property Listings",
    description: "Find or list rental properties for free in Ethiopia and USA.",
    images: ["https://www.enjerapresslist.com/logo.gif"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "w6jtGTG3ViGVGlc0TGfqu7vKwuwSEYEW7Hd_V0ryF9c",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://www.enjerapresslist.com" />
        <meta name="geo.region" content="ET" />
        <meta name="geo.placename" content="Ethiopia" />
        <meta name="language" content="English, Amharic" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "EnjeraPressList.Com",
              "url": "https://www.enjerapresslist.com",
              "description": "Free rental and property listings in Ethiopia and USA",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.enjerapresslist.com/?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
