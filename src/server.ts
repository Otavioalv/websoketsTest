import Fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
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

const PORT:number = 8090;
const HOST:string = "127.0.0.1";

async function start() {
    await app.register(cors);
    await app.register(routers);
    
    try {
        await app.listen({port: PORT, host: HOST}, () => {
            console.log("API rodando na url: http://", HOST, ":", PORT, "\n");
        });       
    } catch {
        process.exit(1);
    }
}

start();