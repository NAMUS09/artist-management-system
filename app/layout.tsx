import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import TanStackProvider from "./context/QueryClient";
import ToasterContext from "./context/ToasterContext";
import UserContext from "./context/UserContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Artist Management System",
  description: "Artist management system for artists",
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
        <TanStackProvider>
          <UserContext>{children}</UserContext>

          <ToasterContext />
        </TanStackProvider>
      </body>
    </html>
  );
}
