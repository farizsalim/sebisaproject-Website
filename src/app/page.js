import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ConsultationSection from "@/components/ConsultationSection";
import ServicesSection from "@/components/ServicesSection";
import ClientsSection from "@/components/ClientsSection";
import AboutSection from "@/components/AboutSection";
import CaseStudySection from "@/components/CaseStudySection";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <Navbar />
      <Hero />
      <ConsultationSection />
      <ServicesSection />
      <ClientsSection />
      <AboutSection />
      <CaseStudySection />
    </div>
  );
}
