"use client"

import { useEffect, useState } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ProtectedRoute from "@/components/ProtectedRoute"
import { formatPrice, formatDate } from "@/lib/utils"

export default function Commandes() {
  const [commandes, setCommandes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCommandes()
  }, [])

  const fetchCommandes = async () => {
    try {
      const response = await fetch("/api/commandes")
      const data = await response.json()

      if (data.success) {
        setCommandes(data.commandes)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (statut) => {
    const styles = {
      paye: "bg-green-100 text-green-700",
      en_attente: "bg-yellow-100 text-yellow-700",
      echoue: "bg-red-100 text-red-700",
      annule: "bg-gray-100 text-gray-700",
    }

    const labels = {
      paye: "Payé",
      en_attente: "En attente",
      echoue: "Échoué",
      annule: "Annulé",
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[statut] || styles.en_attente}`}>
        {labels[statut] || statut}
      </span>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Mes Commandes</h1>
              <p className="text-lg text-gray-600">Historique de tous vos achats</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement...</p>
              </div>
            ) : commandes.length === 0 ? (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucune commande</h2>
                <p className="text-gray-600 mb-6">Vous n'avez pas encore effectué d'achat</p>
                <a
                  href="/boutique"
                  className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
                >
                  Découvrir la boutique
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {commandes.map((commande) => (
                  <div key={commande._id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Commande {commande.numero}</h3>
                        <p className="text-sm text-gray-600">{formatDate(commande.dateCommande)}</p>
                      </div>
                      {getStatusBadge(commande.statut)}
                    </div>

                    <div className="space-y-3 mb-4">
                      {commande.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <div
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              item.type === "pack" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {item.type === "pack" ? "PACK" : "LIVRE"}
                          </div>
                          <span className="flex-1 text-gray-900">{item.nom}</span>
                          <span className="text-gray-600">{formatPrice(item.prix)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 flex items-center justify-between">
                      <span className="text-gray-600">Total</span>
                      <span className="text-xl font-bold text-purple-600">{formatPrice(commande.montantTotal)}</span>
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
