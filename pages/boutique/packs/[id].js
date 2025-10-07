"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { formatPrice } from "@/lib/utils"
import { usePanier } from "@/contexts/PanierContext"

export default function PackDetail() {
  const router = useRouter()
  const { id } = router.query
  const [pack, setPack] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addItem } = usePanier()

  useEffect(() => {
    if (id) {
      fetchPack()
    }
  }, [id])

  const fetchPack = async () => {
    try {
      const response = await fetch(`/api/packs/${id}`)
      const data = await response.json()

      if (data.success) {
        setPack(data.pack)
      }
    } catch (error) {
      console.error("Error fetching pack:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    const result = addItem({
      id: pack._id,
      type: "pack",
      nom: pack.nom,
      prix: pack.prix,
      couvertureUrl: pack.couvertureUrl,
      livresInclus: pack.livres.map((l) => l._id),
      nombreLivres: pack.livres.length,
    })

    if (result.success) {
      alert("Pack ajouté au panier !")
      router.push("/panier")
    } else {
      alert(result.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!pack) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Pack non trouvé</p>
        </div>
        <Footer />
      </div>
    )
  }

  const totalPrixIndividuel = pack.livres?.reduce((sum, livre) => sum + livre.prix, 0) || 0
  const economie = totalPrixIndividuel - pack.prix

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Image */}
              <div>
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 relative">
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-full">PACK</span>
                  </div>
                  <img
                    src={pack.couvertureUrl || "/placeholder.svg"}
                    alt={pack.nom}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4 text-balance">{pack.nom}</h1>
                  <p className="text-xl text-gray-600 mb-6">{pack.livres?.length || 0} livres inclus</p>

                  <div className="prose max-w-none mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{pack.description}</p>
                  </div>

                  {/* Livres inclus */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Livres inclus dans ce pack</h3>
                    <div className="space-y-3">
                      {pack.livres?.map((livre) => (
                        <div key={livre._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={livre.couvertureUrl || "/placeholder.svg"}
                            alt={livre.titre}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{livre.titre}</p>
                            <p className="text-sm text-gray-600">{livre.auteur}</p>
                          </div>
                          <span className="text-sm text-gray-500">{formatPrice(livre.prix)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Purchase */}
                <div className="border-t pt-6">
                  {economie > 0 && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-semibold">Économisez {formatPrice(economie)} avec ce pack !</p>
                      <p className="text-sm text-green-700">Prix individuel : {formatPrice(totalPrixIndividuel)}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-bold text-purple-600">{formatPrice(pack.prix)}</span>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
