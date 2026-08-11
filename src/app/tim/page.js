import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TeamDirectory from "@/components/TeamDirectory";

export const metadata = {
  title: "Our Team | Sebisa Project",
  description:
    "Kenali tim Sebisa Project yang bekerja di balik setiap strategi dan karya digital.",
};

export default function OurTeamPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#F4FBFE] [font-family:Arial,sans-serif]">
      <Navbar />
      <main>
        <section
          className="relative overflow-hidden bg-deep-navy bg-cover bg-center px-4 py-10 text-white [content-visibility:auto] [contain-intrinsic-size:520px] sm:px-6 sm:py-20 lg:px-8"
          style={{ backgroundImage: "url('/images/Portofolio.png')" }}
        >
          <div className="brand-photo-overlay absolute inset-0" />
          <div className="brand-top-line absolute inset-x-0 top-0 z-10 h-1" />
          <div className="relative z-10 mx-auto max-w-[1240px]">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-orange sm:text-sm">
              Our Team
            </p>
            <h1 className="max-w-3xl text-3xl font-black uppercase leading-[1.02] tracking-tight text-white [text-shadow:3px_3px_0_var(--brand-deep-navy)] sm:text-5xl lg:text-[52px]">
              Orang-orang di balik ide yang menjadi nyata.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
              Setiap strategi, karya, dan proses di Sebisa Project digerakkan oleh tim dengan peran yang saling melengkapi.
            </p>
          </div>
        </section>

        <section className="brand-light-gradient px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-[1240px]">
            <TeamDirectory />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
