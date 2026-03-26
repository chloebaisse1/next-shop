/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import Stripe from "stripe"

export async function createCheckoutSession(cart: any[]) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const publicUrl = process.env.NEXT_PUBLIC_URL

  if (!secretKey) {
    console.error(
      "ERREUR : STRIPE_SECRET_KEY est undefined. Vérifie ton fichier .env.local",
    )
    throw new Error("Configuration serveur incomplète (Key)")
  }

  if (!publicUrl) {
    console.error(
      "ERREUR : NEXT_PUBLIC_URL est undefined. Vérifie ton fichier .env.local",
    )
    throw new Error("Configuration serveur incomplète (URL)")
  }

  const stripe = new Stripe(secretKey)

  try {
    const line_items = cart.map((item) => {
      const amount = Math.round(Number(item.price) * 100)
      if (amount <= 0)
        throw new Error(`Le prix pour ${item.name} doit être supérieur à 0`)

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            description: item.description || undefined,
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

      success_url: `${publicUrl.replace(/\/$/, "")}/cart/success`,
      cancel_url: `${publicUrl.replace(/\/$/, "")}/cart`,
    })

    if (!session.url) {
      throw new Error("Stripe n'a pas généré d'URL de session.")
    }

    return { url: session.url }
  } catch (error: any) {
    console.error(
      "❌ ERREUR STRIPE DÉTAILLÉE :",
      error.raw?.message || error.message,
    )

    throw new Error(
      error.raw?.message ||
        error.message ||
        "Erreur lors de la création de la session de paiement",
    )
  }
}
