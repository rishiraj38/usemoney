import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UseMoney — AI-Powered Trading for Indian Markets",
  description:
    "Unify every broker, chat with StockSage AI, paper-trade risk-free, and plan your FIRE journey. Built for Indian traders.",
  keywords: [
    "AI trading",
    "portfolio management",
    "paper trading",
    "Indian stock market",
    "Zerodha",
    "Groww",
    "Angel One",
    "StockSage",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
