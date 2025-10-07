"use client"

import { useEffect, useState } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function Bibliotheque() {
  const [livres, setLivres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBibliotheque()
  }, [])

  const fetchBibliotheque = async () => {
    try {
      const response = await fetch("/api/bibliotheque")
      const data = await response.json()

      if (data.success) {
        setLivres(data.livres)
      }
    } catch (error) {
      console.error("Error fetching library:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (livreId, titre) => {
    try {
      const response = await fetch(`/api/telechargement/${livreId}`)
      const data = await response.json()

      if (data.success) {
        // Open download URL in new tab
        window.open(data.downloadUrl, "_blank")
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error("Download error:", error)
      alert("Erreur lors du téléchargement")
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Ma Bibliothèque</h1>
              <p className="text-lg text-gray-600">Tous vos livres achetés en un seul endroit</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement...</p>
              </div>
            ) : livres.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <svg
                  className="w-24 h-24 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre bibliothèque est vide</h2>
                <p className="text-gray-600 mb-6">Commencez par acheter votre premier livre spirituel</p>
                <a
                  href="/boutique"
                  className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
                >
                  Découvrir la boutique
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {livres.map((livre) => (
                  <div key={livre._id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                    <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={livre.couvertureUrl || "/placeholder.svg"}
                        alt={livre.titre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{livre.titre}</h3>
                      <p className="text-sm text-gray-600 mb-3">{livre.auteur}</p>

                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                        {livre.nombrePages && <span>{livre.nombrePages} pages</span>}
                        {livre.nombrePages && livre.taille && <span>•</span>}
                        {livre.taille && <span>{livre.taille}</span>}
                      </div>

                      <button
                        onClick={() => handleDownload(livre._id, livre.titre)}
                        className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Télécharger
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
