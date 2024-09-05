async function shutdown({ server, signal }) {
    console.log(`Shutting down gracefully worker with process ID ${process.pid} on received signal ${signal}.`);

    server.close((error)=>{
        if(error){
            console.error(`Worker ${process.pid} failed to close with error:`, error);
            process.exit(1);
        }else{
            process.exit(0);
        }
    });  

}
  
module.exports = shutdown;
  