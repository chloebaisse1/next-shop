"use client"

import Image from "next/image"
import { useCart } from "./CartProvider"

interface ProductProps {
  id: number
  name: string
  description: string
  price: number
  stock: number
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  stock,
}: ProductProps) {
  const { addToCart } = useCart()

  const getImagePath = (productName: string) => {
    const firstWord = productName.toLowerCase().split(" ")[0]
    const cleanName = firstWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return `/products/${cleanName}.jpg`
  }

  const imagePath = getImagePath(name)
  const isOutOfStock = stock <= 0
  const isLowStock = stock > 0 && stock <= 5

  return (
    <div
      className={`group flex flex-col bg-[#111111] p-6 border border-white/5 transition-all hover:bg-[#151515] ${isOutOfStock ? "opacity-70" : "hover:border-accent/20"}`}
    >
      {/* Conteneur Image + Badge */}
      <div className="relative aspect-square w-full mb-6 overflow-hidden bg-[#1a1a1a] rounded-sm">
        <Image
          src={imagePath}
          alt={name}
          fill
          className={`object-cover transition-transform duration-500 ${!isOutOfStock && "group-hover:scale-110"} opacity-90 group-hover:opacity-100`}
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={id <= 3}
        />

        {/* Badges de Stock avec contrastes forcés */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-1 shadow-2xl">
              Rupture
            </span>
          ) : isLowStock ? (
            <span className="bg-accent text-black text-[10px] font-black uppercase px-2 py-1 animate-pulse shadow-2xl">
              Plus que {stock}
            </span>
          ) : (
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase px-2 py-1 border border-white/10">
              {stock} en stock
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <h3 className="font-serif text-xl text-white mb-2 leading-tight">
          {name}
        </h3>

        <p className="text-xs text-white/40 leading-relaxed line-clamp-2 mb-6 italic font-light">
          {description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-5">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-white/20 tracking-widest">
              Prix
            </span>
            <span className="text-xl font-light tracking-tighter text-white">
              {price.toFixed(2)} €
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              if (!isOutOfStock) addToCart({ id, name, price })
            }}
            disabled={isOutOfStock}
            className={`transition-all duration-300 text-[11px] uppercase tracking-widest px-6 py-3 font-bold
              ${
                isOutOfStock
                  ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                  : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 bg-accent text-black hover:bg-[#d4b87e] active:scale-95 shadow-lg shadow-accent/20"
              }`}
          >
            {isOutOfStock ? "Indisponible" : "Ajouter au panier"}
          </button>
        </div>
      </div>
    </div>
  )
}
