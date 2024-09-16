const jwt = require('jsonwebtoken');
require('dotenv').config();

async function authenticate (context) {
    const authHeader = context.req.headers.authorization;
    if (!authHeader) throw new Error('Not authenticated');
    const token = authHeader.replace('Bearer ', '');
    try {
      const decripted = jwt.verify(token, process.env.SECRET_KEY);
      return decripted; //devuelve el token desencriptado
    } catch (e) {
      console.log('Authenticate error: ', e );
      throw new Error('Invalid token');
    }
}

module.exports = {authenticate};