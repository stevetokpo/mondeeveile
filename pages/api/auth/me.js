import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { requireAuth } from "@/lib/auth"

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" })
  }

  try {
    await dbConnect()

    // Get user from database
    const user = await User.findById(req.user.id).select("-motDePasse")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      })
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        telephone: user.telephone,
        dateInscription: user.dateInscription,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des données",
    })
  }
}

export default requireAuth(handler)
