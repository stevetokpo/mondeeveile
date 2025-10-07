import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">Monde Éveillé</h3>
            <p className="text-gray-400 text-sm">
              Votre bibliothèque spirituelle pour l'éveil et la connaissance de la vérité.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="text-gray-400 hover:text-white transition">
                  Boutique
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-4">Compte</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/connexion" className="text-gray-400 hover:text-white transition">
                  Connexion
                </Link>
              </li>
              <li>
                <Link href="/auth/inscription" className="text-gray-400 hover:text-white transition">
                  Inscription
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400 text-sm">Email: contact@monde-eveille.com</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Monde Éveillé. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
