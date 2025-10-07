import dbConnect from "@/lib/mongodb"
import Pack from "@/models/Pack"
import { getUserFromRequest } from "@/lib/auth"
import { deleteFile } from "@/lib/vercelBlob"

export default async function handler(req, res) {
  await dbConnect()

  const { id } = req.query

  if (req.method === "GET") {
    try {
      const pack = await Pack.findById(id).populate("livres")

      if (!pack) {
        return res.status(404).json({
          success: false,
          message: "Pack non trouvé",
        })
      }

      return res.status(200).json({
        success: true,
        pack,
      })
    } catch (error) {
      console.error("Get pack error:", error)
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération du pack",
      })
    }
  }

  if (req.method === "PUT") {
    const user = getUserFromRequest(req)
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Accès refusé",
      })
    }

    try {
      const pack = await Pack.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      }).populate("livres")

      if (!pack) {
        return res.status(404).json({
          success: false,
          message: "Pack non trouvé",
        })
      }

      return res.status(200).json({
        success: true,
        message: "Pack mis à jour avec succès",
        pack,
      })
    } catch (error) {
      console.error("Update pack error:", error)
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour du pack",
      })
    }
  }

  if (req.method === "DELETE") {
    const user = getUserFromRequest(req)
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Accès refusé",
      })
    }

    try {
      const pack = await Pack.findById(id)

      if (!pack) {
        return res.status(404).json({
          success: false,
          message: "Pack non trouvé",
        })
      }

      // Delete cover image from Vercel Blob
      if (pack.couvertureUrl) {
        await deleteFile(pack.couvertureUrl)
      }

      await Pack.findByIdAndDelete(id)

      return res.status(200).json({
        success: true,
        message: "Pack supprimé avec succès",
      })
    } catch (error) {
      console.error("Delete pack error:", error)
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression du pack",
      })
    }
  }

  return res.status(405).json({ success: false, message: "Méthode non autorisée" })
}
