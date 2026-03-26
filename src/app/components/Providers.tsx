"use client"

import { CartProvider } from "./CartProvider"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster richColors position="top-right" theme="dark" />
    </CartProvider>
  )
}
