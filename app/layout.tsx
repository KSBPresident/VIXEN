import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VIXEN — Control Your Power",
    template: "%s | VIXEN",
  },
  description:
    "A creator-first platform built around your content, your rules, and your empire.",
  applicationName: "VIXEN",
  icons: { icon: "/assets/vixen-mark-3d.png", apple: "/assets/vixen-mark-3d.png" },
  openGraph: {
    title: "VIXEN — Control Your Power",
    description: "The next evolution of creator platforms.",
    type: "website",
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
