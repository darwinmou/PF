exports.generateProductErrorInfo = (product) => {
    return `Una o más propiedades estan incompletas o no son validas.
    Lista de propiedades requeridas:
    *description : needs to be a String, received ${product.description}
    *image       : needs to be a String, received ${product.image}
    *price       : needs to be a String, received ${product.price}
    *stock       : needs to be a String, received ${product.stock}
    *category    : needs to be a String, received ${product.category}
    *availability: needs to be a String, received ${product.availability}`
}

exports.deleteProductErrorInfo = (product) => {
    return `Error al eliminar el Producto.
    *El producto que no se pudo eliminar tiene el id ${id}`
}
exports.updateProductErrorInfo = (id, product) => {
    return `Error al actualizar el producto.
    El producto que no se pudo actualizar tiene el id ${id}
    La información ingresada fue la siguiente:
    *description : needs to be a String, received ${product.description}
    *image       : needs to be a String, received ${product.image}
    *price       : needs to be a String, received ${product.price}
    *stock       : needs to be a String, received ${product.stock}
    *category    : needs to be a String, received ${product.category}
    *availability: needs to be a String, received ${product.availability}`
}