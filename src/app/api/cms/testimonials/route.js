import { deleteTestimonialController, listTestimonialsController, saveTestimonialController } from "@/lib/content/testimonialController";
export async function GET() { return listTestimonialsController(); }
export async function POST(request) { return saveTestimonialController(request); }
export async function PATCH(request) { return saveTestimonialController(request); }
export async function DELETE(request) { return deleteTestimonialController(request); }