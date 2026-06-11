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
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
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
        <link rel="icon" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ea580c" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EnjeraList" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
        <link rel="canonical" href="https://www.enjerapresslist.com" />
        <meta name="geo.region" content="ET" />
        <meta name="geo.placename" content="Ethiopia" />
        <meta name="language" content="English, Amharic" />
        <script dangerouslySetInnerHTML={{__html: `
          document.addEventListener('contextmenu', e => e.preventDefault());
          document.addEventListener('copy', e => e.preventDefault());
          document.addEventListener('cut', e => e.preventDefault());
          document.addEventListener('keydown', e => {
            if (e.key === 'F12') { e.preventDefault(); return false; }
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) { e.preventDefault(); return false; }
            if (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S' || e.key === 'a' || e.key === 'A' || e.key === 'c' || e.key === 'C')) { e.preventDefault(); return false; }
            if (e.metaKey && (e.key === 'u' || e.key === 'U' || e.key === 'a' || e.key === 'A' || e.key === 'c' || e.key === 'C')) { e.preventDefault(); return false; }
          });
          setInterval(() => {
            const threshold = 160;
            if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
              document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui;font-size:24px;color:#ea580c;font-weight:700;">🔒 Access Restricted</div>';
            }
          }, 1000);
        `}} />
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

