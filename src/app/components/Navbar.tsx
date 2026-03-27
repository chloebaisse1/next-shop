/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { FaBasketShopping } from "react-icons/fa6"
import { IoSettings } from "react-icons/io5"
import { useCart } from "./CartProvider"

export default function Navbar() {
  const { cartCount } = useCart()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <nav className="sticky top-0 z-50 w-full h-20 bg-background border-b border-white/10 px-6 md:px-12 flex items-center justify-between">
      <Link
        href="/"
        className="font-serif text-2xl tracking-tighter text-white"
      >
        NEXT<span className="text-accent italic">SHOP</span>
      </Link>

      <div className="hidden md:flex items-center gap-10">
        <Link
          href="/"
          className="text-[11px] uppercase tracking-[0.2em] text-white/50 hover:text-accent transition-colors"
        >
          Produits
        </Link>
        <Link
          href="#"
          className="text-[11px] uppercase tracking-[0.2em] text-white/50 hover:text-accent transition-colors"
        >
          Catalogue
        </Link>
        <Link
          href="#"
          className="text-[11px] uppercase tracking-[0.2em] text-white/50 hover:text-accent transition-colors"
        >
          Promotions
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/admin"
          className="text-white/40 hover:text-white transition-colors"
          title="Administration"
        >
          <IoSettings size={20} />
        </Link>

        <Link
          href="/cart"
          className="relative flex items-center gap-3 bg-accent px-5 py-2 text-black font-bold text-sm hover:bg-[#d4b87e] transition-all active:scale-95"
        >
          <FaBasketShopping size={18} />
          <span className="hidden sm:inline">PANIER</span>

          {isMounted && cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-xl border border-black/10">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  )
}
