require('dotenv').config()
const express = require("express")
const bodyParser = require('body-parser');
const app = express()
const PORT = 8080
const path = require("path")
const handlebars = require("express-handlebars")
const products = require("./routes/productsRoutes.js")
const cartsRoutes = require('./routes/cartsRoutes');
const mongoose = require('mongoose');
const uri = `mongodb+srv://djmou:${process.env.DB_PASSWORD}@dcontreras.bv4xdut.mongodb.net/ecommerce?retryWrites=true&w=majority`
const productsModel = require('./models/products.model.js')
const cartsModel = require("./models/carts.model.js")
const session = require('express-session');
MongoDBStore = require('connect-mongodb-session')(session);


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/api/products", products);
app.use("/api/carts", cartsRoutes)
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

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



app.get('/login', (req, res) => {
  res.render('login.hbs');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
console.log("login", email, password)
 
  if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
  
    req.session.user = { email, role: 'admin' };
    res.redirect('/products'); 
  } else {
    
    req.session.user = { email, role: 'usuario' };
    res.redirect('/products'); 
  }
});


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

