import mongoose from "mongoose"

const CommandeSchema = new mongoose.Schema(
  {
    numero: {
      type: String,
      required: true,
      unique: true,
    },
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        type: {
          type: String,
          enum: ["livre", "pack"],
          required: true,
        },
        reference: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "items.type",
          required: true,
        },
        nom: {
          type: String,
          required: true,
        },
        prix: {
          type: Number,
          required: true,
        },
        livresInclus: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Livre",
          },
        ],
      },
    ],
    montantTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    statut: {
      type: String,
      enum: ["en_attente", "paye", "echoue", "annule"],
      default: "en_attente",
    },
    paiement: {
      methode: {
        type: String,
        default: "fedapay",
      },
      transactionId: String,
      fedapayTransactionId: String,
      statut: String,
      datePaiement: Date,
    },
    livresDebloques: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Livre",
      },
    ],
    dateCommande: {
      type: Date,
      default: Date.now,
    },
    dateModification: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Generate unique order number
CommandeSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.model("Commande").countDocuments()
    this.numero = `CMD${Date.now()}${String(count + 1).padStart(4, "0")}`
  }
  this.dateModification = Date.now()
  next()
})

export default mongoose.models.Commande || mongoose.model("Commande", CommandeSchema)
