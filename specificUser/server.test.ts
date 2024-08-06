import Fastify, {FastifyInstance } from "fastify";
import { Config } from "./utils/config";
import fastifySocketIO from "fastify-socket.io";
import { routers } from "./utils/router";
import { Socket, Server as SocketIOServer } from "socket.io";
import cors from '@fastify/cors';

declare module 'fastify' {
    interface FastifyInstance {
        io: SocketIOServer;
    }
}

interface userInterface {
    id: string,
    username: string;
}

interface msgInterface {
    toid?: string, 
    msg: string, 
    name: string;
}


class ServerFasti {
    private host: string;
    private port: number;
    private app: FastifyInstance;
    private users:userInterface[];

    constructor() {
        this.host = "127.0.0.1";
        this.port = 8092;
        this.app = Fastify({logger: false});
        this.users = [];
    }   

    async appConfig(): Promise<void>{
        try {
            await this.app.register(cors);
            new Config(this.app);
            await this.app.register(fastifySocketIO);
            await this.app.register(routers);   
        } catch (e) {
            throw new Error("Erro iniciar configurações do configurar servidor");
        }
    }

    async socketEvents() {
        this.app.ready(err => {
            if(err) throw err;
            this.app.io.on('connection', (socket: Socket) => {
                socket.on('username', (userName) => {
                    const newUser: userInterface = {
                        id: socket.id,
                        username: userName
                    };


                    console.log(socket.id);
                    this.users.push(newUser);
                    const len = this.users.length - 1;

                    // console.log(this.users);
                    // console.log("Ultimoo: ", this.users[len].id);
                    // console.log("Atual: ", socket.id);

                    this.app.io.emit('userList', this.users, this.users[len].id);
                });

                socket.on('getMsg', (data: msgInterface) => {
                    if(data.toid){
                        const newMsg: msgInterface = {
                            msg: data.msg, 
                            name: data.name
                        }

                        socket.broadcast.to(data.toid).emit('sendMsg', newMsg);
                    } else {
                        this.app.io.emit("error", {msg: "Preencha corretamente"});
                        console.log(data, "preencha corretamente");
                    }
                })

                socket.on('disconnect', () => {
                    for(let i = 0; i < this.users.length; i++) {
                        if(this.users[i].id === socket.id)
                            this.users.splice(i, 1);
                    }
                    this.app.io.emit("exit", this.users);
                    console.log("A user disconected");
                });
            });
        })
    }

    async appExecute(): Promise<void>{
        try {
            await this.appConfig();   
            await this.socketEvents();

            this.app.listen({port: this.port, host: this.host}, () => {
                console.log(`Listening in http://${this.host}:${this.port}`);
            });
        } catch (error) {
            console.log(`Erro ao iniciar servidor: ${error}`);
        }
    }
}

const app = new ServerFasti();
app.appExecute();