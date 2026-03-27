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

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    })

    try {
      await prisma.$transaction(
        async (tx) => {
          // 2. Création de la commande principale
          const order = await tx.order.create({
            data: {
              stripeSessionId: session.id,
              customerEmail: session.customer_details?.email || "unknown",
              status: "paid",
              total: (session.amount_total || 0) / 100,
            },
          })

          for (const item of lineItems.data) {
            const stripeProduct = item.price?.product as Stripe.Product
            const dbId = stripeProduct.metadata?.db_id

            if (!dbId) {
              throw new Error(
                `ID produit absent des metadata pour: ${item.description}`,
              )
            }

            const productIdNum = parseInt(dbId)
            const quantityPurchased = item.quantity || 1

            await tx.orderItem.create({
              data: {
                orderId: order.id,
                productId: productIdNum,
                quantity: quantityPurchased,
                unitPrice: (item.price?.unit_amount || 0) / 100,
              },
            })

            await tx.product.update({
              where: { id: productIdNum },
              data: {
                stock: {
                  decrement: quantityPurchased,
                },
              },
            })

            console.log(
              `📦 Stock décrémenté pour le produit ${productIdNum} (-${quantityPurchased})`,
            )
          }
        },
        {
          maxWait: 10000,
          timeout: 20000,
        },
      )

      console.log(
        "🚀 SUCCÈS : Commande créée et stock mis à jour avec Prisma !",
      )
    } catch (dbError: any) {
      console.error("❌ Erreur Transaction Prisma :", dbError.message)
      return new NextResponse(`Database Error: ${dbError.message}`, {
        status: 500,
      })
    }
  }

  return new NextResponse(null, { status: 200 })
}
