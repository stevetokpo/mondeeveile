"use client"

import { useRouter } from "next/router"
import Link from "next/link"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { usePanier } from "@/contexts/PanierContext"
import { useAuth } from "@/contexts/AuthContext"
import { formatPrice } from "@/lib/utils"

export default function Panier() {
  const router = useRouter()
  const { items, removeItem, getTotal } = usePanier()
  const { user } = useAuth()

  const handleCheckout = () => {
    if (!user) {
      router.push("/auth/connexion?redirect=/paiement")
    } else {
      router.push("/paiement")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Mon Panier</h1>

          {items.length === 0 ? (
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
              <p className="text-gray-600 mb-6">Découvrez nos livres spirituels et commencez votre collection</p>
              <Link
                href="/boutique"
                className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
              >
                Découvrir la boutique
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex gap-6">
                      <div className="relative">
                        <img
                          src={item.couvertureUrl || "/placeholder.svg"}
                          alt={item.nom}
                          className="w-24 h-32 object-cover rounded-lg"
                        />
                        {item.type === "pack" && (
                          <span className="absolute -top-2 -right-2 px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                            PACK
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{item.nom}</h3>
                            {item.type === "livre" && item.auteur && (
                              <p className="text-sm text-gray-600">{item.auteur}</p>
                            )}
                            {item.type === "pack" && item.nombreLivres && (
                              <p className="text-sm text-gray-600">{item.nombreLivres} livres inclus</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id, item.type)}
                            className="text-red-600 hover:text-red-700 p-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <span className="text-2xl font-bold text-purple-600">{formatPrice(item.prix)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé de la commande</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Articles ({items.length})</span>
                      <span>{formatPrice(getTotal())}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span className="text-purple-600">{formatPrice(getTotal())}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition mb-4"
                  >
                    {user ? "Procéder au paiement" : "Se connecter pour commander"}
                  </button>

                  <Link
                    href="/boutique"
                    className="block text-center text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Continuer mes achats
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
