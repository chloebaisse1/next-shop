import { prisma } from "@/lib/prisma"
import AdminContent from "./AdminContent"
import StockAlert from "./StockAlert"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })

  // 3. FILTRAGE DES ALERTES (Produits avec stock <= 5)
  // On fait ça ici pour que StockAlert reçoive les données instantanément
  const lowStockProducts = products.filter((p) => p.stock <= 5)

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8 md:p-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-b border-black/5 pb-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-serif italic mb-2 text-gray-900">
                Dashboard Admin
              </h1>
              <p className="text-gray-400 text-xs uppercase tracking-[0.3em]">
                Gestion des stocks & catalogue
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                Statut Base de données
              </span>
              <div className="flex items-center gap-2 justify-end mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-mono text-gray-600">
                  Neon Connected
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="mb-10">
          <StockAlert initialAlerts={lowStockProducts} />
        </div>

        <AdminContent initialProducts={products} />
      </div>
    </div>
  )
}
