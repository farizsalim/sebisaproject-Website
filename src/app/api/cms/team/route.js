import { listTeamsController, saveTeamsController } from "@/lib/content/teamController";
export async function GET() { return listTeamsController(); }
export async function PUT(request) { return saveTeamsController(request); }