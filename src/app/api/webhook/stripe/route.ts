/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("Stripe-Signature") as string
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err: any) {
    console.error("❌ Erreur Signature Webhook :", err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const cartDetails = session.metadata?.cart_details // "id:qty,id:qty"

    if (!cartDetails) {
      console.error("❌ Metadata 'cart_details' manquantes dans la session")
      return new NextResponse("Metadata missing", { status: 400 })
    }

    try {
      // On utilise une transaction Prisma pour tout faire d'un coup
      await prisma.$transaction(
        async (tx) => {
          // 1. Création de la commande principale
          const order = await tx.order.create({
            data: {
              stripeSessionId: session.id,
              customerEmail: session.customer_details?.email || "unknown",
              status: "paid",
              total: (session.amount_total || 0) / 100,
            },
          })

          // 2. Analyse de la chaîne "id:qty"
          const items = cartDetails.split(",")

          for (const itemStr of items) {
            const [productId, quantity] = itemStr.split(":").map(Number)

            if (isNaN(productId) || isNaN(quantity)) continue

            // Ajout de l'item à la commande
            await tx.orderItem.create({
              data: {
                orderId: order.id,
                productId: productId,
                quantity: quantity,
                unitPrice: 0, // Optionnel: tu peux enrichir les metadata avec les prix si besoin
              },
            })

            // MISE À JOUR DU STOCK DANS NEON
            await tx.product.update({
              where: { id: productId },
              data: {
                stock: {
                  decrement: quantity,
                },
              },
            })

            console.log(
              `📦 Stock décrémenté pour le produit #${productId} (-${quantity})`,
            )
          }
        },
        {
          maxWait: 10000,
          timeout: 20000,
        },
      )

      console.log("🚀 SUCCÈS : Commande Neon créée et stock mis à jour !")
    } catch (dbError: any) {
      console.error("❌ Erreur Transaction Prisma :", dbError.message)
      return new NextResponse(`Database Error: ${dbError.message}`, {
        status: 500,
      })
    }
  }

  return new NextResponse("Success", { status: 200 })
}
