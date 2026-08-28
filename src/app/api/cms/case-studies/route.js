import {
  deleteCaseStudyController,
  listCaseStudiesController,
  saveCaseStudyController,
} from "@/lib/content/caseStudyController";

export async function GET() {
  return listCaseStudiesController();
}

export async function POST(request) {
  return saveCaseStudyController(request);
}

export async function PATCH(request) {
  return saveCaseStudyController(request);
}

export async function DELETE(request) {
  return deleteCaseStudyController(request);
}
