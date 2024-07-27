import Fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import fastifyStatic from '@fastify/static';
import cors from '@fastify/cors';
import { routers } from "./utils/router";
import { socketIO } from "./utils/socketIO";
import fastifySocketIO from "fastify-socket.io";
import path from "path";

import { Socket, Server as SocketIOServer } from "socket.io";




const app = Fastify({ logger: false });

app.setErrorHandler((err: FastifyError, req: FastifyRequest, res: FastifyReply) => {
  res.code(404).send({
    message: "Erro desconhecido",
    error: err.message,
    cause: err.cause,
    complete: err
  });
});

const PORT: number = 8091;
const HOST: string = "127.0.0.1";

async function start() {
  await app.register(cors);
  await app.register(routers);
  await app.register(fastifySocketIO);


  await app.register(fastifyStatic, {
    root: path.join(__dirname, 'public'), 
    prefix: '/frontEnd', 
  });

  // Configura o Socket.IO
  socketIO(app);

  try {
    await app.listen({ port: PORT, host: HOST }, () => {
      console.log(`API rodando na URL: http://${HOST}:${PORT}\n`);
    });
  } catch {
    process.exit(1);
  }
}

start();
