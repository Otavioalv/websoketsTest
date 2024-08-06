import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import mysql from 'mysql2/promise';

export async function routers(fastify: FastifyInstance, options: FastifyPluginOptions) {

    const pool: mysql.Pool = mysql.createPool({
        host: "127.0.0.1", 
        user: 'root', 
        port: 3306,
        password: "123456",
        database: 'tests'
    })

    fastify.get('/', async (req: FastifyRequest, res: FastifyReply) => {

        res.status(200).send({message: "success test API"});
    });

    fastify.post('/login', async(req: FastifyRequest, res: FastifyReply) => {
        try {
            const data = await req.body as {username: string, socketId: string};
            const connection = await pool.getConnection();
            const [listUsers, _] = await connection.execute("select name from user") as [[{name: string}], any];            
            

            if(!data.username || !data.socketId) {
                res.status(404).send({message: "Parametros invalidos"});
                return;
            }

            if(listUsers.find(user => user.name === data.username)) {
                console.log("usuario encontrado");
                const [response] = await connection.execute("update user set socket_id = ?", [data.socketId]);

                res.status(200).send({message: "Ja existe um usuario, pegando seus dados"});
                return;
            }

            const [response] = await connection.query('insert into user (name, socket_id) values (?, ?)', [data.username, data.socketId]);

            connection.release();
            res.status(200).send({message: "Usuario criado"});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Erro interno no servidor"});
        }
    }); 

    fastify.post('/get-message', async(req: FastifyRequest, res: FastifyReply) => {
        try {
            const data = await req.body as {socketId: string};
            const connection = await pool.getConnection();
            
            if(!data.socketId) {
                res.status(404).send({message: "Parametros invalidos"});
                return;
            }

            const [listMessage, _] = await connection.query('SELECT id_message as idMessage, to_user as toUser, message, fk_id_user as idUser FROM message WHERE fk_id_user = ?', [data.socketId]);

            console.log(listMessage);
            res.status(200).send({message: "menssagens listadas"});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Erro interno no servidor"});
        }
    });
}