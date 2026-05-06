import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import StockTicker from "@/components/landing/StockTicker";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Trust from "@/components/landing/Trust";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <StockTicker />
      <Features />
      <HowItWorks />
      <Pricing />
      <Trust />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
