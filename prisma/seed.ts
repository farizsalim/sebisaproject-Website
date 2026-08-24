import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/lib/auth/password";
import servicesSeed from "../public/data/services.json";

const databaseUrl = process.env.DATABASE_URL;
const superAdminPassword = process.env.SEED_SUPERADMIN_PASSWORD;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

if (!superAdminPassword) {
  throw new Error("SEED_SUPERADMIN_PASSWORD is not configured");
}

const connectionUrl = new URL(databaseUrl);
const adapter = new PrismaMariaDb({
  host: connectionUrl.hostname,
  port: Number(connectionUrl.port || 3306),
  user: decodeURIComponent(connectionUrl.username),
  password: decodeURIComponent(connectionUrl.password),
  database: connectionUrl.pathname.slice(1),
});

const siteContentSeed = [
  {
    contentKey: "hero",
    value: {
      headingSegments: [
        { text: "Punya", spaceAfter: true, highlight: false },
        { text: "Ide Digital", spaceAfter: false, highlight: true },
        { text: "?", spaceAfter: true, highlight: false },
        { text: "Tapi", spaceAfter: true, highlight: false },
        { text: "Bingung", spaceAfter: true, highlight: false },
        { text: "Untuk", spaceAfter: true, highlight: false },
        { text: "Memulainya?", spaceAfter: false, highlight: false },
      ],
      primaryCta: "Ayo Kita Mulai !",
      secondaryCta: "Pilihan layanan",
    },
  },
  {
    contentKey: "navbar",
    value: {
      links: ["Beranda", "Tentang Kami", "Layanan", "Mitra", "Kisah", "Our Teams"],
      consultationCta: "Mulai Konsultasi",
      flashSale: "Flash Sale",
      tickerItems: [
        "Gratis konsultasi awal untuk ide bisnis kamu",
        "Bangun brand yang siap melangkah lebih jauh",
      ],
      slotCta: "Ambil Slot",
    },
  },
  {
    contentKey: "consultationQuiz",
    value: {
      eyebrow: "Konsultasi singkat",
      questions: [
        { title: "Apa yang ingin kamu kembangkan?", options: ["Bisnis atau UMKM", "Brand", "Personal brand", "Event atau campaign"] },
        { title: "Untuk bisnis atau UMKM, apa fokus utamamu?", options: ["Merapikan brand", "Mendapatkan pelanggan", "Membuat konten rutin", "Membangun sistem bisnis"] },
        { title: "Untuk brand, apa yang ingin diperkuat?", options: ["Identitas visual", "Kampanye promosi", "Konten media sosial", "Jangkauan audiens"] },
        { title: "Untuk personal brand, apa targetmu?", options: ["Membangun kredibilitas", "Meningkatkan engagement", "Membuat konten", "Menjual produk atau jasa"] },
        { title: "Untuk event atau campaign, apa yang paling dibutuhkan?", options: ["Konsep kreatif", "Promosi digital", "Produksi konten", "Landing page event"] },
        { title: "Kapan kamu ingin mulai?", options: ["Secepatnya", "Dalam 1-2 minggu", "Bulan ini", "Masih eksplorasi"] },
        { title: "Apa hasil yang paling ingin kamu capai?", options: ["Konten konsisten", "Brand terlihat profesional", "Lebih banyak pelanggan", "Website atau landing page siap"] },
      ],
      recommendations: {
        "Social Media Management": ["Social Media Management", "Content Production"],
        "Content Production": ["Content Production", "Social Media Management"],
        "Digital Ads": ["Digital Ads", "Content Production"],
        "Website atau Landing Page": ["Paket Website", "Paket Landing Page"],
        "Marketplace & Merchandise": ["Marketplace & Merchandise", "Content Production"],
      },
      scoringRules: {
        "Bisnis atau UMKM": { "Social Media Jalan Terus": 2, "Paket Website": 1 },
        Brand: { "Design Graphic Set A": 2, "Paket Kreator": 1 },
        "Personal brand": { "Paket Kreator": 2, "Social Media Jalan Terus": 1 },
        "Event atau campaign": { "Paket Kreator": 2, "Paket Landing Page": 2 },
        "Merapikan brand": { "Design Graphic Set A": 3 },
        "Mendapatkan pelanggan": { "Paket Sosmed": 2, "Social Media Jalan Terus": 2 },
        "Membuat konten rutin": { "Paket Konten Terima Beres": 3, "Paket Kreator": 2 },
        "Membangun sistem bisnis": { "Paket Website": 3 },
        "Identitas visual": { "Design Graphic Set A": 3 },
        "Kampanye promosi": { "Paket Kreator": 2, "Paket Landing Page": 1 },
        "Konten media sosial": { "Social Media Jalan Terus": 3, "Paket Kreator": 2 },
        "Jangkauan audiens": { "Paket Sosmed": 3 },
        "Membangun kredibilitas": { "Paket Website": 2, "Design Graphic Set A": 1 },
        "Meningkatkan engagement": { "Social Media Jalan Terus": 3 },
        "Membuat konten": { "Paket Kreator": 3 },
        "Menjual produk atau jasa": { "Paket Landing Page": 2, "Paket Website": 1 },
        "Konsep kreatif": { "Paket Kreator": 3 },
        "Promosi digital": { "Paket Sosmed": 2, "Paket Landing Page": 1 },
        "Produksi konten": { "Paket Kreator": 3 },
        "Landing page event": { "Paket Landing Page": 4 },
        "Konten konsisten": { "Paket Konten Terima Beres": 4, "Social Media Jalan Terus": 3, "Paket Kreator": 2 },
        "Brand terlihat profesional": { "Design Graphic Set A": 4, "Paket Kreator": 2 },
        "Lebih banyak pelanggan": { "Paket Sosmed": 4, "Social Media Jalan Terus": 2 },
        "Website atau landing page siap": { "Paket Website": 4, "Paket Landing Page": 4 },
        "Secepatnya": { "Social Media Jalan Terus": 1 },
        "Dalam 1-2 minggu": { "Paket Landing Page": 1 },
        "Bulan ini": { "Paket Kreator": 1 },
        "Social Media Management": { "Social Media Jalan Terus": 5 },
        "Content Production": { "Paket Kreator": 5 },
        "Digital Ads": { "Paket Sosmed": 5 },
        "Website atau Landing Page": { "Paket Website": 4, "Paket Landing Page": 4 },
        "Marketplace & Merchandise": { "Paket Kreator": 3, "Paket Website": 2 },
      },
      defaultRecommendations: ["Social Media Management", "Content Production"],
    },
  },
  {
    contentKey: "about",
    value: {
      eyebrow: "Tentang Kami",
      title: "Perusahaan Penyedia Jasa Digital Profesional Bergaransi",
      paragraphs: [
        "Sebisa Project adalah partner kreatif dan strategis untuk membantu bisnis, brand, dan personal brand tumbuh lebih kuat di era digital.",
      ],
      expandedParagraphs: [
        "Kami melayani kebutuhan B2B maupun B2C, mulai dari pengembangan branding, desain kreatif, produksi konten, pengelolaan social media, iklan digital, pembuatan website, hingga solusi bisnis yang disesuaikan dengan kebutuhan Anda.",
        "Dengan pendekatan profesional, fleksibel, dan berorientasi hasil, kami tidak hanya mengerjakan proyek, tetapi membangun hubungan kerja sama jangka panjang yang saling menguntungkan.",
      ],
      readMore: "Baca selengkapnya",
      readLess: "Sembunyikan",
      tagline: "Dari Ide Menjadi Realita, Dari Strategi Menjadi Hasil.",
    },
  },
  {
    contentKey: "faq",
    value: {
      eyebrow: "Pertanyaan umum",
      title: "Masih ada yang ingin kamu pastikan?",
      intro: "Kami buat jawabannya sesederhana mungkin supaya kamu bisa mulai dengan lebih tenang dan jelas.",
      items: [
        { question: "Bagaimana kalau hasilnya belum sesuai?", answer: "Kami menyamakan kebutuhan, ruang lingkup, dan arah visual sejak awal. Setiap layanan memiliki alur revisi dan titik review yang disepakati agar hasil dapat disempurnakan bersama." },
        { question: "Berapa lama proses pengerjaannya?", answer: "Durasi bergantung pada jenis layanan dan kompleksitas kebutuhan. Setelah konsultasi singkat, kami akan membantu memberikan gambaran timeline yang realistis." },
        { question: "Apakah bisa membuat paket custom?", answer: "Bisa. Layanan dapat disusun sesuai tujuan, prioritas, dan anggaran bisnis Anda, baik untuk kebutuhan satu kali maupun kerja sama berkelanjutan." },
        { question: "Apakah Sebisa Project melayani UMKM?", answer: "Tentu. Kami membantu bisnis dari berbagai skala menemukan kebutuhan digital yang paling penting untuk dikerjakan terlebih dahulu." },
        { question: "Apa arti layanan profesional bergaransi?", answer: "Garansi berarti kami berkomitmen pada kejelasan scope, komunikasi, dan proses review sesuai layanan yang disepakati. Detail cakupan garansi akan dijelaskan sebelum pekerjaan dimulai." },
      ],
    },
  },
  {
    contentKey: "footer",
    value: {
      description: "Partner kreatif dan strategis untuk membantu ide digital tumbuh menjadi hasil yang nyata.",
      navigationTitle: "Navigasi",
      navigationLinks: ["Tentang Kami", "Layanan", "Kisah"],
      contactTitle: "Hubungi kami",
      consultationCta: "Mulai dari konsultasi",
      socialLinks: {
        instagram: "https://www.instagram.com/sebisaproject/",
        linkedin: "https://www.linkedin.com/company/sebisa-project/",
        tiktok: "https://www.tiktok.com/@sebisaproject",
        whatsapp: "https://wa.me/6280000000000",
      },
    },
  },
  {
    contentKey: "clients",
    value: {
      eyebrow: "Mitra Sebisa Project",
      titleBeforeHighlight: "Mereka yang pernah",
      titleHighlight: "bertumbuh",
      titleAfterHighlight: "bersama kami.",
      description: "Setiap logo membawa cerita, kebutuhan, dan tantangan yang kami bantu kerjakan bersama.",
    },
  },
  {
    contentKey: "finalCta",
    value: {
      eyebrow: "Langkah berikutnya",
      titleBeforeHighlight: "Siap",
      titleHighlight: "mulai",
      titleAfterHighlight: "langkah digital pertamamu?",
      description: "Ceritakan kebutuhanmu. Kami bantu menerjemahkan ide menjadi langkah yang lebih jelas dan bisa dikerjakan.",
      button: "Konsultasi Sekarang",
    },
  },
];

const clientSeed = [
  ["PTC Pertamina Training & Consulting", "kz6ioaghyw3kmkvwz7yk.png"],
  ["Batik & Craft", "maikqfdco0mdqzdes9rk.png"],
  ["Semangat Sehat Nakalimo", "nmbmqpznqsnxkomctlcq.png"],
  ["Jakarta Garden City", "nw93zb4qxwurzf7ft3xh.png"],
  ["An Najah", "os8tcp9nik7wsad6ue14.png"],
  ["Nasi Liwet Lavanda", "oxxaqqf8bnu3fsesyaik.png"],
  ["Taman Herbal", "qji75vzy0hugwukj6pqk.png"],
  ["Sahabat Polisi Indonesia", "qufzwby9ewkq3wxg4spa.png"],
  ["Universitas Medika", "rukhngiy5u7svcw7mrw5.png"],
  ["GarlicGo", "tkhe4seypxp6rnfhzevq.png"],
  ["Bakso Ngamenin", "udm67fgb1gepoojgoaaw.png"],
  ["Kafe Kufe", "xfzma5xqnnbx5xhfjszd.png"],
  ["Al Hasan Travel Umroh", "xwebvnwgflzm1gcmlhek.png"],
  ["PT Bina Auto Solusi", "yemqrqcwtcoxyxytubtv.png"],
  ["Koperasi Sentra Kuliner Yasmin", "zjraydlxceah8cbwedzd.png"],
].map(([name, filename], sortOrder) => ({
  name,
  logoPath: `/Client/${filename}`,
  sortOrder,
  isPublished: true,
}));

async function main() {
  const prisma = new PrismaClient({ adapter });

  try {
    const passwordHash = await hashPassword(superAdminPassword);
    const user = await prisma.user.upsert({
      where: { email: "sebisaprojectcorporate@gmail.com" },
      update: {
        name: "Sebisa Project Superadmin",
        passwordHash,
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        emailVerified: new Date(),
      },
      create: {
        name: "Sebisa Project Superadmin",
        email: "sebisaprojectcorporate@gmail.com",
        passwordHash,
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        emailVerified: new Date(),
      },
      select: { id: true, email: true, role: true, status: true },
    });

    await prisma.$transaction(async (transaction) => {
      await transaction.service.deleteMany();
      await transaction.serviceCategory.deleteMany();

      for (const [categoryIndex, category] of servicesSeed.entries()) {
        await transaction.serviceCategory.create({
          data: {
            id: category.id,
            category: category.category,
            icon: category.icon,
            sortOrder: categoryIndex,
            services: {
              create: category.services.map((service, serviceIndex) => {
                const serviceData = service as typeof service & {
                  originalPrice?: string;
                  flashSale?: boolean;
                  discount?: number;
                  flashSaleEndsAt?: string | null;
                };

                return {
                  name: serviceData.name,
                  originalPrice: serviceData.originalPrice || "",
                  price: serviceData.price,
                  duration: serviceData.duration || "",
                  description: serviceData.description,
                  benefits: serviceData.description.split(",").map((benefit) => benefit.trim()).filter(Boolean),
                  isRecommended: serviceData.name.toLowerCase().includes("pro"),
                  flashSale: serviceData.flashSale || false,
                  discount: serviceData.discount || 0,
                  flashSaleEndsAt: serviceData.flashSaleEndsAt ? new Date(serviceData.flashSaleEndsAt) : null,
                  sortOrder: serviceIndex,
                };
              }),
            },
          },
        });
      }
    });

    await prisma.siteContent.deleteMany({ where: { contentKey: "services" } });

    for (const content of siteContentSeed) {
      await prisma.siteContent.upsert({
        where: { contentKey: content.contentKey },
        update: { value: content.value, isPublished: true },
        create: content,
      });
    }

    for (const client of clientSeed) {
      await prisma.client.upsert({
        where: { logoPath: client.logoPath },
        update: client,
        create: client,
      });
    }

    console.log(`Seeded superadmin: ${user.email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
