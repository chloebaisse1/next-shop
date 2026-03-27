/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineXMark,
} from "react-icons/hi2"
import { createProduct, deleteProduct, updateProduct } from "./actions"

export default function AdminContent({
  initialProducts,
}: {
  initialProducts: any[]
}) {
  const [editProduct, setEditProduct] = useState<any>(null)
  const router = useRouter()
  const isEditing = !!editProduct

  const handleAction = async (actionFn: () => Promise<void>) => {
    await actionFn()
    setEditProduct(null)
    router.refresh()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-xl border border-black/5 shadow-sm sticky top-32 text-black">
          <div className="flex justify-between items-center mb-8">
            <h2
              className={`text-[11px] uppercase tracking-[0.3em] font-bold italic ${isEditing ? "text-blue-600" : "text-[#b59458]"}`}
            >
              {isEditing ? "Modifier le Produit" : "Nouveau Produit"}
            </h2>
            {isEditing && (
              <button
                onClick={() => setEditProduct(null)}
                className="text-gray-400 hover:text-red-500"
              >
                <HiOutlineXMark size={20} />
              </button>
            )}
          </div>

          <form
            key={editProduct?.id || "new"}
            action={async (formData) => {
              await handleAction(async () => {
                if (isEditing) {
                  await updateProduct(editProduct.id, formData)
                } else {
                  await createProduct(formData)
                }
              })
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-[10px] uppercase text-gray-400 mb-2 font-bold">
                Nom du modèle
              </label>
              <input
                name="name"
                type="text"
                required
                defaultValue={editProduct?.name || ""}
                className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:border-[#b59458] outline-none rounded-lg text-black"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-gray-400 mb-2 font-bold">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                required
                defaultValue={editProduct?.description || ""}
                className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:border-[#b59458] outline-none rounded-lg text-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-2 font-bold">
                  Prix (€)
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  defaultValue={editProduct?.price || ""}
                  className="w-full bg-gray-50 border border-gray-200 p-3 text-sm outline-none rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-400 mb-2 font-bold">
                  Stock
                </label>
                <input
                  name="stock"
                  type="number"
                  required
                  defaultValue={editProduct?.stock || ""}
                  className="w-full bg-gray-50 border border-gray-200 p-3 text-sm outline-none rounded-lg text-black"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-4 font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-lg text-white ${isEditing ? "bg-blue-600 hover:bg-blue-700" : "bg-[#b59458] hover:bg-black"}`}
            >
              {isEditing ? <HiOutlinePencilSquare /> : <HiOutlinePlus />}
              {isEditing ? "Mettre à jour" : "Ajouter au stock"}
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2">
        <h2 className="text-sm uppercase tracking-[0.3em] font-bold mb-8 text-gray-400 italic">
          Inventaire actuel
        </h2>
        <div className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden text-black">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-[10px] uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4 font-bold">Produit</th>
                <th className="px-6 py-4 font-bold">Stock</th>
                <th className="px-6 py-4 font-bold text-right">Prix</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialProducts.map((p) => (
                <tr
                  key={p.id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="font-serif text-lg text-gray-900">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-gray-400 truncate max-w-[200px]">
                      {p.description}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${p.stock <= 5 ? "bg-orange-500 animate-pulse" : "bg-green-500"}`}
                      />
                      <span
                        className={`text-xs font-mono ${p.stock <= 5 ? "text-orange-600 font-bold" : "text-gray-600"}`}
                      >
                        {p.stock} unités
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-gray-900">
                    {p.price.toFixed(2)} €
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditProduct(p)
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <HiOutlinePencilSquare size={18} />
                      </button>
                      <button
                        onClick={() =>
                          handleAction(async () => {
                            if (confirm("Supprimer ?"))
                              await deleteProduct(p.id)
                          })
                        }
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
