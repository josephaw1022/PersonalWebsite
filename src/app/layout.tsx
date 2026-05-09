import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import DatadogInit from "@/components/DatadogInit";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Joseph Whiteaker – Cloud-Native Engineer",
  description:
    "Portfolio of Joseph Whiteaker, a Platform Engineer specializing in Kubernetes and Cloud-Native Technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col relative selection:bg-indigo-500/30">
        <DatadogInit />
        
        {/* Background glow effects for premium look */}
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />

        <Header />
        
        <main className="flex-grow z-10">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
