import Link from "next/link"
import { formatPrice } from "@/lib/utils"

export default function PackCard({ pack }) {
  return (
    <Link href={`/boutique/packs/${pack._id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group border-2 border-purple-200">
        <div className="relative">
          <div className="absolute top-3 right-3 z-10">
            <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">PACK</span>
          </div>
          <div className="aspect-[3/4] overflow-hidden bg-gray-100">
            <img
              src={pack.couvertureUrl || "/placeholder.svg"}
              alt={pack.nom}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-purple-600 transition">
            {pack.nom}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{pack.livres?.length || 0} livres inclus</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-purple-600">{formatPrice(pack.prix)}</span>
            {pack.reduction > 0 && <span className="text-xs text-green-600 font-semibold">-{pack.reduction}%</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
