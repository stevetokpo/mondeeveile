"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/layout/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    livres: 0,
    packs: 0,
    commandes: 0,
    revenus: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [livresRes, packsRes] = await Promise.all([fetch("/api/livres"), fetch("/api/packs")])

      const livresData = await livresRes.json()
      const packsData = await packsRes.json()

      setStats({
        livres: livresData.livres?.length || 0,
        packs: packsData.packs?.length || 0,
        commandes: 0,
        revenus: 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const statCards = [
    { label: "Livres", value: stats.livres, icon: "📚", color: "bg-blue-500" },
    { label: "Packs", value: stats.packs, icon: "📦", color: "bg-green-500" },
    { label: "Commandes", value: stats.commandes, icon: "🛒", color: "bg-purple-500" },
    { label: "Revenus", value: `${stats.revenus} FCFA`, icon: "💰", color: "bg-yellow-500" },
  ]

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Bienvenue dans l'administration</h2>
            <p className="text-gray-600">
              Utilisez le menu de gauche pour gérer vos livres, packs, commandes et consulter les statistiques.
            </p>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
