const express = require("express");
const router = express.Router();
const { cartsModel, productsModel } = require("../models/products.model");

router.post("/", async (req, res) => {

  try {
    const result = await cartsModel.create({ products: [] });
    res.send(result);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        error:
          "Ocurrió un error en la validación, puede que el producto no exista o falten parametros (id, quantity requeridos)",
      });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartsModel.findById(cid).populate("products");

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    // Verificar si el carrito existe
    const cart = await cartsModel.findById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Verificar si el producto existe
    const product = await productsModel.findById(pid);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Verificar si el producto ya está en el carrito
    const existingProductIndex = cart.products.findIndex(item => item.productId && item.productId.toString() === pid);

    if (existingProductIndex !== -1) {
      // Si el producto ya existe, incrementar la cantidad
      cart.products[existingProductIndex].quantity += 1;
    } else {
      // Si el producto no existe, agregarlo con cantidad 1
      cart.products.push({ productId: pid, quantity: 1 });
    }

    // Guardar el carrito actualizado en la base de datos
    const updatedCart = await cart.save();

    res.json(updatedCart);
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    // Verificar si el carrito existe
    const cart = await cartsModel.findById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productIdAsString = pid.toString();

    // Verificar si el producto existe en el carrito
    const existingProductIndex = cart.products.findIndex(item => item.productId && item.productId.toString() === productIdAsString);

    if (existingProductIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

    // Eliminar el producto del array 'products' del carrito
    cart.products.splice(existingProductIndex, 1);

    // Guardar el carrito actualizado en la base de datos
    const updatedCart = await cart.save();

    res.json({ result: "success", payload: updatedCart });
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    // Verificar si el carrito existe
    const cart = await cartsModel.findById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Verificar si los productos proporcionados son un arreglo
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: "La propiedad 'products' debe ser un arreglo" });
    }

    // Limpiar el array de productos actual en el carrito
    cart.products = [];

    // Recorrer el nuevo arreglo de productos y agregarlos al carrito
    for (const product of products) {
      const { id, quantity } = product; // Cambiado de productId a id

      // Verificar si el producto existe
      const existingProduct = await productsModel.findById(id); // Cambiado de productId a id

      if (!existingProduct) {
        return res.status(404).json({ error: `Producto con ID ${id} no encontrado` });
      }

      // Agregar el producto al array 'products' del carrito
      cart.products.push({ productId: existingProduct._id, quantity });
    }

    // Guardar el carrito actualizado en la base de datos
    const updatedCart = await cart.save();

    res.json({payload: updatedCart });
  } catch (error) {
    console.error("Error al actualizar el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    // Verificar si el carrito existe
    const cart = await cartsModel.findById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Verificar si el producto existe en el carrito
    const existingProductIndex = cart.products.findIndex(item => item.productId && item.productId.toString() === pid);

    if (existingProductIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

    // Actualizar la cantidad del producto en el carrito
    cart.products[existingProductIndex].quantity = quantity;

    // Guardar el carrito actualizado en la base de datos
    const updatedCart = await cart.save();

    res.json({payload: updatedCart});
  } catch (error) {
    console.error("Error al actualizar la cantidad del producto en el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    // Verificar si el carrito existe
    const cart = await cartsModel.findById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Limpiar el array de productos en el carrito
    cart.products = [];

    // Guardar el carrito actualizado en la base de datos
    const updatedCart = await cart.save();

    res.json({message: "Todos los productos del carrito han sido eliminados", payload: updatedCart });
  } catch (error) {
    console.error("Error al eliminar todos los productos del carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
