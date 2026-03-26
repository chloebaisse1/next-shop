/* eslint-disable react/no-unescaped-entities */
import { prisma } from "@/lib/prisma"
import ProductCard from "./components/ProductCard"

export default async function Home() {
  const products = await prisma.product.findMany()

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-20">
      {/* Hero Section */}
      <header className="mb-20">
        <p className="text-accent font-medium tracking-[0.3em] text-xs uppercase mb-4 opacity-90">
          Collection 2026
        </p>
        <h1 className="text-4xl md:text-7xl font-bold text-white leading-[1.1]">
          L'équipement{" "}
          <span className="italic font-light opacity-70 font-serif">
            qui fait
          </span>{" "}
          la différence.
        </h1>
      </header>

      <div className="flex items-center justify-between mb-12">
        <h2 className="text-xl md:text-2xl font-semibold italic font-serif text-white/90">
          Tous les produits
        </h2>
        <div className="h-px flex-1 bg-white/5 ml-8" />
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description || ""}
              price={product.price}
              stock={product.stock}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-white/5 rounded-sm">
          <p className="text-white/30 italic">
            Aucun produit n'est disponible pour le moment.
          </p>
        </div>
      )}

      <footer className="mt-32 py-12 border-t border-white/5 text-center">
        <p className="text-white/20 text-[10px] tracking-[0.4em] uppercase">
          © 2026 nextshop — l'excellence technologique
        </p>
      </footer>
    </div>
  )
}
