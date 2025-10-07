import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { generateToken, createAuthCookie } from "@/lib/auth"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" })
  }

  try {
    await dbConnect()

    const { nom, prenom, email, motDePasse, telephone } = req.body

    // Validation
    if (!nom || !prenom || !email || !motDePasse) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs obligatoires doivent être remplis",
      })
    }

    if (motDePasse.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 6 caractères",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Un compte existe déjà avec cet email",
      })
    }

    // Create new user
    const user = await User.create({
      nom,
      prenom,
      email: email.toLowerCase(),
      motDePasse,
      telephone,
      role: "user",
    })

    // Generate JWT token
    const token = generateToken(user)

    // Set cookie
    res.setHeader("Set-Cookie", createAuthCookie(token))

    return res.status(201).json({
      success: true,
      message: "Compte créé avec succès",
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création du compte",
    })
  }
}
