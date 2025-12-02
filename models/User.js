// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Primary identity in YOUR app
    email: { type: String, unique: true, sparse: true },
    username: { type: String, unique: true, sparse: true },
    passwordHash: { type: String }, // for credentials login

    // OAuth providers (for NextAuth)
    googleId: { type: String },
    githubId: { type: String },

    // Shopify link (external identity)
    shopifyCustomerId: { type: String }, // gid://shopify/Customer/...

    // Optional extras for later
    savedCartId: { type: String }, // Shopify cart id if you want
    wishlist: [
      {
        id: String,
        title: String,
        handle: String,
        image: String,
        variantId: String,
        price: String,
      }
    ],
  },

  { timestamps: true }
);

// Avoid model overwrite in dev
export default mongoose.models.User || mongoose.model("User", UserSchema);