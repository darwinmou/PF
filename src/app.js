require('dotenv').config()
const express = require("express")
const bodyParser = require('body-parser');
const app = express()
const PORT = 8080
const handlebars = require("express-handlebars")
const products = require("./routes/productsRoutes.js")
const productsModel = require('./models/products.model.js');
const cartsRoutes = require('./routes/cartsRoutes');
const usersRoutes = require("./routes/usersRoutes.js")
const adminRoutes = require("./routes/adminRoutes.js")
const viewsRoutes = require('./routes/viewsRoutes');

const mongoose = require('mongoose');
const uri = `mongodb+srv://djmou:${process.env.DB_PASSWORD}@dcontreras.bv4xdut.mongodb.net/ecommerce?retryWrites=true&w=majority`
const session = require('express-session');
const bcrypt = require("bcrypt")

const cookieParser = require("cookie-parser")
const UserModel = require('./models/users.model.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static("public"))
app.use(cookieParser())

MongoDBStore = require('connect-mongodb-session')(session);


app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use(bodyParser.json());

app.engine("handlebars", handlebars.engine())

app.set("views", __dirname + "/views")

app.set("view engine", "handlebars")

app.use(express.static(__dirname + "/views"))

let store = new MongoDBStore({
  uri: uri,
  collection: 'mySessions'
});

store.on('error', function(error) {
  console.log(error);
});

app.use(require('express-session')({
  secret: 'djmou.2023*s3cret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));


app.use("/api/products", products);
app.use("/api/carts", cartsRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/admin", adminRoutes)
app.use('/', viewsRoutes);


mongoose.connect(uri).then(()=>console.log("Conectado a la base de datos"))
.catch(e => console.log("Error al conectar con la base de datos", e))

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server escuchando en el puerto ${PORT}`);
})

