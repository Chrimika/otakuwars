import type { Metadata } from "next";
import { Geist, Geist_Mono, Anton, Rajdhani } from "next/font/google";
import { AppShell } from "../components/AppShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Otaku Wars - Quiz Multijoueur Otaku en Direct",
  description: "Rejoignez l'arène ultime des passionnés d'animes ! Salons multijoueurs, compte à rebours 10s, avatars otaku et synchronisation Firebase en direct.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${rajdhani.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050507] text-slate-100">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
