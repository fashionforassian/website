import { NextResponse } from "next/server";
import { getOrders, updateOrder } from "@/lib/operations";
import { type OrderStatus } from "@/lib/backoffice";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const orders = await getOrders();
    const existing = orders.find((order) => order.id === id);

    if (!existing) {
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    }

    const payload = (await request.json()) as {
      status?: OrderStatus;
      trackingNumber?: string | null;
      adminNotes?: string;
    };

    const order = await updateOrder(id, payload);
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to update order." },
      { status: 400 },
    );
  }
}
