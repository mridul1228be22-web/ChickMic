import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: '' },
    phone: { type: String, default: '' },
    line1: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zip: { type: String, default: '' },
    country: { type: String, default: '' },
  },
  { _id: false },
)

const userSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    address: { type: addressSchema, default: () => ({}) },
  },
  { timestamps: true },
)

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    uid: this._id.toString(),
    displayName: this.displayName,
    email: this.email,
    address: this.address,
    createdAt: this.createdAt,
  }
}

export const User = mongoose.models.User || mongoose.model('User', userSchema)
