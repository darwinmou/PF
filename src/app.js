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
const session = require('express-session');
MongoDBStore = require('connect-mongodb-session')(session);

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/api/products", products);
app.use("/api/carts", carts)


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
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));

// app.use(
//   session({
//     store: new MongoStore({
//       url: uri,
//     }),
//     secret: 'djmou.2023*s3cret',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 3600000 },
//   })
// );

// app.use(
//   session({
//     store: new FileStore({ path: 'sessions', reapInterval: -1 }), // Ruta al directorio de sesiones
//     secret: 'djmou.2023*s3cret', // Clave secreta para firmar cookies de sesión
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 3600000 }, // Tiempo de vida de la sesión en milisegundos
//   })
// );

app.get('/login', (req, res) => {
  res.render('login.hbs');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
console.log("login", email, password)
  // Verifica las credenciales del usuario
  if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
    // Usuario con rol de administrador
    req.session.user = { email, role: 'admin' };
    res.redirect('/products'); // Redirige a la vista de productos
  } else {
    // Usuario normal
    req.session.user = { email, role: 'usuario' };
    res.redirect('/products'); // Redirige a la vista de productos
  }
});

// Ruta para mostrar la vista de productos
app.get('/products', async (req, res) => {
  const user = req.session.user;
  const products = await productsModel.find();
  if (user) {
    // Usuario autenticado
    res.render('products.hbs', { user, products });
  } else {
    // Usuario no autenticado
    res.redirect('/login'); // Redirige al inicio de sesión
  }
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  console.log(req.session)
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Error al cerrar sesión' });
    } else {
      res.json({ success: true });
    }
  });
});


mongoose.connect(uri).then(()=>console.log("Conectado a la base de datos"))
.catch(e => console.log("Error al conectar con la base de datos", e))

app.listen(PORT, () => {
    console.log(`Server escuchando en el puerto ${PORT}`);
})

