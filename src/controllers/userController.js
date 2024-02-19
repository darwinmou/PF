require('dotenv').config()
const userModel = require("../models/users.model")
const nodemailer = require('nodemailer');

exports.registerUser = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Verifica si el nombre de usuario ya existe en la base de datos
      const existingUser = await userModel.findOne({ username });
  
      if (existingUser) {
        return res.render('register.hbs', { error: 'El nombre de usuario ya está registrado' });
      }
  
      // Hashea la contraseña antes de almacenarla en la base de datos
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Crea un nuevo usuario con el nombre de usuario y la contraseña hasheada
      const newUser = new userModel({ username, password: hashedPassword });
      await newUser.save(); // Guarda el usuario en la base de datos
  
      // Inicia sesión automáticamente después del registro
      req.session.user = { username: newUser.username, role: newUser.role };
      res.redirect('/login'); // Redirige a la vista de login para que el usuario inicie sesión
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.render('register.hbs', { error: 'Error al registrar usuario' });
    }
  };



  exports.logoutUser = (req, res) => {
    console.log(req.session)
    req.session.destroy(err => {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error al cerrar sesión' });
      } else {
        res.json({ success: true });
      }
    });
  }

  exports.getAllUsers = async (req, res) => {
    try {
      const users = await userModel.find();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  exports.getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Verificar si el ID proporcionado es válido
      if (!userId) {
        return res.status(400).json({ error: 'ID de usuario no proporcionado' });
      }
  
      const user = await userModel.findById(userId);
  
      // Verificar si el usuario existe
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Error al obtener el usuario por ID:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  exports.deleteInactiveUsers = async (req, res) => {
    try {
      // Obtener la fecha actual menos 2 días
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
      // Buscar usuarios inactivos
      const inactiveUsers = await userModel.find({ lastConnection: { $lt: twoDaysAgo } });
  
      if (!inactiveUsers.length) {
        return res.status(404).json({ message: 'No existen actualmente usuarios inactivos' })
      }

      await Promise.all(inactiveUsers.map(user => sendDeletionEmail(user)));
  
      await userModel.deleteMany({ lastConnection: { $lt: twoDaysAgo } });
  
      res.status(200).json({ message: 'Usuarios eliminados correctamente' });
    } catch (error) {
      console.error('Error al eliminar usuarios inactivos:', error);
      res.status(500).json({ error: 'Error al eliminar usuarios inactivos' });
    }
  };
  
  const sendDeletionEmail = async (user) => {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
      }
    });
  
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: user.username,
      subject: 'Eliminación de cuenta',
      text: `Estimado ${user.username},\n\nTu cuenta ha sido eliminada debido a inactividad por más de 2 días.\n\nSaludos, \nEquipo de la aplicación`
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Correo enviado a ${user.username}`);
    } catch (error) {
      console.error(`Error al enviar correo a ${user.username}:`, error);
    }
  };