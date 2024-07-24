import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { Message, messages } from "./socketIO";

export async function routers(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.get('/', async (req: FastifyRequest, res: FastifyReply) => {
        res.status(200).send({message: "success"});
    });

    fastify.get("/notify", async (req: FastifyRequest, res: FastifyReply) => {
        res.status(200).send({message: "Ussuarios notificados"});
        fastify.ready(err => {
            if(err) throw err;

            const message: Message = {
                createdAt: new Date(),
                room: "all",
                text: "Menssagem do servidor",
                username: "Servidor"
            }

            messages.push(message);
            fastify.io.emit("message", message);
        });
    });
}