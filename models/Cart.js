import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  shopifyCartId: {
    type: String,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);