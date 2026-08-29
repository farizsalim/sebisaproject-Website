import { prisma } from "@/lib/prisma";

export const fallbackContent = {
  caseStudies: [],
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
  consultationQuiz: {
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

function createDefaultQuizFlow(quizContent) {
  const questions = quizContent.questions.map((question, index) => ({
    id: `q${index + 1}`,
    type: "question",
    position: { x: index === 0 ? 80 : index === quizContent.questions.length - 1 ? 1120 : 420, y: index === 0 ? 360 : index === quizContent.questions.length - 1 ? 360 : 80 + (index - 1) * 145 },
    data: {
      title: question.title,
      options: question.options.map((label) => ({ label, target: null })),
    },
  }));
  const recommendationLabels = [...new Set(Object.values(quizContent.recommendations).flat())];
  const results = recommendationLabels.map((label, index) => ({
    id: `result-${index + 1}`,
    type: "result",
    position: { x: questions.length * 360, y: index * 140 },
    data: { label },
  }));
  const edges = [];
  const firstQuestion = questions[0];
  const outcomeQuestion = questions.find((question) => question.data.title.startsWith("Apa hasil"));
  const timingQuestion = questions.find((question) => question.data.title.startsWith("Kapan"));
  const branchQuestions = questions.filter((question) => question !== firstQuestion && question !== outcomeQuestion && question !== timingQuestion);

  function connectAll(source, target) {
    source?.data.options.forEach((option, index) => {
      option.target = target?.id || null;
      if (target) edges.push({ id: `${source.id}-${index}-${target.id}`, source: source.id, sourceHandle: `option-${index}`, target: target.id, type: "smoothstep", animated: true });
    });
  }

  firstQuestion?.data.options.forEach((option, index) => {
    const target = branchQuestions[index] || branchQuestions[0];
    option.target = target?.id || null;
    if (target) edges.push({ id: `${firstQuestion.id}-${index}-${target.id}`, source: firstQuestion.id, sourceHandle: `option-${index}`, target: target.id, type: "smoothstep", animated: true });
  });
  branchQuestions.forEach((question) => connectAll(question, outcomeQuestion));
  connectAll(outcomeQuestion, timingQuestion);
  timingQuestion?.data.options.forEach((option, index) => {
    const target = results[index % results.length];
    option.target = target?.id || null;
    if (target) edges.push({ id: `${timingQuestion.id}-${index}-${target.id}`, source: timingQuestion.id, sourceHandle: `option-${index}`, target: target.id, type: "smoothstep", animated: true });
  });

  return { version: 3, startId: firstQuestion?.id || null, nodes: [...questions, ...results], edges };
}

fallbackContent.consultationQuiz.flow = createDefaultQuizFlow(fallbackContent.consultationQuiz);

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
  logoPath: `/api/media/mitra/${filename}`,
  isPublished: true,
  sortOrder,
}));

export async function getSiteContent(contentKeys) {
  try {
    const rows = await prisma.siteContent.findMany({
      where: { contentKey: { in: contentKeys }, isPublished: true },
      select: { contentKey: true, value: true },
    });

    return Object.fromEntries(rows.map((row) => [row.contentKey, row.value]));
  } catch {
    return {};
  }
}

export async function getCaseStudies() {
  try {
    const projects = await prisma.portfolioProject.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        media: {
          where: { isPublished: true },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    });

    return projects.map((project) => ({
      id: project.slug,
      eyebrow: project.category || project.clientName,
      title: project.title,
      description: project.description,
      client: project.clientName,
      instagram: project.instagram,
      result: project.result,
      services: project.category ? [{ label: project.category, description: "", href: "" }] : [],
      media: project.media.map((media) => ({
        type: media.mediaType.toLowerCase(),
        channel: media.section === "BEHIND_SCENES" ? "Behind the scene" : "Portfolio",
        caption: media.caption,
        src: media.filePath,
        alt: media.altText,
        position: "center",
        href: "",
      })),
    }));
  } catch {
    return [];
  }
}

export async function getBehindScenes() {
  try {
    const items = await prisma.behindScene.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return items.map((item) => ({
      id: item.id,
      type: item.mediaType.toLowerCase(),
      caption: item.description,
      src: item.filePath,
      alt: item.altText || item.description,
    }));
  } catch {
    return [];
  }
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

    return categories.map((category) => ({
      id: category.id,
      category: category.category,
      icon: category.icon,
      services: category.services.map((service) => ({
        id: service.id,
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
    return [];
  }
}

export async function getClients() {
  try {
    const clients = await prisma.client.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: { id: true, name: true, logoPath: true, websiteUrl: true, sortOrder: true },
    });
    return clients;
  } catch {
    return [];
  }
}

export async function getTeams() {
  try {
    const groups = await prisma.teamGroup.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], include: { members: { where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] } } });
    return groups.map((group) => ({ name: group.name, description: group.description, members: group.members.map((member) => ({ name: member.name, role: member.role, description: member.description, image: member.imagePath })) }));
  } catch {
    return [];
  }
}

export async function getTestimonials() {
  try {
    return prisma.testimonial.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  } catch {
    return [];
  }
}
