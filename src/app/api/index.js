const express = require('express');
// const tasksRouter = require('./routes/routes');
const { graphqlHTTP } = require('express-graphql');
const jwt = require('jsonwebtoken');
const authenticateMiddleware = require('./middleware/authenticate');
require('dotenv').config();


//import { NextResponse } from 'next/server';
//const valid = require('schema-validations/validations');//TODO
/* import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http"; */

const cors = require('cors');


//Esquema de resolvers
const schema = require('./schema');

//GraphQL Resolvers
const root = require('./resolvers/resolvers');

const app = express();
//Express middleware
app.use(express.json());

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:3000', // Cambia esto al dominio de tu frontend
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

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000/graphql');
});
