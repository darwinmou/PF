const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  category: { type: String, require: true },
  code: { type: String, require: true },
  status: { type: String, require: true },
  image: { type: String, require: true },
  price: { type: Number, require: true },
  stock: { type: Number, require: true }
});

const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        // required: true
      },
      quantity: { type: Number, required: true }
    }
  ]
});

const productsModel = mongoose.model("products", productSchema);
const cartsModel = mongoose.model("carts", cartSchema);

module.exports = { productsModel, cartsModel };
