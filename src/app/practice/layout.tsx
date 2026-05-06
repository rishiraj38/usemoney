import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Practice Trading | UseMoney AI",
  description:
    "Paper-trade with live market data. Track your practice portfolio, analyze performance, and improve your trading strategy with AI-powered insights.",
};

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 100, minHeight: "100vh" }}>{children}</main>
      <Footer />
    </>
  );
}
