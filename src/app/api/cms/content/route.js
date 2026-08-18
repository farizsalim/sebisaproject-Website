import {
  listContentController,
  updateContentController,
} from "@/lib/content/contentController";

export async function GET() {
  return listContentController();
}

export async function PATCH(request) {
  return updateContentController(request);
}
