import dbConnect from "@/lib/mongodb"
import Commande from "@/models/Commande"
import User from "@/models/User"
import { requireAuth } from "@/lib/auth"
import { createTransaction, generatePaymentToken } from "@/lib/fedapay"

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" })
  }

  try {
    await dbConnect()

    const { commandeId } = req.body

    if (!commandeId) {
      return res.status(400).json({
        success: false,
        message: "ID de commande requis",
      })
    }

    // Get order
    const commande = await Commande.findById(commandeId)

    if (!commande) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée",
      })
    }

    // Verify order belongs to user
    if (commande.utilisateur.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé",
      })
    }

    // Check if already paid
    if (commande.statut === "paye") {
      return res.status(400).json({
        success: false,
        message: "Cette commande a déjà été payée",
      })
    }

    // Get user info
    const user = await User.findById(req.user.id)

    // Create FedaPay transaction
    const transactionResult = await createTransaction({
      amount: commande.montantTotal,
      description: `Commande ${commande.numero} - Monde Éveillé`,
      customer: {
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone || "",
      },
      orderId: commande._id.toString(),
    })

    if (!transactionResult.success) {
      return res.status(500).json({
        success: false,
        message: transactionResult.error || "Erreur lors de la création du paiement",
      })
    }

    // Generate payment token
    const tokenResult = await generatePaymentToken(transactionResult.transaction.id)

    if (!tokenResult.success) {
      return res.status(500).json({
        success: false,
        message: tokenResult.error || "Erreur lors de la génération du token",
      })
    }

    // Update order with transaction info
    commande.paiement.transactionId = transactionResult.transaction.id
    commande.paiement.fedapayTransactionId = transactionResult.transaction.id
    await commande.save()

    return res.status(200).json({
      success: true,
      paymentUrl: tokenResult.url,
      token: tokenResult.token,
      transactionId: transactionResult.transaction.id,
    })
  } catch (error) {
    console.error("Initiate payment error:", error)
    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'initiation du paiement",
    })
  }
}

export default requireAuth(handler)
