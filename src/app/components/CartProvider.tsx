/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: any) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, delta: number) => void
  cartCount: number
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart")
      try {
        return savedCart ? JSON.parse(savedCart) : []
      } catch (e) {
        return []
      }
    }
    return []
  })

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart, isMounted])

  const addToCart = (product: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })

    toast.success(`${product.name} ajouté !`, {
      style: {
        background: "#111",
        color: "#f0ede6",
        border: "1px solid rgba(201, 169, 110, 0.2)",
      },
    })
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
    toast.error("Article retiré du panier", {
      style: {
        background: "#111",
        color: "#f0ede6",
        border: "1px solid rgba(255, 0, 0, 0.2)",
      },
    })
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta)
          return { ...item, quantity: newQty }
        }
        return item
      }),
    )
  }

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  const clearCart = () => {
    setCart([])
    localStorage.removeItem("cart")
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
