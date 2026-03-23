import { NextResponse } from "next/server";
import { getProducts, saveProduct, type ProductMutationInput } from "@/lib/catalog";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ProductMutationInput;
    const product = await saveProduct(payload);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to create product." },
      { status: 400 },
    );
  }
}
