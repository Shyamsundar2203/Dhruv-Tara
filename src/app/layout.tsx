import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Operation Dhruv Tara | Mission Control OS",
  description:
    "A sovereign AI-powered personal Mission Control Operating System. Manage every aspect of life, learning, career, health, finance, and mission from one futuristic dashboard.",
  keywords: [
    "mission control",
    "personal os",
    "productivity",
    "ai assistant",
    "life dashboard",
    "dhruv tara",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ODT",
  },
};

export const viewport: Viewport = {
  themeColor: "#040408",
  width: "device-width",
  initialScale: 1,
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
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
