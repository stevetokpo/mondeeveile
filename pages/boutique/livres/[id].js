"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { formatPrice } from "@/lib/utils"
import { usePanier } from "@/contexts/PanierContext"

export default function LivreDetail() {
  const router = useRouter()
  const { id } = router.query
  const [livre, setLivre] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addItem } = usePanier()

  useEffect(() => {
    if (id) {
      fetchLivre()
    }
  }, [id])

  const fetchLivre = async () => {
    try {
      const response = await fetch(`/api/livres/${id}`)
      const data = await response.json()

      if (data.success) {
        setLivre(data.livre)
      }
    } catch (error) {
      console.error("Error fetching livre:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    const result = addItem({
      id: livre._id,
      type: "livre",
      nom: livre.titre,
      prix: livre.prix,
      couvertureUrl: livre.couvertureUrl,
      auteur: livre.auteur,
    })

    if (result.success) {
      alert("Livre ajouté au panier !")
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

  if (!livre) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Livre non trouvé</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Image */}
              <div>
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={livre.couvertureUrl || "/placeholder.svg"}
                    alt={livre.titre}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                    {livre.categorie}
                  </span>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4 text-balance">{livre.titre}</h1>
                  <p className="text-xl text-gray-600 mb-6">Par {livre.auteur}</p>

                  <div className="flex items-center gap-6 mb-8 text-sm text-gray-600">
                    {livre.nombrePages && (
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>{livre.nombrePages} pages</span>
                      </div>
                    )}
                    {livre.taille && (
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{livre.taille}</span>
                      </div>
                    )}
                  </div>

                  <div className="prose max-w-none mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{livre.description}</p>
                  </div>
                </div>

                {/* Purchase */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-bold text-purple-600">{formatPrice(livre.prix)}</span>
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
