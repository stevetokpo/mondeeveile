import Link from "next/link"
import { formatPrice } from "@/lib/utils"

export default function LivreCard({ livre }) {
  return (
    <Link href={`/boutique/livres/${livre._id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group">
        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={livre.couvertureUrl || "/placeholder.svg"}
            alt={livre.titre}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-purple-600 transition">
            {livre.titre}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{livre.auteur}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-purple-600">{formatPrice(livre.prix)}</span>
            <span className="text-xs text-gray-500">{livre.taille}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
