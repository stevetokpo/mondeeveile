import dbConnect from "@/lib/mongodb"
import Livre from "@/models/Livre"
import { requireAdmin } from "@/lib/auth"

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" })
  }

  try {
    await dbConnect()

    const {
      titre,
      description,
      auteur,
      prix,
      fichierPdfUrl,
      fichierPdfKey,
      couvertureUrl,
      couvertureKey,
      categorie,
      nombrePages,
      taille,
    } = req.body

    // Validation
    if (!titre || !description || !auteur || !prix || !fichierPdfUrl || !couvertureUrl) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs obligatoires doivent être remplis",
      })
    }

    const livre = await Livre.create({
      titre,
      description,
      auteur,
      prix: Number.parseFloat(prix),
      fichierPdfUrl,
      fichierPdfKey,
      couvertureUrl,
      couvertureKey,
      categorie,
      nombrePages: nombrePages ? Number.parseInt(nombrePages) : undefined,
      taille,
      actif: true,
    })

    return res.status(201).json({
      success: true,
      message: "Livre créé avec succès",
      livre,
    })
  } catch (error) {
    console.error("Create livre error:", error)
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création du livre",
    })
  }
}

export default requireAdmin(handler)
