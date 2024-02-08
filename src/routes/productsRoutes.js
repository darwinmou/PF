const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController")

router.get('/', productsController.getProducts);

router.get('/:pid', productsController.getProductById);

router.post('/', productsController.addProduct);

router.put('/:pid', productsController.updateProduct);

router.delete('/:pid', productsController.deleteProduct);

module.exports = router;
