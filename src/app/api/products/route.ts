import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  const { name, description, price, stock } = await request.json()

  if (!name || !description || price == null || stock == null) {
    return NextResponse.json(
      { error: "Champs requis manquants" },
      { status: 400 },
    )
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
    },
  })

  return NextResponse.json(product, { status: 201 })
}
