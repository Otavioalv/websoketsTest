import fastifyStatic from "@fastify/static";
import { FastifyInstance } from "fastify";
import path from "path";

export class Config {
    private pathPublic: string;

    constructor(app: FastifyInstance) {
        this.pathPublic = "C:\\Users\\leocs\\Área de Trabalho\\projetos\\websoketsTest\\specificUser\\";

        app.register(fastifyStatic, {
            root: path.join(this.pathPublic, 'public'),
            prefix: '/frontEnd'
        })
    }
}