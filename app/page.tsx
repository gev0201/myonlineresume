import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import SignupCTA from "@/components/sections/SignupCTA";
import Features from "@/components/sections/Features";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SignupCTA />
        <Features />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
