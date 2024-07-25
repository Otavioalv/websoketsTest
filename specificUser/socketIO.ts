import { FastifyInstance } from "fastify";
import { Socket } from "socket.io";


export const socketIO = (app: FastifyInstance) => {
    console.log("SocketIO function");

    app.ready(err => {
        if(err) throw err;

        app.io.on('connection', (socket: Socket) => {
            console.log("Um usuario conectou");

            socket.on('disconnect', () => {
                console.log("Um usuario desconectou");
            })

        });
    })
}