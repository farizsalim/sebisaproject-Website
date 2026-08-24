import { prisma } from "@/lib/prisma";
import quizPlan from "../../../public/data/consultation-quiz-plan.json";

const allowedRoles = ["SUPER_ADMIN", "ADMIN", "EDITOR"];
const recommendationGroups = [
  { label: "Konten & Social Media", description: "Untuk kebutuhan konten rutin, pengelolaan media sosial, dan menjangkau lebih banyak audiens.", names: ["Paket Starter", "Paket Kreator", "Paket Pro", "Paket Elite", "Social Media Jalan Terus", "Paket Konten Terima Beres", "Edit Set A", "Edit Set B", "Paket Sosmed"] },
  { label: "Desain & Branding", description: "Untuk membangun identitas visual, merapikan tampilan brand, dan terlihat lebih profesional.", names: ["Design Graphic Set A", "Design Graphic Set B", "Design Sosmed", "Design"] },
  { label: "Website & Landing Page", description: "Untuk memiliki website, landing page, atau halaman yang membantu promosi dan penjualan.", names: ["Paket Landing Page", "Paket Website"] },
];

function getRecommendationName(serviceName) {
  return recommendationGroups.find((group) => group.names.includes(serviceName))?.label || serviceName;
}

function getRecommendationDescription(recommendationName) {
  return recommendationGroups.find((group) => group.label === recommendationName)?.description || "Rekomendasi berdasarkan jawaban konsultasi kamu.";
}

function hasQuizAccess(session) {
  return allowedRoles.includes(session?.user?.role);
}

function serializeQuiz(quiz) {
  const scoringRules = {};
  const nodes = quiz.nodes.map((node) => ({
    id: node.id,
    type: node.type === "RESULT" ? "result" : "question",
    position: { x: node.positionX, y: node.positionY },
    data: node.type === "RESULT"
      ? { label: node.title, description: node.description }
      : {
          title: node.title,
          options: node.options
            .sort((first, second) => first.sortOrder - second.sortOrder)
            .map((option) => {
              const groupedScores = {};
              option.scoreRules.forEach((rule) => {
                const recommendationName = getRecommendationName(rule.service.name);
                groupedScores[recommendationName] = Math.max(groupedScores[recommendationName] || 0, rule.score);
              });
              scoringRules[option.label] = groupedScores;
              return {
              id: option.id,
              label: option.label,
              target: option.targetNodeId,
              scores: option.scoreRules.map((rule) => ({
                serviceId: rule.serviceId,
                serviceName: getRecommendationName(rule.service.name),
                score: rule.score,
              })),
              };
            }),
        },
  }));
  const edges = quiz.nodes.flatMap((node) => node.options
    .filter((option) => option.targetNodeId)
    .map((option) => ({
      id: `${option.id}-${option.targetNodeId}`,
      source: node.id,
      sourceHandle: `option-${option.sortOrder}`,
      target: option.targetNodeId,
      type: "smoothstep",
      animated: true,
    })));

  return {
    id: quiz.id,
    slug: quiz.slug,
    title: quiz.title,
    version: quiz.version,
    isPublished: quiz.isPublished,
    startNodeId: quiz.startNodeId,
    scoringRules,
    recommendationDescriptions: Object.fromEntries(Object.values(scoringRules).flatMap((rules) => Object.keys(rules)).map((name) => [name, getRecommendationDescription(name)])),
    defaultRecommendations: [],
    flow: { startId: quiz.startNodeId, nodes, edges },
    nodes,
    edges,
  };
}

const quizInclude = {
  nodes: {
    include: {
      options: {
        include: {
          scoreRules: { include: { service: { select: { id: true, name: true } } } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  },
};

async function loadQuiz(where) {
  const quiz = await prisma.consultationQuiz.findFirst({ where, include: quizInclude, orderBy: { updatedAt: "desc" } });
  return quiz ? serializeQuiz(quiz) : null;
}

async function createQuizFromPlan() {
  const services = await prisma.service.findMany({ select: { id: true, name: true } });
  const serviceIds = new Map(services.map((service) => [service.name, service.id]));

  try {
    return await prisma.$transaction(async (transaction) => {
    const quiz = await transaction.consultationQuiz.create({
      data: {
        slug: quizPlan.slug,
        title: quizPlan.title,
        version: quizPlan.version,
        isPublished: true,
      },
    });
    const nodeIds = new Map();

    for (const node of quizPlan.flow.nodes) {
      const createdNode = await transaction.consultationQuizNode.create({
        data: {
          quizId: quiz.id,
          type: node.type === "result" ? "RESULT" : "QUESTION",
          title: node.title,
          description: node.description || "",
          positionX: node.position?.x || 0,
          positionY: node.position?.y || 0,
        },
      });
      nodeIds.set(node.id, createdNode.id);
    }

    for (const node of quizPlan.flow.nodes.filter((item) => item.type === "question")) {
      const createdNodeId = nodeIds.get(node.id);
      for (const [sortOrder, option] of node.options.entries()) {
        const scores = Object.entries(quizPlan.scoringRules[option.label] || {})
          .map(([serviceName, score]) => ({ serviceId: serviceIds.get(serviceName), score }))
          .filter((rule) => rule.serviceId);
        await transaction.consultationQuizOption.create({
          data: {
            nodeId: createdNodeId,
            label: option.label,
            sortOrder,
            targetNodeId: nodeIds.get(option.targetNodeId) || null,
            scoreRules: { create: scores },
          },
        });
      }
    }

    await transaction.consultationQuiz.update({
      where: { id: quiz.id },
      data: { startNodeId: nodeIds.get(quizPlan.flow.startNodeId) },
    });
      return quiz.id;
    });
  } catch (error) {
    if (error?.code !== "P2002") throw error;
    const existingQuiz = await prisma.consultationQuiz.findUnique({ where: { slug: quizPlan.slug } });
    if (!existingQuiz) throw error;
    return existingQuiz.id;
  }
}

export async function listQuizController(session) {
  if (!hasQuizAccess(session)) return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });

  try {
    let quiz = await loadQuiz({ isPublished: false });
    if (!quiz) quiz = await loadQuiz({ isPublished: true });
    if (!quiz) {
      await createQuizFromPlan();
      quiz = await loadQuiz({ slug: quizPlan.slug });
    }
    return Response.json({ quiz });
  } catch (error) {
    console.error("Failed to load consultation quiz", error);
    return Response.json({ error: "Gagal mengambil alur kuis" }, { status: 500 });
  }
}

export async function getPublishedQuiz() {
  try {
    let quiz = await loadQuiz({ isPublished: true });
    if (!quiz) {
      await createQuizFromPlan();
      quiz = await loadQuiz({ isPublished: true });
    }
    return quiz;
  } catch {
    return null;
  }
}

export async function updateQuizController(request, session) {
  if (!hasQuizAccess(session)) return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });

  const body = await request.json();
  if (!body.quizId || !Array.isArray(body.nodes) || !Array.isArray(body.edges)) {
    return Response.json({ error: "Format alur kuis tidak valid" }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (transaction) => {
      const quiz = await transaction.consultationQuiz.findUnique({ where: { id: body.quizId } });
      if (!quiz) throw new Error("QUIZ_NOT_FOUND");
      const services = await transaction.service.findMany({ select: { id: true } });
      const serviceIds = new Set(services.map((service) => service.id));
      await transaction.consultationQuizNode.deleteMany({ where: { quizId: quiz.id } });
      const nodeIds = new Map();

      for (const node of body.nodes) {
        const createdNode = await transaction.consultationQuizNode.create({
          data: {
            quizId: quiz.id,
            type: node.type === "result" ? "RESULT" : "QUESTION",
            title: node.type === "result" ? node.data?.label || "Hasil rekomendasi" : node.data?.title || "Pertanyaan baru",
            description: node.data?.description || "",
            positionX: Number(node.position?.x) || 0,
            positionY: Number(node.position?.y) || 0,
          },
        });
        nodeIds.set(node.id, createdNode.id);
      }

      for (const node of body.nodes.filter((item) => item.type === "question")) {
        const options = node.data?.options || [];
        for (const [sortOrder, option] of options.entries()) {
          const scores = (option.scores || [])
            .filter((rule) => serviceIds.has(rule.serviceId))
            .map((rule) => ({ serviceId: rule.serviceId, score: Number(rule.score) || 0 }));
          await transaction.consultationQuizOption.create({
            data: {
              nodeId: nodeIds.get(node.id),
              label: option.label || `Opsi ${sortOrder + 1}`,
              sortOrder,
              targetNodeId: nodeIds.get(option.target) || null,
              scoreRules: { create: scores },
            },
          });
        }
      }

      await transaction.consultationQuiz.update({
        where: { id: quiz.id },
        data: {
          version: { increment: 1 },
          startNodeId: nodeIds.get(body.startNodeId) || nodeIds.get(body.nodes[0]?.id) || null,
        },
      });
    });

    return listQuizController(session);
  } catch (error) {
    if (error.message === "QUIZ_NOT_FOUND") return Response.json({ error: "Kuis tidak ditemukan" }, { status: 404 });
    console.error("Failed to update consultation quiz", error);
    return Response.json({ error: "Gagal menyimpan alur kuis" }, { status: 500 });
  }
}
