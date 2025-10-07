import dbConnect from "@/lib/mongodb"
import Commande from "@/models/Commande"
import Livre from "@/models/Livre"
import Pack from "@/models/Pack"
import { requireAuth } from "@/lib/auth"

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" })
  }

  try {
    await dbConnect()

    const { items } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Le panier est vide",
      })
    }

    // Process items and calculate total
    const processedItems = []
    let montantTotal = 0
    const livresDebloques = new Set()

    for (const item of items) {
      if (item.type === "livre") {
        const livre = await Livre.findById(item.id)
        if (!livre || !livre.actif) {
          return res.status(400).json({
            success: false,
            message: `Le livre "${item.nom}" n'est plus disponible`,
          })
        }

        processedItems.push({
          type: "livre",
          reference: livre._id,
          nom: livre.titre,
          prix: livre.prix,
          livresInclus: [livre._id],
        })

        montantTotal += livre.prix
        livresDebloques.add(livre._id.toString())
      } else if (item.type === "pack") {
        const pack = await Pack.findById(item.id).populate("livres")
        if (!pack || !pack.actif) {
          return res.status(400).json({
            success: false,
            message: `Le pack "${item.nom}" n'est plus disponible`,
          })
        }

        processedItems.push({
          type: "pack",
          reference: pack._id,
          nom: pack.nom,
          prix: pack.prix,
          livresInclus: pack.livres.map((l) => l._id),
        })

        montantTotal += pack.prix
        pack.livres.forEach((livre) => livresDebloques.add(livre._id.toString()))
      }
    }

    // Create order
    const commande = await Commande.create({
      utilisateur: req.user.id,
      items: processedItems,
      montantTotal,
      statut: "en_attente",
      livresDebloques: Array.from(livresDebloques),
    })

    return res.status(201).json({
      success: true,
      message: "Commande créée avec succès",
      commande: {
        id: commande._id,
        numero: commande.numero,
        montantTotal: commande.montantTotal,
      },
    })
  } catch (error) {
    console.error("Create order error:", error)
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la commande",
    })
  }
}

export default requireAuth(handler)
