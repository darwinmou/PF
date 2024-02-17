const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: { type: Number, required: true }
      }
    ]
  });

  const cartsModel = mongoose.model("carts", cartSchema);

  module.exports = cartsModel ;