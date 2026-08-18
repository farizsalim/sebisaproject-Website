import { auth } from "@/auth";
import RegisterForm from "@/components/cms/RegisterForm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Register CMS | Sebisa Project",
};

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect("/cms");

  return (
    <main className="brand-footer-gradient relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-12">
      <div className="brand-top-line absolute left-0 right-0 top-0 h-2" />
      <div className="pointer-events-none absolute -right-24 top-20 h-64 w-64 border-[28px] border-hot-pink/80 sm:-right-16 sm:h-80 sm:w-80" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 border-[32px] border-brand-blue/70" />

      <section className="relative grid w-full max-w-5xl border-2 border-white/20 bg-brand-surface shadow-[8px_8px_0_var(--brand-hot-pink)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="brand-about-gradient flex flex-col justify-between border-b-2 border-deep-navy/10 p-7 sm:p-10 lg:border-b-0 lg:border-r-2 lg:p-12">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-deep-navy">
              Sebisa Project
            </p>
            <h1 className="mt-5 max-w-sm text-4xl font-black leading-[0.98] text-deep-navy sm:text-5xl">
              Mulai mengelola ruang digitalmu.
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-600">
              Buat akun CMS untuk membantu tim menjaga konten website tetap rapi, segar, dan siap berkembang.
            </p>
          </div>
          <div className="mt-10 flex items-center gap-3 text-xs font-black uppercase tracking-[0.14em] text-deep-navy">
            <span className="h-3 w-3 bg-orange" />
            Content management system
          </div>
        </div>

        <div className="bg-white p-7 sm:p-10 lg:p-12">
          <div className="mb-8">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-brand-blue">
              Buat akun baru
            </p>
            <h2 className="text-3xl font-black tracking-tight text-deep-navy">
              Register CMS
            </h2>
            <p className="mt-2 text-sm leading-6 text-brand-muted">
              Isi data berikut untuk membuat akun pengguna.
            </p>
          </div>

          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
