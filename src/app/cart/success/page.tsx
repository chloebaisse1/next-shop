/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  HiCheckCircle,
  HiOutlineEnvelope,
  HiOutlineShoppingBag,
} from "react-icons/hi2"
import { useCart } from "../../components/CartProvider"

export default function SuccessPage() {
  const { clearCart } = useCart()
  const [orderNumber, setOrderNumber] = useState("")

  useEffect(() => {
    const randomOrder =
      "NX-" + Math.random().toString(36).toUpperCase().substring(2, 9)
    setOrderNumber(randomOrder)

    clearCart()
  }, [])

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6 text-[#1a1a1a]">
      <div className="max-w-xl w-full bg-white p-12 md:p-16 rounded-3xl shadow-2xl shadow-black/5 border border-black/5 text-center relative overflow-hidden">
        <div className="flex justify-center mb-8 text-green-500 animate-bounce">
          <HiCheckCircle size={90} />
        </div>

        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
          Commande Confirmée
        </h1>

        <p className="text-gray-500 mb-10 leading-relaxed font-light">
          Merci pour votre achat. Votre paiement a été traité avec succès et
          votre équipement est en cours de préparation.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100 flex flex-col gap-4">
          <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-3">
            <span className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">
              N° de commande
            </span>
            <span className="font-mono font-bold text-[#b59458]">
              {orderNumber}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">
              Statut
            </span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
              Payé
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
          <div className="flex gap-3 items-start p-4 bg-gray-50 rounded-xl">
            <HiOutlineEnvelope className="text-[#b59458] mt-1" size={20} />
            <div>
              <p className="text-xs font-bold uppercase tracking-tighter mb-1">
                E-mail
              </p>
              <p className="text-[11px] text-gray-400 leading-tight">
                Confirmation envoyée avec votre facture PDF.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start p-4 bg-gray-50 rounded-xl">
            <HiOutlineShoppingBag className="text-[#b59458] mt-1" size={20} />
            <div>
              <p className="text-xs font-bold uppercase tracking-tighter mb-1">
                Expédition
              </p>
              <p className="text-[11px] text-gray-400 leading-tight">
                Suivi disponible sous 24h ouvrées.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="w-full inline-block bg-[#1a1a1a] text-white px-8 py-5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#b59458] transition-all shadow-xl active:scale-95"
        >
          Continuer mes achats
        </Link>

        <p className="mt-8 text-[9px] text-gray-300 uppercase tracking-widest">
          Besoin d'aide ? Contactez notre support 24/7
        </p>
      </div>
    </div>
  )
}
