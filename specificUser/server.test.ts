import Fastify, {FastifyInstance } from "fastify";

class Server {
    private host: string;
    private port: number;
    private app: FastifyInstance;

    constructor() {
        this.host = "127.0.0.1";
        this.port = 8092;
        this.app = Fastify({logger: false});

    }   
}