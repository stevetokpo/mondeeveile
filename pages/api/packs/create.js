import dbConnect from "@/lib/mongodb"
import Pack from "@/models/Pack"
import { requireAdmin } from "@/lib/auth"

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" })
  }

  try {
    await dbConnect()

    const { nom, description, prix, livres, couvertureUrl, couvertureKey, reduction } = req.body

    // Validation
    if (!nom || !description || !prix || !livres || livres.length === 0 || !couvertureUrl) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs obligatoires doivent être remplis",
      })
    }

    const pack = await Pack.create({
      nom,
      description,
      prix: Number.parseFloat(prix),
      livres,
      couvertureUrl,
      couvertureKey,
      reduction: reduction ? Number.parseFloat(reduction) : 0,
      actif: true,
    })

    const populatedPack = await Pack.findById(pack._id).populate("livres")

    return res.status(201).json({
      success: true,
      message: "Pack créé avec succès",
      pack: populatedPack,
    })
  } catch (error) {
    console.error("Create pack error:", error)
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création du pack",
    })
  }
}

export default requireAdmin(handler)
