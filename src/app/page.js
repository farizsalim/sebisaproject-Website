import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import IntroVideoSection from "@/components/IntroVideoSection";
import ConsultationSection from "@/components/ConsultationSection";
import ServicesSection from "@/components/ServicesSection";
import ClientsSection from "@/components/ClientsSection";
import AboutSection from "@/components/AboutSection";
import CaseStudySection from "@/components/CaseStudySection";
import BehindScenesSection from "@/components/BehindScenesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";
import { getBehindScenes, getCaseStudies, getClients, getServices, getSiteContent, getTeams, getTestimonials } from "@/lib/content/siteContent";
import { getPublishedQuiz } from "@/lib/quiz/quizController";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [content, quiz, services, clients, caseStudies, behindScenes, teams, testimonials] = await Promise.all([
    getSiteContent([
    "hero",
    "navbar",
    "about",
    "faq",
    "footer",
    "clients",
    "finalCta",
    ]),
    getPublishedQuiz(),
    getServices(),
    getClients(),
    getCaseStudies(),
    getBehindScenes(),
    getTeams(),
    getTestimonials(),
  ]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <Navbar content={content.navbar} />
      <Hero content={content.hero} />
      <IntroVideoSection />
      <ConsultationSection content={quiz} whatsappUrl={content.footer?.socialLinks?.whatsapp} />
      <ServicesSection content={services} />
      <ClientsSection content={content.clients} clients={clients} />
      <CaseStudySection caseStudies={caseStudies} />
      <BehindScenesSection behindScenes={behindScenes} />
      <TestimonialsSection testimonials={testimonials} />
      <AboutSection content={content.about} teams={teams} />
      <FaqSection content={content.faq} />
      <FinalCtaSection content={content.finalCta} />
      <Footer content={content.footer} />
    </div>
  );
}
