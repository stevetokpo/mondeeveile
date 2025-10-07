"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ProtectedRoute from "@/components/ProtectedRoute"
import { usePanier } from "@/contexts/PanierContext"
import { formatPrice } from "@/lib/utils"

export default function Paiement() {
  const router = useRouter()
  const { items, getTotal, clearCart } = usePanier()
  const [loading, setLoading] = useState(false)
  const [commandeId, setCommandeId] = useState(null)

  useEffect(() => {
    if (items.length === 0 && !commandeId) {
      router.push("/panier")
    }
  }, [items, commandeId, router])

  const handlePayment = async () => {
    setLoading(true)

    try {
      // Create order
      const orderResponse = await fetch("/api/commandes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        alert(orderData.message)
        setLoading(false)
        return
      }

      setCommandeId(orderData.commande.id)

      // Initiate FedaPay payment
      const paymentResponse = await fetch("/api/paiement/initier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commandeId: orderData.commande.id }),
      })

      const paymentData = await paymentResponse.json()

      if (!paymentData.success) {
        alert(paymentData.message)
        setLoading(false)
        return
      }

      // Clear cart before redirect
      clearCart()

      // Redirect to FedaPay payment page
      window.location.href = paymentData.paymentUrl
    } catch (error) {
      console.error("Payment error:", error)
      alert("Erreur lors du paiement")
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Paiement</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order summary */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif de la commande</h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="flex gap-4">
                      <img
                        src={item.couvertureUrl || "/placeholder.svg"}
                        alt={item.nom}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.nom}</p>
                        {item.type === "pack" && <p className="text-sm text-gray-600">{item.nombreLivres} livres</p>}
                        <p className="text-sm font-semibold text-purple-600 mt-1">{formatPrice(item.prix)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-purple-600">{formatPrice(getTotal())}</span>
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Méthode de paiement</h2>

                <div className="mb-6">
                  <div className="border-2 border-purple-600 rounded-lg p-4 bg-purple-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">FedaPay</p>
                        <p className="text-sm text-gray-600">Mobile Money & Cartes bancaires</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Paiement sécurisé via FedaPay. Accepte MTN Mobile Money, Moov Money et cartes bancaires.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Comment ça marche ?</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Cliquez sur "Payer"</li>
                        <li>Vous serez redirigé vers FedaPay</li>
                        <li>Choisissez votre méthode de paiement</li>
                        <li>Accédez immédiatement à vos livres</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Redirection vers FedaPay..." : `Payer ${formatPrice(getTotal())}`}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  En cliquant sur "Payer", vous acceptez nos conditions générales de vente
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
