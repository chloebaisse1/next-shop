import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const data = await request.json()

  const product = await prisma.product.update({
    where: { id: parseInt(id) },
    data: {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
    },
  })

  return NextResponse.json(product)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  await prisma.product.delete({
    where: { id: parseInt(id) },
  })

  return NextResponse.json({ ok: true })
}
