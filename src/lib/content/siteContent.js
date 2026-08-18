import { prisma } from "@/lib/prisma";
import fallbackServices from "../../../public/data/services.json";

const fallbackContent = {
  hero: {
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
  navbar: {
    links: ["Beranda", "Tentang Kami", "Layanan", "Mitra", "Kisah", "Our Teams"],
    consultationCta: "Mulai Konsultasi",
    flashSale: "Flash Sale",
    tickerItems: [
      "Gratis konsultasi awal untuk ide bisnis kamu",
      "Bangun brand yang siap melangkah lebih jauh",
    ],
    slotCta: "Ambil Slot",
  },
  about: {
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
  faq: {
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
  footer: {
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
  clients: {
    eyebrow: "Mitra Sebisa Project",
    titleBeforeHighlight: "Mereka yang pernah",
    titleHighlight: "bertumbuh",
    titleAfterHighlight: "bersama kami.",
    description: "Setiap logo membawa cerita, kebutuhan, dan tantangan yang kami bantu kerjakan bersama.",
  },
  finalCta: {
    eyebrow: "Langkah berikutnya",
    titleBeforeHighlight: "Siap",
    titleHighlight: "mulai",
    titleAfterHighlight: "langkah digital pertamamu?",
    description: "Ceritakan kebutuhanmu. Kami bantu menerjemahkan ide menjadi langkah yang lebih jelas dan bisa dikerjakan.",
    button: "Konsultasi Sekarang",
  },
};

const fallbackClients = [
  "kz6ioaghyw3kmkvwz7yk.png",
  "maikqfdco0mdqzdes9rk.png",
  "nmbmqpznqsnxkomctlcq.png",
  "nw93zb4qxwurzf7ft3xh.png",
  "os8tcp9nik7wsad6ue14.png",
  "oxxaqqf8bnu3fsesyaik.png",
  "qji75vzy0hugwukj6pqk.png",
  "qufzwby9ewkq3wxg4spa.png",
  "rukhngiy5u7svcw7mrw5.png",
  "tkhe4seypxp6rnfhzevq.png",
  "udm67fgb1gepoojgoaaw.png",
  "xfzma5xqnnbx5xhfjszd.png",
  "xwebvnwgflzm1gcmlhek.png",
  "yemqrqcwtcoxyxytubtv.png",
  "zjraydlxceah8cbwedzd.png",
].map((filename, sortOrder) => ({
  id: `fallback-client-${sortOrder}`,
  name: `Mitra ${sortOrder + 1}`,
  logoPath: `/Client/${filename}`,
  isPublished: true,
  sortOrder,
}));

export async function getSiteContent(contentKeys) {
  const content = Object.fromEntries(
    contentKeys.map((contentKey) => [contentKey, fallbackContent[contentKey]]),
  );

  try {
    const rows = await prisma.siteContent.findMany({
      where: { contentKey: { in: contentKeys }, isPublished: true },
      select: { contentKey: true, value: true },
    });

    for (const row of rows) content[row.contentKey] = row.value;
  } catch {
    return content;
  }

  return content;
}

export async function getServices() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        services: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    });

    if (categories.length === 0) return fallbackServices;

    return categories.map((category) => ({
      id: category.id,
      category: category.category,
      icon: category.icon,
      services: category.services.map((service) => ({
        name: service.name,
        originalPrice: service.originalPrice,
        price: service.price,
        duration: service.duration,
        description: service.description,
        benefits: service.benefits,
        isRecommended: service.isRecommended,
        flashSale: service.flashSale,
        discount: service.discount,
        flashSaleEndsAt: service.flashSaleEndsAt?.toISOString() || null,
      })),
    }));
  } catch {
    return fallbackServices;
  }
}

export async function getClients() {
  try {
    const clients = await prisma.client.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: { id: true, name: true, logoPath: true, websiteUrl: true, sortOrder: true },
    });
    return clients.length > 0 ? clients : fallbackClients;
  } catch {
    return fallbackClients;
  }
}
