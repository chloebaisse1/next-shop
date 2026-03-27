/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { HiOutlineExclamationTriangle } from "react-icons/hi2"

interface StockAlertProps {
  initialAlerts: any[]
}

export default function StockAlert({ initialAlerts }: StockAlertProps) {
  // Si le serveur ne nous envoie aucun produit en alerte, on n'affiche rien
  if (!initialAlerts || initialAlerts.length === 0) return null

  return (
    <div className="space-y-3">
      {initialAlerts.map((item) => (
        <div
          key={item.id}
          className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-4 animate-pulse shadow-sm"
        >
          <div className="bg-amber-500 p-2 rounded-lg text-white shadow-md">
            <HiOutlineExclamationTriangle size={20} />
          </div>
          <div>
            <p className="text-amber-900 text-[10px] uppercase tracking-[0.2em] font-black">
              Alerte Réapprovisionnement
            </p>
            <p className="text-amber-800 text-sm font-medium">
              Le produit{" "}
              <span className="underline decoration-amber-300">
                {item.name}
              </span>{" "}
              est presque épuisé.
            </p>
            <p className="text-amber-600 text-[11px] mt-0.5">
              Quantité restante :{" "}
              <span className="font-bold text-amber-900">{item.stock}</span>{" "}
              unités.
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
