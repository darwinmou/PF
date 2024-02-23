require('dotenv').config()
const jwt = require('jsonwebtoken');

function generateAndSetToken(res, email, role) {
  const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: "24h" });
  res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
  return token;
}

function getEmailFromToken(token) {
  try {
    const decoded = jwt.verify(token, 'Secret-key');
    return decoded.email;
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null; 
  }
}


module.exports = {
  generateAndSetToken,
  getEmailFromToken,
};
