import {
  createClientController,
  deleteClientController,
  listClientsController,
  updateClientController,
} from "@/lib/clients/clientController";

export async function GET() {
  return listClientsController();
}

export async function POST(request) {
  return createClientController(request);
}

export async function PATCH(request) {
  return updateClientController(request);
}

export async function DELETE(request) {
  return deleteClientController(request);
}
