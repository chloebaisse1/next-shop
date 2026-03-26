/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string)
    const stock = parseInt(formData.get("stock") as string)

    await prisma.product.create({
      data: { name, description, price, stock },
    })

    revalidatePath("/")
    revalidatePath("/admin")
  } catch (error) {
    console.error("Erreur création:", error)
    throw new Error("Impossible de créer le produit")
  }
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({ where: { id } })

    revalidatePath("/")
    revalidatePath("/admin")
  } catch (error) {
    console.error("Erreur suppression:", error)
    throw new Error("Impossible de supprimer le produit")
  }
}

export async function updateProduct(id: number, data: any) {
  try {
    const name =
      data instanceof FormData ? (data.get("name") as string) : data.name
    const description =
      data instanceof FormData
        ? (data.get("description") as string)
        : data.description
    const priceStr =
      data instanceof FormData ? (data.get("price") as string) : data.price
    const stockStr =
      data instanceof FormData ? (data.get("stock") as string) : data.stock

    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(priceStr),
        stock: parseInt(stockStr),
      },
    })

    revalidatePath("/")
    revalidatePath("/admin")
  } catch (error) {
    console.error("Erreur modification:", error)
    throw new Error("Impossible de modifier le produit")
  }
}
