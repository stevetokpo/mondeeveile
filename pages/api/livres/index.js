import dbConnect from "@/lib/mongodb"
import Livre from "@/models/Livre"

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === "GET") {
    try {
      const { actif, categorie } = req.query

      const filter = {}
      if (actif !== undefined) filter.actif = actif === "true"
      if (categorie) filter.categorie = categorie

      const livres = await Livre.find(filter).sort({ dateCreation: -1 })

      return res.status(200).json({
        success: true,
        livres,
      })
    } catch (error) {
      console.error("Get livres error:", error)
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des livres",
      })
    }
  }

  return res.status(405).json({ success: false, message: "Méthode non autorisée" })
}
