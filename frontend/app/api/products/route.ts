import { NextResponse } from "next/server";
import { getVisibleProducts } from "@/lib/catalog";

export async function GET() {
  const products = await getVisibleProducts();
  return NextResponse.json(products);
}
