import { auth } from "@/auth";
import CmsSidebar from "@/components/cms/CmsSidebar";
import UserRegistrationForm from "@/components/cms/UserRegistrationForm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Daftarkan Akun | CMS Sebisa Project",
};

export default async function CmsUsersPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/cms");

  return (
    <div className="min-h-screen bg-brand-surface text-deep-navy">
      <CmsSidebar />
      <main className="min-h-screen lg:pl-72">
        <div className="brand-top-line h-2" />
        <div className="mx-auto max-w-[1000px] px-5 pb-12 pt-20 sm:px-8 lg:px-10 lg:pt-10">
          <header className="border-b-2 border-deep-navy/10 pb-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Akses pengguna</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Daftarkan akun</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Buat akun Admin untuk membantu mengelola CMS. Admin dapat mengelola workspace, tetapi tidak dapat mendaftarkan akun baru.</p>
          </header>
          <section className="mt-8 max-w-2xl rounded-2xl border border-deep-navy/10 bg-white p-5 shadow-[0_12px_28px_rgb(23_36_61_/_8%)] sm:p-8" aria-labelledby="user-registration-title">
            <div className="mb-6 border-b border-deep-navy/10 pb-5"><h2 id="user-registration-title" className="text-2xl font-black">Akun CMS baru</h2><p className="mt-2 text-sm leading-6 text-slate-600">Role yang tersedia saat ini adalah Admin. Pilihan role lain dapat ditambahkan kemudian tanpa mengubah alur form.</p></div>
            <UserRegistrationForm />
          </section>
        </div>
      </main>
    </div>
  );
}