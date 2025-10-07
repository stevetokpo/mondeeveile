import mongoose from "mongoose"

const TelechargementSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    livre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Livre",
      required: true,
    },
    commande: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Commande",
      required: true,
    },
    dateTelechargement: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

// Index for faster queries
TelechargementSchema.index({ utilisateur: 1, livre: 1 })
TelechargementSchema.index({ dateTelechargement: -1 })

export default mongoose.models.Telechargement || mongoose.model("Telechargement", TelechargementSchema)
