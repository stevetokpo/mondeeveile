import Link from "next/link"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-6 text-balance">
                Éveillez votre conscience avec nos livres spirituels
              </h1>
              <p className="text-xl text-purple-100 mb-8 text-pretty">
                Découvrez une collection unique de livres numériques sur la spiritualité, l'éveil et la connaissance de
                la vérité. Accès instantané après achat.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/boutique"
                  className="px-8 py-4 bg-white text-purple-700 font-semibold rounded-lg hover:bg-purple-50 transition">
                  Découvrir la boutique
                </Link>
                <Link
                  href="/auth/inscription"
                  className="px-8 py-4 bg-purple-800 text-white font-semibold rounded-lg hover:bg-purple-900 transition">
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div
                  className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Livres Numériques</h3>
                <p className="text-gray-600">Téléchargez vos livres en PDF et lisez-les sur tous vos appareils</p>
              </div>

              <div className="text-center">
                <div
                  className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Accès Instantané</h3>
                <p className="text-gray-600">Recevez vos livres immédiatement après le paiement</p>
              </div>

              <div className="text-center">
                <div
                  className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Paiement Sécurisé</h3>
                <p className="text-gray-600">Payez en toute sécurité avec Mobile Money ou carte bancaire</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-purple-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Prêt à commencer votre voyage spirituel ?</h2>
            <p className="text-xl text-gray-600 mb-8">Rejoignez des milliers de lecteurs en quête d'éveil</p>
            <Link
              href="/boutique"
              className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition">
              Explorer la boutique
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
