import dbConnect from "@/lib/mongodb"
import Commande from "@/models/Commande"
import { requireAuth } from "@/lib/auth"
import { verifyTransaction } from "@/lib/fedapay"

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" })
  }

  try {
    await dbConnect()

    const { commandeId } = req.query

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

    // If already paid, return success
    if (commande.statut === "paye") {
      return res.status(200).json({
        success: true,
        statut: "paye",
        commande: {
          numero: commande.numero,
          montantTotal: commande.montantTotal,
        },
      })
    }

    // Verify with FedaPay
    if (commande.paiement.fedapayTransactionId) {
      const verifyResult = await verifyTransaction(commande.paiement.fedapayTransactionId)

      if (verifyResult.success) {
        const transaction = verifyResult.transaction

        // Update order if status changed
        if (transaction.status === "approved" && commande.statut !== "paye") {
          commande.statut = "paye"
          commande.paiement.statut = "approved"
          commande.paiement.datePaiement = new Date()
          await commande.save()
        }

        return res.status(200).json({
          success: true,
          statut: commande.statut,
          commande: {
            numero: commande.numero,
            montantTotal: commande.montantTotal,
          },
        })
      }
    }

    return res.status(200).json({
      success: true,
      statut: commande.statut,
      commande: {
        numero: commande.numero,
        montantTotal: commande.montantTotal,
      },
    })
  } catch (error) {
    console.error("Verify payment error:", error)
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification du paiement",
    })
  }
}

export default requireAuth(handler)
