import { auth } from "@/auth";
import CmsSidebar from "@/components/cms/CmsSidebar";
import CouponManager from "@/components/cms/CouponManager";
import { redirect } from "next/navigation";

export const metadata = { title: "Kupon | CMS Sebisa Project" };

export default async function CouponsPage() {
  if (!await auth()) redirect("/login");
  return <div className="min-h-screen bg-brand-surface text-deep-navy"><CmsSidebar /><main className="min-h-screen lg:pl-72"><div className="brand-top-line h-2" /><div className="mx-auto max-w-[1440px] px-5 pb-12 pt-20 sm:px-8 lg:px-10 lg:pt-10"><CouponManager /></div></main></div>;
}
