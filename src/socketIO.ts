import { FastifyInstance } from "fastify";
import { Socket, Server as SocketIOServer } from 'socket.io';

declare module 'fastify' {
    interface FastifyInstance {
      io: SocketIOServer;
    }
}

export const socketIO = async (app: FastifyInstance) => {
    console.log("soketIO");
    app.ready(err => {
        if(err) throw err;

        app.io.on('connection', (socket:Socket) => {
            console.log("Um usuario conectou: ");

            socket.on('disconnect', () => {
                console.log('Um usuario desconectou');
            });

            socket.on('message', message => {
                console.log('message: ', message);
                app.io.emit('message', message);
            });
        });
    });
}