import dbConnect from "@/lib/mongodb"
import Commande from "@/models/Commande"
import Livre from "@/models/Livre"
import { requireAuth } from "@/lib/auth"

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" })
  }

  try {
    await dbConnect()

    // Get all paid orders for user
    const commandes = await Commande.find({
      utilisateur: req.user.id,
      statut: "paye",
    }).select("livresDebloques")

    // Collect all unique book IDs
    const livreIds = new Set()
    commandes.forEach((commande) => {
      commande.livresDebloques.forEach((livreId) => {
        livreIds.add(livreId.toString())
      })
    })

    // Get book details
    const livres = await Livre.find({
      _id: { $in: Array.from(livreIds) },
    }).select("-fichierPdfKey")

    return res.status(200).json({
      success: true,
      livres,
    })
  } catch (error) {
    console.error("Get library error:", error)
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la bibliothèque",
    })
  }
}

export default requireAuth(handler)
