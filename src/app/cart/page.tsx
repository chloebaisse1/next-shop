/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { FaArrowLeft } from "react-icons/fa6"
import { HiOutlineMinus, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2"
import { useCart } from "../components/CartProvider"
import { createCheckoutSession } from "./actions"

export default function CartPage() {
  const { cart, cartCount, removeFromCart, updateQuantity } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )

  const getImagePath = (name: string) => {
    const firstWord = name.toLowerCase().split(" ")[0]
    const cleanName = firstWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return `/products/${cleanName}.jpg`
  }

  const handlePayment = async () => {
    try {
      setIsLoading(true)
      const result = await createCheckoutSession(cart)

      if (result?.url) {
        window.location.href = result.url
      } else {
        alert("Erreur : Stripe n'a pas renvoyé d'URL de redirection.")
      }
    } catch (error: any) {
      console.error("Erreur paiement:", error)
      alert(
        error.message ||
          "Une erreur est survenue lors de l'initialisation du paiement.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-white py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-accent hover:text-white transition-colors mb-8 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Retour au catalogue
          </Link>
          <h1 className="text-4xl md:text-6xl font-serif italic text-white leading-tight">
            Votre Sélection
            <span className="text-sm font-sans not-italic text-white/20 ml-6 tracking-[0.2em] uppercase">
              [{cartCount} modèles]
            </span>
          </h1>
        </header>

        {cart.length === 0 ? (
          <div className="py-32 text-center border border-white/5 bg-[#111]/30 rounded-sm">
            <p className="text-white/30 italic mb-10 font-light tracking-wide">
              Votre panier est actuellement vide.
            </p>
            <Link
              href="/"
              className="inline-block bg-accent text-black px-12 py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-[#d4b87e] transition-all shadow-lg shadow-accent/10"
            >
              Découvrir la collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2">
              <div className="border-t border-white/10">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="py-10 border-b border-white/5 flex flex-col md:flex-row items-center gap-10 group"
                  >
                    <div className="relative w-32 h-32 bg-[#1a1a1a] overflow-hidden rounded-sm shrink-0 border border-white/5">
                      <Image
                        src={getImagePath(item.name)}
                        alt={item.name}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-accent mb-1 block">
                        Hardware Premium
                      </span>
                      <h3 className="text-xl font-serif text-white/90 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm font-light text-white/30 tracking-wider">
                        {item.price.toFixed(2)} € / unité
                      </p>
                    </div>

                    <div className="flex items-center border border-white/10 bg-white/5 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 hover:text-accent transition-colors"
                      >
                        <HiOutlineMinus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 hover:text-accent transition-colors"
                      >
                        <HiOutlinePlus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-10">
                      <p className="w-24 text-right font-light text-xl tracking-tighter">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-3 text-white/10 hover:text-red-500 transition-colors duration-300"
                        title="Supprimer l'article"
                      >
                        <HiOutlineTrash size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#111] p-10 border border-white/5 sticky top-32 rounded-sm shadow-2xl">
                <h2 className="text-[11px] uppercase tracking-[0.4em] font-black mb-10 text-accent border-b border-white/5 pb-4">
                  Récapitulatif
                </h2>

                <div className="space-y-6 mb-12">
                  <div className="flex justify-between text-sm text-white/40 font-light tracking-wide">
                    <span>Sous-total</span>
                    <span>{totalPrice.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/40 font-light tracking-wide">
                    <span>Expédition</span>
                    <span className="text-accent uppercase text-[10px] font-bold tracking-widest">
                      Offerte
                    </span>
                  </div>
                  <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-8" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs uppercase tracking-[0.3em] font-bold">
                      Total TTC
                    </span>
                    <span className="text-4xl font-light tracking-tighter text-accent">
                      {totalPrice.toFixed(2)} €
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className={`w-full ${isLoading ? "bg-gray-600 cursor-not-allowed" : "bg-[#b59458] hover:bg-black"} text-white py-5 font-black text-[11px] uppercase tracking-[0.3em] transition-all duration-500 shadow-xl active:scale-95`}
                >
                  {isLoading ? "Traitement..." : "Procéder au paiement"}
                </button>

                <div className="mt-8 flex flex-col items-center gap-4 border-t border-white/5 pt-8">
                  <p className="text-[8px] text-white/20 uppercase tracking-[0.5em] text-center leading-loose">
                    Transaction sécurisée par chiffrement SSL <br />
                    2026 NextShop — Tous droits réservés
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
