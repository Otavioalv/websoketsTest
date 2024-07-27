import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";

export async function routers(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.get('/', async (req: FastifyRequest, res: FastifyReply) => {
        res.status(200).send({message: "success test API"});
    });
}