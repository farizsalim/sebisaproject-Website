import {
  listContentController,
  updateContentController,
} from "@/lib/content/contentController";
import { auth } from "@/auth";
import { listQuizController, updateQuizController } from "@/lib/quiz/quizController";

export async function GET(request) {
  if (new URL(request.url).searchParams.get("type") === "quiz") {
    return listQuizController(await auth());
  }
  return listContentController();
}

export async function PATCH(request) {
  if (request.headers.get("x-content-type") === "quiz") {
    return updateQuizController(request, await auth());
  }
  return updateContentController(request);
}
