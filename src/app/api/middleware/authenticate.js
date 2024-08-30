const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware de autenticación
const authenticate = (req, res, next) => {

  // Si la solicitud es una operación de GraphQL (consulta o mutación)
  if (req.body && req.body.query) {
    const operationName = req.body.operationName;

    // Lista de operaciones que no requieren autenticación
    const publicOperations = ['SignUp', 'SignIn'];

    // Si la operación es pública, permite el acceso sin autenticación
    if (publicOperations.includes(operationName)) {
      return next();
    }
  }

  const authHeader = req.headers.authorization; // Obtener el encabezado de autorización

  if (!authHeader) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const token = authHeader.replace('Bearer ', ''); // Extraer el token del encabezado
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // Verificar el token usando la clave secreta
    req.user = decodedToken; // Almacenar los datos del usuario decodificados en la solicitud
    next(); // Continuar al siguiente middleware o controlador
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token', error: error });
  }
};

module.exports = authenticate;
