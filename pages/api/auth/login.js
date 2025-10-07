import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { generateToken, createAuthCookie } from "@/lib/auth"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" })
  }

  try {
    await dbConnect()

    const { email, motDePasse } = req.body

    // Validation
    if (!email || !motDePasse) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis",
      })
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      })
    }

    // Check if account is active
    if (!user.actif) {
      return res.status(403).json({
        success: false,
        message: "Compte désactivé",
      })
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(motDePasse)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      })
    }

    // Generate JWT token
    const token = generateToken(user)

    // Set cookie
    res.setHeader("Set-Cookie", createAuthCookie(token))

    return res.status(200).json({
      success: true,
      message: "Connexion réussie",
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
    })
  }
}
