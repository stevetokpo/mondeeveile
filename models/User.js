import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
    },
    prenom: {
      type: String,
      required: [true, "Le prénom est requis"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email invalide"],
    },
    motDePasse: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    telephone: {
      type: String,
      trim: true,
    },
    dateInscription: {
      type: Date,
      default: Date.now,
    },
    actif: {
      type: Boolean,
      default: true,
    },
    emailVerifie: {
      type: Boolean,
      default: false,
    },
    tokenVerification: String,
    tokenResetPassword: String,
    tokenResetExpiration: Date,
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("motDePasse")) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.motDePasse)
}

export default mongoose.models.User || mongoose.model("User", UserSchema)
