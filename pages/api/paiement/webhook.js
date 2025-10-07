import dbConnect from "@/lib/mongodb"
import Commande from "@/models/Commande"
import { verifyWebhookSignature } from "@/lib/fedapay"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" })
  }

  try {
    await dbConnect()

    // Verify webhook signature
    const signature = req.headers["x-fedapay-signature"]
    if (!verifyWebhookSignature(req.body, signature)) {
      console.error("Invalid webhook signature")
      return res.status(401).json({ success: false, message: "Signature invalide" })
    }

    const { entity, event } = req.body

    // Handle transaction.approved event
    if (event === "transaction.approved" && entity?.transaction) {
      const transaction = entity.transaction
      const orderId = transaction.custom_metadata?.order_id

      if (!orderId) {
        console.error("No order ID in webhook")
        return res.status(400).json({ success: false, message: "Order ID manquant" })
      }

      // Find and update order
      const commande = await Commande.findById(orderId)

      if (!commande) {
        console.error("Order not found:", orderId)
        return res.status(404).json({ success: false, message: "Commande non trouvée" })
      }

      // Update order status
      commande.statut = "paye"
      commande.paiement.statut = "approved"
      commande.paiement.datePaiement = new Date()
      await commande.save()

      console.log(`Order ${commande.numero} marked as paid`)

      // TODO: Send confirmation email here

      return res.status(200).json({ success: true, message: "Paiement confirmé" })
    }

    // Handle transaction.canceled event
    if (event === "transaction.canceled" && entity?.transaction) {
      const transaction = entity.transaction
      const orderId = transaction.custom_metadata?.order_id

      if (orderId) {
        const commande = await Commande.findById(orderId)
        if (commande) {
          commande.statut = "annule"
          commande.paiement.statut = "canceled"
          await commande.save()
        }
      }

      return res.status(200).json({ success: true, message: "Paiement annulé" })
    }

    // Handle transaction.declined event
    if (event === "transaction.declined" && entity?.transaction) {
      const transaction = entity.transaction
      const orderId = transaction.custom_metadata?.order_id

      if (orderId) {
        const commande = await Commande.findById(orderId)
        if (commande) {
          commande.statut = "echoue"
          commande.paiement.statut = "declined"
          await commande.save()
        }
      }

      return res.status(200).json({ success: true, message: "Paiement échoué" })
    }

    return res.status(200).json({ success: true, message: "Webhook reçu" })
  } catch (error) {
    console.error("Webhook error:", error)
    return res.status(500).json({ success: false, message: "Erreur webhook" })
  }
}

export const config = {
  api: {
    bodyParser: {
      verify: (req, res, buf) => {
        req.rawBody = buf.toString()
      },
    },
  },
}
