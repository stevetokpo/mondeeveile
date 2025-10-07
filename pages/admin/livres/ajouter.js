"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import AdminLayout from "@/components/layout/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import { put } from "@vercel/blob"

export default function AjouterLivre() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    auteur: "",
    prix: "",
    categorie: "spiritualite",
    nombrePages: "",
  })
  const [pdfFile, setPdfFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload PDF
      if (!pdfFile) {
        alert("Veuillez sélectionner un fichier PDF")
        setLoading(false)
        return
      }

      const pdfBlob = await put(`pdfs/${Date.now()}-${pdfFile.name}`, pdfFile, {
        access: "public",
      })

      // Upload cover
      if (!coverFile) {
        alert("Veuillez sélectionner une image de couverture")
        setLoading(false)
        return
      }

      const coverBlob = await put(`images/${Date.now()}-${coverFile.name}`, coverFile, {
        access: "public",
      })

      // Create livre
      const response = await fetch("/api/livres/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fichierPdfUrl: pdfBlob.url,
          fichierPdfKey: pdfBlob.pathname,
          couvertureUrl: coverBlob.url,
          couvertureKey: coverBlob.pathname,
          taille: `${(pdfFile.size / 1024 / 1024).toFixed(2)} MB`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert("Livre créé avec succès")
        router.push("/admin/livres")
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error("Error creating livre:", error)
      alert("Erreur lors de la création du livre")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Ajouter un livre</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auteur *</label>
                <input
                  type="text"
                  name="auteur"
                  value={formData.auteur}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prix (FCFA) *</label>
                <input
                  type="number"
                  name="prix"
                  value={formData.prix}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                <select
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="spiritualite">Spiritualité</option>
                  <option value="eveil">Éveil</option>
                  <option value="meditation">Méditation</option>
                  <option value="sagesse">Sagesse</option>
                  <option value="connaissance">Connaissance</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de pages</label>
                <input
                  type="number"
                  name="nombrePages"
                  value={formData.nombrePages}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fichier PDF *</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image de couverture *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files[0])}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Création en cours..." : "Créer le livre"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
}
