import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rayoy — AI Cycle Intelligence System",
  description:
    "Rayoy analyzes your personal and business cycle to help you decide when to expand, pause, or pivot. Strategy is timing.",
  keywords: [
    "cycle intelligence",
    "strategic timing",
    "business cycle analysis",
    "decision support",
    "AI strategy",
  ],
  openGraph: {
    title: "Rayoy — AI Cycle Intelligence System",
    description:
      "Analyze your personal and business cycle. Know when to expand, pause, or pivot.",
    type: "website",
    siteName: "Rayoy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rayoy — AI Cycle Intelligence System",
    description:
      "Analyze your personal and business cycle. Know when to expand, pause, or pivot.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
