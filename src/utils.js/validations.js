const validateProduct = (product, res) => {
    const errorMsg = "Estos campos son obligatorios: title, description, price, code, status, stock, category"

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