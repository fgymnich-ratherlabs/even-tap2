const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const shutdown = require('./services/shutdown');
const setupServer = require('./setupServer');
require('dotenv').config();

//Esquema de resolvers
const schema = require('./schema');

//GraphQL Resolvers
const root = require('./resolvers/resolvers');

const authenticateMiddleware = require('./middleware/authenticate');

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
  main()
    .then(() => {
      console.log(`Worker process ID ${process.pid} initialized successfully`);
    })
    .catch((error) => {
      console.error(`Worker process ID ${process.pid} initialization failed:`, error);
    });

}

async function main() {
  try{

    const app = await setupServer({
      schema,                 // Inject graphQL schema
      authenticateMiddleware, // Inject authentication middleware
      root      // Inject prisma client and resolvers
    });

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



