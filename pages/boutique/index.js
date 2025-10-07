"use client"

import { useState, useEffect } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import LivreCard from "@/components/boutique/LivreCard"
import PackCard from "@/components/boutique/PackCard"

export default function Boutique() {
  const [livres, setLivres] = useState([])
  const [packs, setPacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("tous")
  const [categorie, setCategorie] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [livresRes, packsRes] = await Promise.all([fetch("/api/livres?actif=true"), fetch("/api/packs?actif=true")])

      const livresData = await livresRes.json()
      const packsData = await packsRes.json()

      if (livresData.success) setLivres(livresData.livres)
      if (packsData.success) setPacks(packsData.packs)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLivres = categorie ? livres.filter((livre) => livre.categorie === categorie) : livres

  const categories = [
    { value: "", label: "Toutes les catégories" },
    { value: "spiritualite", label: "Spiritualité" },
    { value: "eveil", label: "Éveil" },
    { value: "meditation", label: "Méditation" },
    { value: "sagesse", label: "Sagesse" },
    { value: "connaissance", label: "Connaissance" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Boutique</h1>
            <p className="text-lg text-gray-600">Découvrez nos livres spirituels et nos packs à prix avantageux</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("tous")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === "tous" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilter("livres")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === "livres" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Livres
                </button>
                <button
                  onClick={() => setFilter("packs")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === "packs" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Packs
                </button>
              </div>

              {filter !== "packs" && (
                <select
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          ) : (
            <>
              {/* Packs Section */}
              {(filter === "tous" || filter === "packs") && packs.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Packs à prix avantageux</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {packs.map((pack) => (
                      <PackCard key={pack._id} pack={pack} />
                    ))}
                  </div>
                </div>
              )}

              {/* Livres Section */}
              {(filter === "tous" || filter === "livres") && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {filter === "livres" ? "Tous les livres" : "Livres individuels"}
                  </h2>
                  {filteredLivres.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl">
                      <p className="text-gray-600">Aucun livre disponible pour le moment</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {filteredLivres.map((livre) => (
                        <LivreCard key={livre._id} livre={livre} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
