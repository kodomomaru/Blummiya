import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blummiya — Grow forward. Light the way.",
  description: "A living life skill pathway that chronicles and reveals hidden skills from everyday work and life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080c14] text-slate-100 min-h-screen antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}

