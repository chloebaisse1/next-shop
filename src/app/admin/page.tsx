import { prisma } from "@/lib/prisma"
import AdminContent from "./AdminContent"

export default async function AdminPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8 md:p-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 border-b border-black/5 pb-8">
          <h1 className="text-4xl font-serif italic mb-2 text-gray-900">
            Dashboard Admin
          </h1>
          <p className="text-gray-400 text-xs uppercase tracking-[0.3em]">
            Gestion des stocks & catalogue
          </p>
        </header>

        <AdminContent initialProducts={products} />
      </div>
    </div>
  )
}
