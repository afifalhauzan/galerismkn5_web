import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import SWRProvider from "@/providers/SWRProvider";
import ProgressProviders from '@/app/bprogress';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Galeri SMKN 5",
  description: "Sistem Galeri Digital SMKN 5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProgressProviders>
          <SWRProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </SWRProvider>
        </ProgressProviders>
      </body>
    </html>
  );
}
