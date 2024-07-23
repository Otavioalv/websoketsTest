import Fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import fastifySocketIO from "fastify-socket.io";
import cors from '@fastify/cors';
import { routers } from "./router";
 
const app = Fastify({logger: false});

app.setErrorHandler((err: FastifyError, req: FastifyRequest, res:FastifyReply) => {
    res.code(404).send({
        message: "Erro desconhecido",
        error: err.message,
        cause: err.cause,
        complete: err
    });
}); 

const PORT:number = 8091;
const HOST:string = "127.0.0.1";

async function start() {
    await app.register(cors);
    await app.register(routers);
    await app.register(fastifySocketIO);
    
    

    try {
        await app.listen({port: PORT, host: HOST}, () => {
            console.log(`API rodando na URL: http://${HOST}:${PORT}\n`);
        });       
    } catch {
        process.exit(1);
    }
}

start();