import { FastifyInstance } from "fastify";
import { Socket, Server as SocketIOServer } from 'socket.io';

declare module 'fastify' {
    interface FastifyInstance {
      io: SocketIOServer;
    }
}

interface RoomUser {
    soket_id: string, 
    usermame: string,
    room: string
}

export interface Message  {
    text: string, 
    username: string, 
    room: string,
    createdAt: Date
}

const users: RoomUser[] = [];
export const messages: Message[] = [];

export const socketIO = async (app: FastifyInstance) => {
    console.log("soketIO");
    app.ready(err => {
        if(err) throw err;

        app.io.on('connection', (socket:Socket) => {
            console.log("Um usuario conectou: ");

            socket.on('disconnect', () => {
                console.log('Um usuario desconectou');
            });

            socket.on('select_room', (data, callback) => {
                const userData:RoomUser = {
                    room: data.room,
                    usermame: data.username, 
                    soket_id: socket.id
                }

                // coloca usuario em uma sala especifica
                socket.join(data.room);
                
                const userInRoom = users.find(user => (user.usermame === data.username && user.room === data.room));

                if(userInRoom) {
                    userInRoom.soket_id = socket.id; 
                }
                else {
                    users.push(userData);
                }

                const messagesRoom = getMessagesRoom(data.room);
                callback(messagesRoom);
            });


            socket.on('message', data => {
                const message: Message = {
                    room: data.room, 
                    username: data.username, 
                    text: data.message,
                    createdAt: new Date()
                }

                messages.push(message);

                console.log(messages);

                // utilizamos o APP pra retornar pra todos os usuarios
                // Enviar para usuario da sala, como base na sala especifica configurada no join
                app.io.to(data.room).emit("message", message);

                // Retorna a menssagem, pra pegar o retorna o front tambem tem que ter um ON do mesmo nome pra ouvir o evento
                // app.io.emit('message', message);


            });
        });
    });
}

function getMessagesRoom(room: string) {
    const messagesRoom = messages.filter(message => message.room === room || message.room === "all");

    return messagesRoom;
}