const express = require("express");
const router = express.Router();
const productsModel  = require("../models/products.model");
const cartsModel = require("../models/carts.model")
const cartsController = require('../controllers/cartsController');

router.post('/', cartsController.createEmptyCart);

router.get('/:cid', cartsController.getCartById);

router.post('/:cid/product/:pid', cartsController.addProductToCart);

router.delete('/:cid/product/:pid', cartsController.removeProductFromCart);

router.put('/:cid', cartsController.updateCart);

router.put('/:cid/products/:pid', cartsController.updateProductQuantity);

router.delete('/:cid', cartsController.deleteAllProducts);

router.post('/:cid/purchase', cartsController.purchaseCart);

module.exports = router;
