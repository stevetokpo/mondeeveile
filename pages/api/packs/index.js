import dbConnect from "@/lib/mongodb"
import Pack from "@/models/Pack"

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === "GET") {
    try {
      const { actif } = req.query

      const filter = {}
      if (actif !== undefined) filter.actif = actif === "true"

      const packs = await Pack.find(filter).populate("livres").sort({ dateCreation: -1 })

      return res.status(200).json({
        success: true,
        packs,
      })
    } catch (error) {
      console.error("Get packs error:", error)
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des packs",
      })
    }
  }

  return res.status(405).json({ success: false, message: "Méthode non autorisée" })
}
