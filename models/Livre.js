import mongoose from "mongoose"

const LivreSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, "Le titre est requis"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La description est requise"],
    },
    auteur: {
      type: String,
      required: [true, "L'auteur est requis"],
      trim: true,
    },
    prix: {
      type: Number,
      required: [true, "Le prix est requis"],
      min: [0, "Le prix doit être positif"],
    },
    fichierPdfUrl: {
      type: String,
      required: [true, "Le fichier PDF est requis"],
    },
    fichierPdfKey: {
      type: String,
      required: true,
    },
    couvertureUrl: {
      type: String,
      required: [true, "La couverture est requise"],
    },
    couvertureKey: {
      type: String,
      required: true,
    },
    categorie: {
      type: String,
      enum: ["spiritualite", "eveil", "meditation", "sagesse", "connaissance", "autre"],
      default: "spiritualite",
    },
    nombrePages: {
      type: Number,
      min: 1,
    },
    taille: {
      type: String,
    },
    actif: {
      type: Boolean,
      default: true,
    },
    dateCreation: {
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

// Update dateModification on save
LivreSchema.pre("save", function (next) {
  this.dateModification = Date.now()
  next()
})

export default mongoose.models.Livre || mongoose.model("Livre", LivreSchema)
