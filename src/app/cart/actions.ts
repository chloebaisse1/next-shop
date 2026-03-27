/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import Stripe from "stripe"

export async function createCheckoutSession(cart: any[]) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const publicUrl = process.env.NEXT_PUBLIC_URL

  if (!secretKey) {
    throw new Error("Configuration serveur incomplète (Key)")
  }

  if (!publicUrl) {
    throw new Error("Configuration serveur incomplète (URL)")
  }

  const stripe = new Stripe(secretKey)

  try {
    const line_items = cart.map((item) => {
      const amount = Math.round(Number(item.price) * 100)

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            description: item.description || undefined,

            metadata: {
              db_id: item.id.toString(),
            },
          },
          unit_amount: amount,
        },
        quantity: item.quantity,
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",

      success_url: `${publicUrl.replace(/\/$/, "")}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${publicUrl.replace(/\/$/, "")}/cart`,
    })

    return { url: session.url }
  } catch (error: any) {
    console.error("❌ ERREUR STRIPE :", error.message)
    throw new Error(error.message)
  }
}
