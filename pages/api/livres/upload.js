import { put } from "@vercel/blob"
import { requireAdmin } from "@/lib/auth"

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" })
  }

  try {
    const { filename, contentType } = req.body

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Nom de fichier requis",
      })
    }

    // Generate unique filename
    const uniqueFilename = `${Date.now()}-${filename}`
    const folder = contentType?.includes("pdf") ? "pdfs" : "images"

    // Create a blob URL for client-side upload
    const blob = await put(`${folder}/${uniqueFilename}`, "", {
      access: "public",
      contentType: contentType || "application/octet-stream",
    })

    return res.status(200).json({
      success: true,
      url: blob.url,
      key: blob.pathname,
    })
  } catch (error) {
    console.error("Upload preparation error:", error)
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la préparation de l'upload",
    })
  }
}

export default requireAdmin(handler)

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
}
