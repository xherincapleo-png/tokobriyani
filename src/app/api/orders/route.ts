import { NextResponse } from "next/server";
import { createOrderPayloadSchema } from "@/lib/validations/schemas";
import { createVerifiedOrder } from "@/lib/data/repository";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createOrderPayloadSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        {
          error: firstIssue?.message || "Invalid checkout details.",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const result = await createVerifiedOrder(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unable to place order. Please try again.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
