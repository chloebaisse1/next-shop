import type { Metadata } from "next"
import { DM_Sans, DM_Serif_Display } from "next/font/google"
import Navbar from "./components/Navbar"
import { Providers } from "./components/Providers"
import "./globals.css"

const dmSans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] })
const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
})

export const metadata: Metadata = {
  title: "NextShop 2026",
  description: "Boutique haut de gamme",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      className={`${dmSans.variable} ${dmSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased bg-background text-foreground min-h-screen">
        <Providers>
          <Navbar />

          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
