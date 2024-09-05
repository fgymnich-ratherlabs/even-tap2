const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const authenticateMiddleware = require('./middleware/authenticate');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const shutdown = require('./services/shutdown');
require('dotenv').config();
const cors = require('cors');


//Esquema de resolvers
const schema = require('./schema');

//GraphQL Resolvers
const root = require('./resolvers/resolvers');

if (cluster.isMaster) {
  console.log(`Master process ID: ${process.pid}`);
  console.log(`cpus number: ${numCPUs}`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker exit and restart
  cluster.on('exit', (worker, code, signal) => {
    if (code !== 0) {
      console.error(`Worker ${worker.process.pid} exited with error code ${code}`);
    } else if (signal) {
      console.log(`Worker ${worker.process.pid} was killed by signal ${signal}`);
    } else {
      console.log(`Worker process ID ${worker.process.pid} died.`);
    }
    console.log('Forking a new worker...');
    cluster.fork();
  });
}else {
  // Los procesos workers entrarán en este bloque
  async function main() {
    try{
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
      
      const port = 10000;
      const server = app.listen(port, () => {
        console.log(`Worker process ID ${process.pid} is running, listening on port ${port}`);
      });

      process.on('SIGTERM', () => shutdown({ server, signal: 'SIGTERM' }));
      process.on('SIGINT', () => shutdown({ server, signal: 'SIGINT' }));

    }catch(error){
      console.error(`Worker process ID ${process.pid} initialization error:`, error);
      process.exit(1);
    }
  }

  main()
    .then(() => {
      console.log(`Worker process ID ${process.pid} initialized successfully`);
    })
    .catch((error) => {
      console.error(`Worker process ID ${process.pid} initialization failed:`, error);
    });

}




