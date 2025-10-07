import { removeAuthCookie } from "@/lib/auth"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" })
  }

  try {
    // Remove auth cookie
    res.setHeader("Set-Cookie", removeAuthCookie())

    return res.status(200).json({
      success: true,
      message: "Déconnexion réussie",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la déconnexion",
    })
  }
}
