import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TeamDirectory from "@/components/TeamDirectory";
import { getTeams } from "@/lib/content/siteContent";

export const metadata = {
  title: "Our Team | Sebisa Project",
  description:
    "Kenali tim Sebisa Project yang bekerja di balik setiap strategi dan karya digital.",
};

export default async function OurTeamPage() {
  const teams = await getTeams();
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f4ee]">
      <Navbar />
      <main>
        <section
          className="relative overflow-hidden bg-deep-navy bg-cover bg-center px-4 py-14 text-white [content-visibility:auto] [contain-intrinsic-size:560px] sm:px-6 sm:py-24 lg:px-8"
          style={{ backgroundImage: "url('/images/Portofolio.png')" }}
        >
          <div className="brand-photo-overlay absolute inset-0" />
          <div className="relative z-10 mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <p className="mb-5 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.24em] text-orange sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-orange" />
                Sebisa Project / People
              </p>
              <h1 className="max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight text-white [text-shadow:3px_3px_0_var(--brand-deep-navy)] sm:text-6xl lg:text-[76px]">
                Ide besar lahir dari tim yang seirama.
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
                Kenali orang-orang yang menyatukan strategi, kreativitas, dan eksekusi untuk membuat setiap karya Sebisa Project terasa berarti.
              </p>
            </div>
            <div className="border-l-2 border-orange/80 pl-5 lg:mb-2">
              <p className="text-5xl font-black leading-none text-orange sm:text-6xl">
                {teams.reduce((total, team) => total + team.members.length, 0)}+
              </p>
              <p className="mt-3 max-w-xs text-sm font-bold uppercase leading-5 tracking-[0.12em] text-white/75">
                talenta dengan perspektif yang saling melengkapi
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#f6f4ee] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 border-l border-b border-orange/30" />
          <div className="mx-auto max-w-[1240px]">
            <TeamDirectory initialTeams={teams} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
