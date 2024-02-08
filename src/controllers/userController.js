const userModel = require("../models/users.model")

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
      res.redirect('/products'); // Redirige a la vista de productos
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.render('register.hbs', { error: 'Error al registrar usuario' });
    }
  };

  exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Busca el usuario en la base de datos por su dirección de correo electrónico
      const user = await userModel.findOne({ username });
  
      if (!user) {
        return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
      }
  
      // Compara la contraseña ingresada con la contraseña hasheada almacenada en la base de datos
      const passwordsMatch = await bcrypt.compare(password, user.password);
  
      if (passwordsMatch) {
        // Contraseña válida, inicia sesión
        req.session.user = { username: user.username, role: user.role };
        res.redirect('/products');
      } else {
        // Contraseña incorrecta
        res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ success: false, error: 'Error al iniciar sesión' });
    }
  }

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