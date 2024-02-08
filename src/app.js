require('dotenv').config()
const express = require("express")
const bodyParser = require('body-parser');
const app = express()
const PORT = 8080
const path = require("path")
const handlebars = require("express-handlebars")
const products = require("./routes/productsRoutes.js")
const productsModel = require('./models/products.model.js');
const cartsRoutes = require('./routes/cartsRoutes');

const mongoose = require('mongoose');
const uri = `mongodb://djmou:${process.env.DB_PASSWORD}@ac-wt2jlti-shard-00-00.bv4xdut.mongodb.net:27017,ac-wt2jlti-shard-00-01.bv4xdut.mongodb.net:27017,ac-wt2jlti-shard-00-02.bv4xdut.mongodb.net:27017/?ssl=true&replicaSet=atlas-hpwkxf-shard-0&authSource=admin&retryWrites=true&w=majority`
// const productsModel = require('./models/products.model.js')
const cartsModel = require("./models/carts.model.js")
const session = require('express-session');


const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const passport = require('passport');
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const users = [
   {id: 1, email: "text@example.com", password: "password123"} 
]

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "secret-key"
}

passport.use(
  new JwtStrategy(jwtOptions,(jwt_payload, done) => {
    const user = users.find((user) => user.email === jwt_payload.email)
    if(!user){
      return done(null, false, {message: "Usuario no encontrado"})
    }

    return done(null, user)
  })
)

//middlewars
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static("public"))
app.use(cookieParser())
app.use(passport.initialize())
const requireAuth = passport.authenticate('jwt', { session: false });

//Ruta de autenticacion cob JWT

app.post("/login", (req,res) => {
  const {email, password} = req.body

  //Simular verificacion de credenciales
  const user = users.find((user) => user.email === email)

  if (!user || user.password !== password) {
    return res.status(401).json({message: "Error de autenticacion"})
    
  }

  app.get('/current', requireAuth, (req, res) => {
    res.json(req.user); // req.user contendrá la información del usuario obtenida del token JWT
  });

  //Si las crecenciales son validas genero el JWT 
  const token = jwt.sign({email}, "secret-key", {expiresIn: "24h"})
  res.cookie("token", token, {httpOnly: true, maxAge: 24*60*60*1000})
  console.log(token);
  res.json({token})
})

MongoDBStore = require('connect-mongodb-session')(session);


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/api/products", products);
app.use("/api/carts", cartsRoutes)
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

app.get('/register', (req, res) => {
  res.render('register.hbs'); 
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

 
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

