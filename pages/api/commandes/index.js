import dbConnect from "@/lib/mongodb"
import Commande from "@/models/Commande"
import { requireAuth } from "@/lib/auth"

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" })
  }

  try {
    await dbConnect()

    // Get user's orders
    const commandes = await Commande.find({ utilisateur: req.user.id })
      .sort({ dateCommande: -1 })
      .select("-livresDebloques")

    return res.status(200).json({
      success: true,
      commandes,
    })
  } catch (error) {
    console.error("Get orders error:", error)
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des commandes",
    })
  }
}

export default requireAuth(handler)
