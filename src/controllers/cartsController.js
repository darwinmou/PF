// cartsController.js

const cartsModel = require('../models/cartsModel');
const productsModel = require('../models/productsModel');
const ticketsModel = require("../models/tickets.model")

// Controlador para crear un carrito vacío
exports.createEmptyCart = async (req, res) => {
  try {
    const result = await cartsModel.create({ products: [] });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        'Ocurrió un error en la validación, puede que el producto no exista o falten parametros (id, quantity requeridos)',
    });
  }
};

exports.getCartById = async (req, res) => {
    try {
      const { cid } = req.params;
  
      const cart = await cartsModel.findById(cid).populate('products');
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  exports.addProductToCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
  
      // Verificar si el carrito existe
      const cart = await cartsModel.findById(cid);
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      // Verificar si el producto existe
      const product = await productsModel.findById(pid);
  
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      // Verificar si el producto ya está en el carrito
      const existingProductIndex = cart.products.findIndex(
        (item) => item.productId && item.productId.toString() === pid
      );
  
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
      console.error('Error al agregar producto al carrito:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  exports.removeProductFromCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
  
      // Verificar si el carrito existe
      const cart = await cartsModel.findById(cid);
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      const productIdAsString = pid.toString();
  
      // Verificar si el producto existe en el carrito
      const existingProductIndex = cart.products.findIndex(
        (item) => item.productId && item.productId.toString() === productIdAsString
      );
  
      if (existingProductIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
      }
  
      // Eliminar el producto del array 'products' del carrito
      cart.products.splice(existingProductIndex, 1);
  
      // Guardar el carrito actualizado en la base de datos
      const updatedCart = await cart.save();
  
      res.json({ result: 'success', payload: updatedCart });
    } catch (error) {
      console.error('Error al eliminar producto del carrito:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  exports.updateCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const { products } = req.body;
  
      // Verificar si el carrito existe
      const cart = await cartsModel.findById(cid);
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
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
  
      res.json({ payload: updatedCart });
    } catch (error) {
      console.error('Error al actualizar el carrito:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  exports.updateProductQuantity = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
  
      // Verificar si el carrito existe
      const cart = await cartsModel.findById(cid);
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      // Verificar si el producto existe en el carrito
      const existingProductIndex = cart.products.findIndex(item => item.productId && item.productId.toString() === pid);
  
      if (existingProductIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
      }
  
      // Actualizar la cantidad del producto en el carrito
      cart.products[existingProductIndex].quantity = quantity;
  
      // Guardar el carrito actualizado en la base de datos
      const updatedCart = await cart.save();
  
      res.json({ payload: updatedCart });
    } catch (error) {
      console.error('Error al actualizar la cantidad del producto en el carrito:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  exports.deleteAllProducts = async (req, res) => {
    try {
      const { cid } = req.params;
  
      // Verificar si el carrito existe
      const cart = await cartsModel.findById(cid);
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      // Limpiar el array de productos en el carrito
      cart.products = [];
  
      // Guardar el carrito actualizado en la base de datos
      const updatedCart = await cart.save();
  
      res.json({ message: 'Todos los productos del carrito han sido eliminados', payload: updatedCart });
    } catch (error) {
      console.error('Error al eliminar todos los productos del carrito:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  exports.purchaseCart = async (req, res) => {
    try {
      const { cid } = req.params;
  
      // Obtener el carrito con sus productos
      const cart = await cartsModel.findById(cid).populate('products.productId');
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      const productsToPurchase = [];
      const productsNotPurchased = [];
  
      // Verificar el stock para cada producto en el carrito
      for (const item of cart.products) {
        const product = item.productId;
  
        if (!product || product.stock < item.quantity) {
          // Si no hay suficiente stock, agregar el producto a la lista de no comprados
          productsNotPurchased.push(item._id);
        } else {
          // Restar la cantidad del producto en la base de datos
          product.stock -= item.quantity;
          await product.save();
          productsToPurchase.push({ productId: product._id, quantity: item.quantity });
        }
      }
  
      // Generar el ticket con los datos de la compra
      await ticketsModel.createTicket({
        code: 'generar código', // TO-DO: Código generado para el ticket
        products: productsToPurchase,
        amount: 'calcular cantidad total',
        purchaser: 'usuario', // TO-DO: Datos del usuario que realiza la compra
        createdAt: new Date()
      });
  
      // Actualizar el carrito con los productos que no pudieron comprarse
      cart.products = productsNotPurchased;
      const updatedCart = await cart.save();
  
      res.json({
        message: 'Proceso de compra finalizado',
        productsNotPurchased: productsNotPurchased.length > 0 ? productsNotPurchased : null,
        updatedCart
      });
    } catch (error) {
      console.error('Error al realizar el proceso de compra:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };