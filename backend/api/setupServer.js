const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');

async function setupServer({ schema, authenticateMiddleware, root }) {
    const app = express();

    app.use(express.json());

    // Configurar CORS
    app.use(cors({
      origin: 'https://even-tap2.vercel.app', // Cambia esto al dominio de tu frontend
      //origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'OPTIONS'], // Métodos permitidos
      allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
      credentials: true // Permitir el uso de cookies y headers de autenticación
    }));

    //graphQLHTTP middleware
    app.use('/graphql', authenticateMiddleware, graphqlHTTP((req) => ({
      schema,
      rootValue: root,
      context: req,
      graphiql: true,
    })));

    return app;
}

module.exports  = setupServer;