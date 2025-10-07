"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import AdminLayout from "@/components/layout/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import { formatPrice } from "@/lib/utils"

export default function AdminLivres() {
  const [livres, setLivres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLivres()
  }, [])

  const fetchLivres = async () => {
    try {
      const response = await fetch("/api/livres")
      const data = await response.json()
      if (data.success) {
        setLivres(data.livres)
      }
    } catch (error) {
      console.error("Error fetching livres:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) return

    try {
      const response = await fetch(`/api/livres/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        alert("Livre supprimé avec succès")
        fetchLivres()
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error("Error deleting livre:", error)
      alert("Erreur lors de la suppression")
    }
  }

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des livres</h1>
            <Link
              href="/admin/livres/ajouter"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
            >
              + Ajouter un livre
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            </div>
          ) : livres.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-600 mb-4">Aucun livre pour le moment</p>
              <Link
                href="/admin/livres/ajouter"
                className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
              >
                Ajouter votre premier livre
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Livre</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Auteur</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Catégorie</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Prix</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {livres.map((livre) => (
                    <tr key={livre._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={livre.couvertureUrl || "/placeholder.svg"}
                            alt={livre.titre}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{livre.titre}</p>
                            <p className="text-sm text-gray-500">{livre.taille}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{livre.auteur}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          {livre.categorie}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(livre.prix)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            livre.actif ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {livre.actif ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/livres/${livre._id}/modifier`}
                            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm transition"
                          >
                            Modifier
                          </Link>
                          <button
                            onClick={() => handleDelete(livre._id)}
                            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm transition"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
