import dbConnect from "@/lib/mongodb"
import Commande from "@/models/Commande"
import Livre from "@/models/Livre"
import Telechargement from "@/models/Telechargement"
import { requireAuth } from "@/lib/auth"

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" })
  }

  try {
    await dbConnect()

    const { id } = req.query

    // Get book
    const livre = await Livre.findById(id)

    if (!livre) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé",
      })
    }

    // Check if user has purchased this book
    const commande = await Commande.findOne({
      utilisateur: req.user.id,
      statut: "paye",
      livresDebloques: id,
    })

    if (!commande) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas accès à ce livre",
      })
    }

    // Log download
    await Telechargement.create({
      utilisateur: req.user.id,
      livre: id,
      commande: commande._id,
      ipAddress: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    })

    // Return the PDF URL directly
    // In production with Vercel Blob, you would generate a signed URL with expiration
    return res.status(200).json({
      success: true,
      downloadUrl: livre.fichierPdfUrl,
      livre: {
        titre: livre.titre,
        auteur: livre.auteur,
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return res.status(500).json({
      success: false,
      message: "Erreur lors du téléchargement",
    })
  }
}

export default requireAuth(handler)
