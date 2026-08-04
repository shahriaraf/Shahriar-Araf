import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { instrumentSerif, inter, jetbrainsMono } from "./fonts";

export const metadata: Metadata = {
  title: "Shahriar Araf | Full Stack Developer",
  description: "Full Stack Developer — React, Next.js, Node.js, MongoDB",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans bg-black text-white antialiased`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
