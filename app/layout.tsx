import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = new URL("https://vixen-production-package.vercel.app");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "VIXEN — Control Your Power",
    template: "%s | VIXEN",
  },
  description:
    "Explore the public VIXEN web app preview. Browse sample creator profiles and example memberships. Paid content, creator publishing, messages, and checkout are not active.",
  applicationName: "VIXEN",
  authors: [{ name: "Verified Interactive Xperience & Entertainment Network" }],
  icons: { icon: "/assets/vixen-mark-3d.png", apple: "/assets/vixen-mark-3d.png" },
  openGraph: {
    title: "VIXEN — Public Web App Preview",
    description:
      "Browse VIXEN sample creator profiles and example memberships. Paid content, creator publishing, messages, and checkout are not active.",
    siteName: "VIXEN",
    type: "website",
    url: siteUrl,
  },
  twitter: {
    card: "summary",
    title: "VIXEN — Public Web App Preview",
    description:
      "Explore sample creator profiles and example memberships. Paid content, creator publishing, messages, and checkout are not active.",
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
