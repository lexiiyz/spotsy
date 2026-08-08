import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Spotsy — Temukan Sudut Tenang untuk Nugas & Bersantai",
  description: "Cari kafe, warkop, dan ruang kerja dengan suasana tenang, ketersediaan colokan, dan rute perjalanan yang nyaman.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} font-sans h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-900 text-stone-100 font-sans">
        {children}
      </body>
    </html>
  );
}
