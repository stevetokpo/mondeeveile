import dbConnect from "@/lib/mongodb"
import Commande from "@/models/Commande"
import { requireAuth } from "@/lib/auth"

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" })
  }

  try {
    await dbConnect()

    const { id } = req.query

    // Get order
    const commande = await Commande.findById(id).populate("livresDebloques")

    if (!commande) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée",
      })
    }

    // Verify order belongs to user
    if (commande.utilisateur.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé",
      })
    }

    return res.status(200).json({
      success: true,
      commande,
    })
  } catch (error) {
    console.error("Get order error:", error)
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la commande",
    })
  }
}

export default requireAuth(handler)
