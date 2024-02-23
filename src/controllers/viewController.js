require('dotenv').config()
const UserModel = require("../models/users.model")
const ProductsModel = require("../models/products.model");
const bcrypt = require("bcrypt")
const CartsModel = require("../models/carts.model");
const { generateAndSetToken } = require('../utils.js/jwt');


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

    const token = generateAndSetToken(res, email, user.role);  // Aquí se encripta la contraseña antes de usarla
    console.log(token);
    res.status(200).json({ token, user: user });

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
