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
app.use("/api/products", products);
app.use("/api/carts", cartsRoutes)
app.use("/api/users", usersRoutes)
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



app.get('/login', (req, res) => {
  res.render('login.hbs');
});

app.post("/login", async (req,res) => {
  const {email, password} = req.body

  const user = await UserModel.findOne({username: email})
  const hashedPassword = await bcrypt.compare(password, user.password);

  console.log(user);
  if (!user || !hashedPassword) {
    return res.status(401).json({message: "Error de autenticacion"})
    
  }

  req.session.user = { username: user.username };
  res.redirect('/products');
})

app.get('/register', (req, res) => {
  res.render('register.hbs'); 
});

app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  
  try {
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.render('register.hbs', { error: 'El nombre de usuario ya está registrado' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new UserModel({ username, password: hashedPassword, role });
    await newUser.save(); 

    req.session.user = { username: newUser.username, role: newUser.role };
    res.redirect('/login');

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.render('register.hbs', { error: 'Error al registrar usuario' });
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

app.get('/logout', (req, res) => {
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

