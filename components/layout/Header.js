"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { usePanier } from "@/contexts/PanierContext"

export default function Header() {
  const { user, logout } = useAuth()
  const { getItemCount } = usePanier()
  const itemCount = getItemCount()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Monde Éveillé</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium transition">
              Accueil
            </Link>
            <Link href="/boutique" className="text-gray-700 hover:text-purple-600 font-medium transition">
              Boutique
            </Link>
            {user && (
              <Link href="/compte/bibliotheque" className="text-gray-700 hover:text-purple-600 font-medium transition">
                Ma Bibliothèque
              </Link>
            )}
          </nav>

          {/* User actions */}
          <div className="flex items-center gap-4">
            <Link href="/panier" className="relative p-2 text-gray-700 hover:text-purple-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/compte"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition"
                >
                  Mon Compte
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/connexion"
                  className="px-4 py-2 text-gray-700 hover:text-purple-600 text-sm font-medium transition"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/inscription"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
