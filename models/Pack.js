import mongoose from "mongoose"

const PackSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom du pack est requis"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La description est requise"],
    },
    prix: {
      type: Number,
      required: [true, "Le prix est requis"],
      min: [0, "Le prix doit être positif"],
    },
    livres: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Livre",
        required: true,
      },
    ],
    couvertureUrl: {
      type: String,
      required: [true, "La couverture est requise"],
    },
    couvertureKey: {
      type: String,
      required: true,
    },
    reduction: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
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
PackSchema.pre("save", function (next) {
  this.dateModification = Date.now()
  next()
})

export default mongoose.models.Pack || mongoose.model("Pack", PackSchema)
