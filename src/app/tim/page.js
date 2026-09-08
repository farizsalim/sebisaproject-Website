import Image from "next/image";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TeamDirectory from "@/components/TeamDirectory";
import FaqSection from "@/components/FaqSection";
import { getTeams } from "@/lib/content/siteContent";

export const metadata = {
  title: "Our Team | Sebisa Project",
  description:
    "Kenali tim Sebisa Project yang bekerja di balik setiap strategi dan karya digital.",
};

export default async function OurTeamPage() {
  const teams = await getTeams();
  const leadershipTeam = teams.find((team) => team.name.toLowerCase().includes("leadership"));
  const leaderMembers = leadershipTeam?.members || [];

  const values = [
    ["01", "Kolaborasi", "Kami percaya ide terbaik lahir dari tim yang saling mendengar dan terbuka."],
    ["02", "Strategi", "Setiap langkah dimulai dari tujuan yang jelas, bukan sekadar mengikuti tren."],
    ["03", "Kreativitas", "Kami mencari cara baru untuk membuat pesan terasa relevan dan berkesan."],
    ["04", "Eksekusi", "Ide menjadi berarti ketika dikerjakan dengan rapi, konsisten, dan terukur."],
  ];

  const processSteps = [
    ["01", "Diskusi & riset", "Memahami kebutuhan dan tantanganmu."],
    ["02", "Strategi & perencanaan", "Menyusun pendekatan terbaik bersama."],
    ["03", "Eksekusi kolaboratif", "Tim kami bekerja dengan sprint yang terukur."],
    ["04", "Hasil & dampak", "Solusi yang siap memberi perubahan nyata."],
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f4ee]">
      <Navbar />
      <main>
        <section
          className="relative overflow-hidden bg-deep-navy bg-cover bg-center px-4 py-16 text-white [content-visibility:auto] [contain-intrinsic-size:560px] sm:px-6 sm:py-24 lg:px-8"
          style={{ backgroundImage: "url('/images/Portofolio.png')" }}
        >
          <div className="brand-photo-overlay absolute inset-0" />
          <div className="relative z-10 mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
            <div>
              <p className="mb-6 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.24em] text-orange sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-orange" />
                Our team / Sebisa Project
              </p>
              <h1 className="max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.055em] text-white sm:text-7xl lg:text-[92px]">
                Meet the
                <span className="block text-orange">people</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
                Strategi, kreativitas, dan eksekusi bertemu di sini. Kenali tim yang membuat setiap karya Sebisa Project bergerak.
              </p>
            </div>
            <div className="lg:mb-2">
              <p className="max-w-sm border-l-2 border-orange/80 pl-5 text-sm leading-6 text-white/70 sm:text-base">
                Satu studio, banyak perspektif, dan orang-orang dengan peran berbeda yang bekerja menuju arah yang sama.
              </p>
              <div className="mt-8 grid max-w-sm grid-cols-2 border-y border-white/15 py-5">
                <div>
                  <p className="text-4xl font-black leading-none text-orange sm:text-5xl">
                    {String(teams.reduce((total, team) => total + team.members.length, 0)).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-[9px] font-black uppercase tracking-[0.16em] text-white/45">People</p>
                </div>
                <div className="border-l border-white/15 pl-5">
                  <p className="text-4xl font-black leading-none text-white sm:text-5xl">
                    {String(teams.length).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-[9px] font-black uppercase tracking-[0.16em] text-white/45">Studio units</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white px-4 pb-6 pt-20 sm:px-6 sm:pb-8 sm:pt-28 lg:px-8 lg:pb-10 lg:pt-32">
          <div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-orange sm:text-sm">Tentang tim kami</p>
              <h2 className="mt-3 max-w-xl text-4xl font-black uppercase leading-[0.94] tracking-[-0.045em] text-deep-navy sm:text-6xl">
                Tim yang membantu <span className="text-brand-blue">idemu bertumbuh.</span>
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-brand-muted sm:text-base">
              Di Sebisa Project, kami percaya bahwa hasil luar biasa lahir dari orang-orang yang luar biasa. Tim kami terdiri dari individu dengan latar belakang yang beragam, namun memiliki satu tujuan yang sama: membantu setiap ide menjadi solusi nyata.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-[1140px] grid-cols-2 overflow-hidden rounded-2xl bg-deep-navy text-white shadow-[0_18px_40px_rgb(23_36_61_/_18%)] sm:grid-cols-3">
            {[
              ["12+", "Spesialis berbagai bidang"],
              ["100+", "Proyek ditangani"],
              ["98%", "Klien puas dengan hasil kami"],
            ].map(([value, label]) => (
              <div key={label} className="border-white/15 px-5 py-6 first:border-l-0 sm:border-l sm:px-6">
                <p className="text-3xl font-black text-orange sm:text-4xl">{value}</p>
                <p className="mt-2 text-[10px] font-bold leading-4 text-white/60">{label}</p>
              </div>
            ))}
          </div>

          <TeamDirectory initialTeams={teams} />
        </section>

        {leaderMembers.length > 0 ? (
          <section className="bg-deep-navy px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
            <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-orange sm:text-sm">Our leadership</p>
                <h2 className="mt-3 max-w-xl text-4xl font-black uppercase leading-[0.94] tracking-[-0.045em] sm:text-6xl">
                  Memandu arah, <span className="text-brand-blue-light">menginspirasi pertumbuhan.</span>
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-base">Dipimpin oleh individu berpengalaman yang percaya pada kolaborasi, integritas, dan dampak jangka panjang.</p>
                <a href="#gabung" className="mt-7 inline-flex rounded-full bg-orange px-6 py-3 text-xs font-black uppercase tracking-[0.1em] text-deep-navy transition hover:-translate-y-1 hover:bg-white">Kenali kepemimpinan kami</a>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {leaderMembers.map((member, index) => (
                  <article key={member.name} className="overflow-hidden rounded-xl bg-white text-deep-navy">
                    <div className="relative aspect-square bg-brand-panel">
                      {member.image ? <Image src={member.image} alt={`Foto ${member.name}`} fill sizes="(max-width: 640px) 90vw, 360px" className="object-cover" /> : <div className="flex h-full items-center justify-center text-5xl font-black text-brand-blue">{member.name.slice(0, 1)}</div>}
                      <span className="absolute bottom-3 left-3 rounded-full bg-orange px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em]">{index === 0 ? "Founder" : "Co-founder"}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-black leading-tight">{member.name}</h3>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-hot-pink">{member.role}</p>
                      {member.description ? <p className="mt-3 text-xs leading-5 text-brand-muted">{member.description}</p> : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-orange sm:text-sm">Nilai kami</p>
              <h2 className="mt-3 max-w-md text-4xl font-black uppercase leading-[0.94] tracking-[-0.045em] text-deep-navy sm:text-6xl">Hal yang <span className="text-brand-blue">kami yakini.</span></h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-brand-muted sm:text-base">Nilai-nilai ini menjadi dasar cara kami bekerja, berkolaborasi, dan memberikan hasil terbaik untuk setiap klien.</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-[1140px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(([number, title, description]) => <article key={title} className="rounded-2xl border border-white/15 bg-deep-navy p-5 transition hover:-translate-y-1 hover:border-orange"><span className="text-3xl font-black text-orange">{number}</span><h3 className="mt-5 text-xl font-black text-white">{title}</h3><p className="mt-2 text-xs leading-5 text-white/65">{description}</p></article>)}
          </div>
        </section>

        <section className="bg-deep-navy px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-16">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-orange sm:text-sm">Cara kami bekerja</p>
              <h2 className="mt-3 max-w-md text-4xl font-black uppercase leading-[0.94] tracking-[-0.045em] sm:text-6xl">Dari diskusi <span className="text-brand-blue-light">hingga dampak nyata.</span></h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/65 sm:text-base">Kami bekerja secara terstruktur namun tetap fleksibel, dengan melibatkan berbagai peran dalam tim untuk memastikan hasil terbaik di setiap tahap.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {processSteps.map(([number, title, description]) => <article key={number} className="rounded-2xl bg-white p-5 text-deep-navy transition hover:-translate-y-1 hover:bg-brand-surface-blue"><span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue text-xs font-black text-white">{number}</span><h3 className="mt-4 text-lg font-black">{title}</h3><p className="mt-2 text-xs leading-5 text-brand-muted">{description}</p></article>)}
            </div>
          </div>
        </section>

        <section id="gabung" className="relative overflow-hidden bg-brand-surface-blue px-4 py-14 sm:px-6 sm:py-20 lg:px-8"><div className="mx-auto grid max-w-[1240px] items-center gap-8 lg:grid-cols-[1fr_1fr]"><div className="relative min-h-[240px] overflow-hidden rounded-2xl bg-brand-panel"><Image src="/images/Portofolio.png" alt="Tim Sebisa Project sedang berdiskusi" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /><div className="absolute inset-0 flex items-center justify-center"><Image src="/images/logo-sebisa-project.png" alt="Logo Sebisa Project" width={320} height={195} className="h-auto w-64 object-contain sm:w-80" style={{ height: "auto" }} /></div></div><div><p className="text-xs font-black uppercase tracking-[0.24em] text-orange sm:text-sm">Gabung dengan kami</p><h2 className="mt-3 text-4xl font-black uppercase leading-[0.94] tracking-[-0.045em] text-deep-navy sm:text-6xl">Tumbuh bersama <span className="text-brand-blue">Sebisa Project.</span></h2><p className="mt-5 max-w-lg text-sm leading-7 text-brand-muted">Kami selalu terbuka untuk talenta hebat yang ingin membuat dampak nyata. Mari berkarya bersama.</p><a href="mailto:hello@sebisaproject.id" className="mt-7 inline-flex rounded-full bg-orange px-6 py-3 text-xs font-black uppercase tracking-[0.1em] text-deep-navy transition hover:-translate-y-1 hover:bg-deep-navy hover:text-white">Lihat lowongan</a></div></div></section>

        <FaqSection content={{ eyebrow: "Pertanyaan umum", title: "Pertanyaan seputar tim kami.", intro: "Beberapa hal yang sering ingin diketahui sebelum bergabung atau bekerja bersama Sebisa Project.", items: [{ question: "Bagaimana cara bergabung dengan Sebisa Project?", answer: "Kirimkan portofolio dan cerita singkat tentang dirimu melalui email kami. Tim kami akan menghubungi kamu jika ada kesempatan yang sesuai." }, { question: "Apakah ada program magang?", answer: "Kami membuka kesempatan kolaborasi dan magang sesuai kebutuhan tim. Sertakan bidang yang ingin kamu pelajari saat menghubungi kami." }, { question: "Di bidang apa saja tim Sebisa Project bekerja?", answer: "Kami bekerja di bidang strategi, branding, desain, konten, social media, digital marketing, dan pengembangan website." }] }} />
      </main>
      <Footer />
    </div>
  );
}
