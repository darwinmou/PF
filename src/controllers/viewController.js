require('dotenv').config()
const UserModel = require("../models/users.model")
const ProductsModel = require("../models/products.model");
const bcrypt = require("bcrypt")
const CartsModel = require("../models/carts.model");

exports.login = (req, res) => {
    res.render('login.hbs');
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOneAndUpdate(
        { username: email },
        { $set: { lastConnection: new Date() } },
        { new: true }
    );

    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const hashedPassword = await bcrypt.compare(password, user.password);

    if (!hashedPassword) {
        return res.status(401).json({ message: "Error de autenticación" });
    }

    req.session.user = { username: user.username, role: user.role };

    // Redirige al usuario según su rol
    if (user.role === "admin") {
        res.redirect('/admin/dashboard'); // Ruta de la vista de administrador
    } else {
        res.redirect('/products'); // Ruta de la vista de productos
    }
};

exports.register = (req, res) => {
    // Lógica para renderizar la vista de registro
    res.render('register.hbs');
};

exports.registerUser = async (req, res) => {
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
};

exports.products = async (req, res) => {
    const user = req.session.user;

    // Verificar la autenticación del usuario
    if (user) {
        // Crear un carrito vacío si el usuario aún no tiene uno
        if (!user.cartId) {
            const newCart = new CartsModel({ products: [] });
            await newCart.save();
            user.cartId = newCart._id;
            // Guardar la actualización del usuario en la sesión
            req.session.user = user;

        } else {
            const cart = await CartsModel.findById(user.cartId);
            const productsDetails = await Promise.all(
                cart.products.map(async (item) => {
                    const product = await ProductsModel.findById(item.productId);

                    if (!product) {
                        return null;  // Otra opción sería manejar productos no encontrados de manera diferente
                    }

                    return {
                        title: product.title,
                        price: product.price,
                        quantity: item.quantity,
                    };
                })
            );
            const validProductsDetails = productsDetails.filter((product) => product !== null);
            user.productsInCart = validProductsDetails
        }
        console.log(user);
        // Obtener la lista de productos
        const products = await ProductsModel.find();
        // Renderizar la vista con el usuario y los productos
        res.render('products.hbs', { user, products });
    } else {
        // Usuario no autenticado, redirigir al inicio de sesión
        res.redirect('/login');
    }
};


exports.adminDashboard = async (req, res) => {
    try {
        const user = req.session.user;
        const users = await UserModel.find();
        res.render('admin.hbs', { user, users });
    } catch (error) {
        console.error('Error al obtener todos los usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.editUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Busca el usuario en la base de datos por ID
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Renderiza la vista con la información del usuario
        res.render('editUser.hbs', { user });
    } catch (error) {
        // Manejo de errores
        console.error('Error al obtener usuario para editar:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.confirmDeleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Busca el usuario en la base de datos por ID
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.render('confirmDeleteUser.hbs', { user });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ error: 'Error al obtener usuario para eliminar' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).json({ success: false, error: 'Error al cerrar sesión' });
        } else {
            res.json({ success: true });
        }
    });
};
