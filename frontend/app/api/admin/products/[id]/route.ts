import { NextResponse } from "next/server";
import { deleteProduct, getProductById, saveProduct, type ProductMutationInput } from "@/lib/catalog";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const existing = await getProductById(id);

    if (!existing) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    const payload = (await request.json()) as ProductMutationInput;
    const product = await saveProduct({ ...payload, id });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to update product." },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}
