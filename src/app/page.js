import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ConsultationSection from "@/components/ConsultationSection";
import ServicesSection from "@/components/ServicesSection";
import ClientsSection from "@/components/ClientsSection";
import AboutSection from "@/components/AboutSection";
import CaseStudySection from "@/components/CaseStudySection";
import FaqSection from "@/components/FaqSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";
import { getClients, getServices, getSiteContent } from "@/lib/content/siteContent";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [content, services, clients] = await Promise.all([
    getSiteContent([
    "hero",
    "navbar",
    "about",
    "faq",
    "footer",
    "clients",
    "finalCta",
    ]),
    getServices(),
    getClients(),
  ]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <Navbar content={content.navbar} />
      <Hero content={content.hero} />
      <ConsultationSection />
      <ServicesSection content={services} />
      <ClientsSection content={content.clients} clients={clients} />
      <CaseStudySection />
      <AboutSection content={content.about} />
      <FaqSection content={content.faq} />
      <FinalCtaSection content={content.finalCta} />
      <Footer content={content.footer} />
    </div>
  );
}
