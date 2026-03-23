import { NextResponse } from "next/server";
import { createSubscriber } from "@/lib/operations";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { email?: string; source?: string };
    const subscriber = await createSubscriber({
      email: payload.email ?? "",
      source: payload.source,
    });

    return NextResponse.json(subscriber, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to subscribe." },
      { status: 400 },
    );
  }
}
