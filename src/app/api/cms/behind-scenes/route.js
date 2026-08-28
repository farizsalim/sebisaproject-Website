import {
  createBehindSceneController,
  deleteBehindSceneController,
  listBehindScenesController,
  updateBehindSceneController,
} from "@/lib/content/behindSceneController";

export async function GET() {
  return listBehindScenesController();
}

export async function POST(request) {
  return createBehindSceneController(request);
}

export async function PATCH(request) {
  return updateBehindSceneController(request);
}

export async function DELETE(request) {
  return deleteBehindSceneController(request);
}