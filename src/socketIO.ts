import { FastifyInstance } from "fastify";
import { Server as SocketIOServer } from 'socket.io';

declare module 'fastify' {
    interface FastifyInstance {
      io: SocketIOServer;
    }
  }

export const socketIO = (app: FastifyInstance) => {
    app.ready(err => {
        if(err) throw err;

        app.io.on('connection', socket => {
            console.log("um usuario conectou");

            socket.on('disconnect', () => {
                console.log('useuario desconectiouy');
            });

            socket.on('message', message => {
                console.log('message: ', message);
                app.io.emit('message', message);
            });
        });
    });
}