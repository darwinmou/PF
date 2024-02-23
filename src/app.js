require('dotenv').config()
const express = require("express")
const bodyParser = require('body-parser');
const passport = require("passport");
const cookieParser = require("cookie-parser")
const initializePassport = require("./config/authentication.js")
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const app = express()
const PORT = 8080
const handlebars = require("express-handlebars")
const products = require("./routes/productsRoutes.js")
const cartsRoutes = require('./routes/cartsRoutes');
const usersRoutes = require("./routes/usersRoutes.js")
const adminRoutes = require("./routes/adminRoutes.js")
const viewsRoutes = require('./routes/viewsRoutes');
const ticketsRoutes = require("./routes/ticketRoutes.js")
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUIExpress = require('swagger-ui-express')

const mongoose = require('mongoose');
const uri = `mongodb+srv://djmou:${process.env.DB_PASSWORD}@dcontreras.bv4xdut.mongodb.net/ecommerce?retryWrites=true&w=majority`
const session = require('express-session');

const UserModel = require('./models/users.model.js');
const { passportCall, authorization } = require('./utils.js/auth.js');
const cartsModel = require('./models/carts.model.js');
const productsModel = require('./models/products.model.js');

// Configuración de Passport
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwt_payload, done)=>{
      const user = await UserModel.find((user) =>user.username ===jwt_payload.email)
      if(!user)
      {
          return done(null, false, {message:"Usuario no encontrado"})
      }
      return done(null, user)
  })
)

initializePassport();

app.use(passport.initialize());
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
app.use('/api/tickets', ticketsRoutes);

/* API Documentation */
const swaggerOptions = {
  definition:{
      openapi:'3.0.1',
      info:{
          title: 'Documentación API',
          description:'Documentación de API ecommerce'
      }
  },
  apis:[`src/docs/users.yaml`,
        `src/docs/products.yaml`,
        `src/docs/tickets.yaml`,
        `src/docs/carts.yaml`,
        `src/docs/admin.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions)
app.use("/api-documentation", swaggerUIExpress.serve, swaggerUIExpress.setup(specs))

app.get('/products',passportCall('jwt', { session: false }), authorization(),(req,res) =>{

  authorization()(req, res, async() => { 
      const userData = req.user
      if (!userData.cartId) {
          const newCart = new cartsModel({ products: [] });
          await newCart.save();
          req.user.cartId = newCart._id;

      } else {
          const cart = await cartsModel.findById(userData.cartId);
          const productsDetails = await Promise.all(
              cart.products.map(async (item) => {
                  const product = await productsModel.findById(item.productId);

                  if (!product) {
                      return null; 
                  }

                  return {
                      title: product.title,
                      price: product.price,
                      quantity: item.quantity,
                  };
              })
          );
          const validProductsDetails = productsDetails.filter((product) => product !== null);
          req.user.productsInCart = validProductsDetails
      
      }

      const products = await productsModel.find();
      console.log(userData, products);
      res.render('products.hbs', { userData, products });

  });
})

mongoose.connect(uri).then(()=>console.log("Conectado a la base de datos"))
.catch(e => console.log("Error al conectar con la base de datos", e))

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server escuchando en el puerto ${PORT}`);
})

