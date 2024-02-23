const CustomError = require("../errors/CustomError")
const EnumErrors = require("../errors/enum");
const generateProductErrorInfo = require("../errors/errorsInfo")
 
const validateProduct = (product, res) => {
    const errorMsg = "Estos campos son obligatorios: title, description, price, code, status, stock, category"
    if (!product.title || !product.price) {
      try {
        throw CustomError.createError({
            name: 'Error en Creacion de Producto',
            cause: generateProductErrorInfo(product),
            message: 'Error al intentar crear el Producto',
            code: EnumErrors.REQUIRED_DATA,
        });
    } catch (error) {
        res.status(400).send({ status: "error", message: `BAD REQUEST: ${errorMsg}` });
        return;
    }
    }

    
    if (!product.title || typeof product.title !== "string") {
      res
        .status(400)
        .json({
          error:
            `${errorMsg}. Title debe ser string`,
        });
      return;
    }
    if (!product.description || typeof product.description !== "string") {
      res
        .status(400)
        .json({ error:  `${errorMsg}. Description debe ser string` });
      return;
    }
    if (!product.price || typeof product.price !== "number") {
      res
        .status(400)
        .json({ error: `${errorMsg}. Price debe ser number` });
      return;
    }
    if (!product.code || typeof product.code !== "string") {
      res
        .status(400)
        .json({ error: `${errorMsg}. Code debe ser string` });
      return;
    }
    if (!product.stock || typeof product.stock !== "number") {
      res
        .status(400)
        .json({ error: `${errorMsg}. Stock debe ser number` });
      return;
    }
    if (!product.category || typeof product.category !== "string") {
      res
        .status(400)
        .json({ error: `${errorMsg}. Category debe ser string` });
      return;
    }
    return
  }

  module.exports = {validateProduct};