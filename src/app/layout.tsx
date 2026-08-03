import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Operation Dhruv Tara | AI Personal Mission Control Operating System",
  description:
    "Operation Dhruv Tara is an advanced AI-powered Life Operating System engineered by Shyam Sundar. Features 15 sovereign modules for personal growth, AI career, projects, habits, health, finance, and Mission 2030.",
  keywords: [
    "Operation Dhruv Tara",
    "Dhruv Tara",
    "Mission Control OS",
    "Shyam Sundar",
    "AI Life Operating System",
    "Personal Mission Control",
    "Second Brain",
    "AI Assistant Suite",
    "Productivity OS",
  ],
  authors: [{ name: "Shyam Sundar", url: "https://github.com/Shyamsundar2203" }],
  creator: "Shyam Sundar",
  publisher: "Shyam Sundar",
  metadataBase: new URL("https://dhruv-tara.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Operation Dhruv Tara | AI Mission Control OS",
    description: "The world's most advanced personal AI Life Operating System by Shyam Sundar. Tesla UI + JARVIS + Notion + Linear + GitHub inside one app.",
    url: "https://dhruv-tara.vercel.app",
    siteName: "Operation Dhruv Tara",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Operation Dhruv Tara Mission Control OS",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Operation Dhruv Tara | Mission Control OS",
    description: "AI-Powered Personal Mission Control OS engineered by Shyam Sundar. Managing personal growth, AI engineering, health, finance, & Mission 2030.",
    creator: "@shyamsundar2203",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Dhruv Tara OS",
  },
};

export const viewport: Viewport = {
  themeColor: "#040408",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Structured Data (JSON-LD) for Search Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Operation Dhruv Tara",
              "operatingSystem": "Web, Windows, macOS, Linux, iOS, Android",
              "applicationCategory": "ProductivityApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
              },
              "author": {
                "@type": "Person",
                "name": "Shyam Sundar",
                "url": "https://github.com/Shyamsundar2203",
              },
              "description":
                "AI-powered sovereign personal Mission Control Operating System for managing career, AI skills, health, finance, and long-term mission goals.",
            }),
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
