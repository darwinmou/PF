require('dotenv').config()
const express = require("express")
const app = express()
const PORT = 8080
const path = require("path")
const handlebars = require("express-handlebars")
const products = require("./routes/products.js")
const carts = require("./routes/carts.js")
const mongoose = require('mongoose');
const uri = `mongodb+srv://djmou:${process.env.DB_PASSWORD}@dcontreras.bv4xdut.mongodb.net/ecommerce?retryWrites=true&w=majority`
const { productsModel, cartsModel } = require('./models/products.model.js')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/api/products", products);
app.use("/api/carts", carts)


app.engine("handlebars", handlebars.engine())

app.set("views", __dirname + "/views")

app.set("view engine", "handlebars")

app.use(express.static(__dirname + "/views"))

app.get('/', async (req, res) => {
  try {
    const newCart = await cartsModel.create({});
    const cartId = newCart._id;
    console.log("cart", cartId);
    const products = await productsModel.find();

    res.render('products.hbs', { products, cartId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
  
});



mongoose.connect(uri).then(()=>console.log("Conectado a la base de datos"))
.catch(e => console.log("Error al conectar con la base de datos", e))

app.listen(PORT, () => {
    console.log(`Server escuchando en el puerto ${PORT}`);
})

