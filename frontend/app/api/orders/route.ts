import { NextResponse } from "next/server";
import { createOrder } from "@/lib/operations";
import { type OrderItem } from "@/lib/backoffice";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      customerName?: string;
      customerEmail?: string;
      items?: OrderItem[];
    };

    const order = await createOrder({
      customerName: payload.customerName ?? "",
      customerEmail: payload.customerEmail ?? "",
      items: payload.items ?? [],
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to place order." },
      { status: 400 },
    );
  }
}
