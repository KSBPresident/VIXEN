import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = new URL("https://vixen-production-package.vercel.app");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "VIXEN — Creator & Member App",
    template: "%s | VIXEN",
  },
  description:
    "VIXEN is a Caribbean-first creator and member web app. Free account access is live; paid memberships, publishing, messaging, and paid video sessions remain in preview.",
  applicationName: "VIXEN",
  authors: [{ name: "Verified Interactive Xperience & Entertainment Network" }],
  icons: { icon: "/assets/vixen-mark-3d.png", apple: "/assets/vixen-mark-3d.png" },
  openGraph: {
    title: "VIXEN — Creator & Member App",
    description:
      "Explore the VIXEN member and creator app. Account signup is live; paid creator services are still in preview.",
    siteName: "VIXEN",
    type: "website",
    url: siteUrl,
  },
  twitter: {
    card: "summary",
    title: "VIXEN — Creator & Member App",
    description:
      "Explore the VIXEN member and creator app. Account signup is live; paid creator services are still in preview.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080609",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
