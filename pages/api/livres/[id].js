import dbConnect from "@/lib/mongodb"
import Livre from "@/models/Livre"
import { getUserFromRequest } from "@/lib/auth"
import { deleteFile } from "@/lib/vercelBlob"

async function handler(req, res) {
  await dbConnect()

  const { id } = req.query

  if (req.method === "GET") {
    try {
      const livre = await Livre.findById(id)

      if (!livre) {
        return res.status(404).json({
          success: false,
          message: "Livre non trouvé",
        })
      }

      return res.status(200).json({
        success: true,
        livre,
      })
    } catch (error) {
      console.error("Get livre error:", error)
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération du livre",
      })
    }
  }

  if (req.method === "PUT") {
    // Check admin
    const user = getUserFromRequest(req)
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Accès refusé",
      })
    }

    try {
      const livre = await Livre.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      })

      if (!livre) {
        return res.status(404).json({
          success: false,
          message: "Livre non trouvé",
        })
      }

      return res.status(200).json({
        success: true,
        message: "Livre mis à jour avec succès",
        livre,
      })
    } catch (error) {
      console.error("Update livre error:", error)
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour du livre",
      })
    }
  }

  if (req.method === "DELETE") {
    // Check admin
    const user = getUserFromRequest(req)
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Accès refusé",
      })
    }

    try {
      const livre = await Livre.findById(id)

      if (!livre) {
        return res.status(404).json({
          success: false,
          message: "Livre non trouvé",
        })
      }

      // Delete files from Vercel Blob
      if (livre.fichierPdfUrl) {
        await deleteFile(livre.fichierPdfUrl)
      }
      if (livre.couvertureUrl) {
        await deleteFile(livre.couvertureUrl)
      }

      await Livre.findByIdAndDelete(id)

      return res.status(200).json({
        success: true,
        message: "Livre supprimé avec succès",
      })
    } catch (error) {
      console.error("Delete livre error:", error)
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression du livre",
      })
    }
  }

  return res.status(405).json({ success: false, message: "Méthode non autorisée" })
}

export default handler
