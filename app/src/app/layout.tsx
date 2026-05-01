import type { Metadata } from "next";
import { Archivo_Black, Work_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DemocrAI — Your Personal Election Co-Pilot",
  description: "AI-powered civic engagement platform. Navigate elections, understand candidates, and make informed voting decisions with DemocrAI — your nonpartisan election guide.",
  keywords: "election, voting, AI, civic, ballot, candidates, nonpartisan, democracy",
  openGraph: {
    title: "DemocrAI — Your Personal Election Co-Pilot",
    description: "AI-powered civic engagement platform that helps you vote informed.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivoBlack.variable} ${workSans.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
