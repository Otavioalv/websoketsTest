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
        const connection = await pool.getConnection();
        try {
            const data = await req.body as {username: string, socketId: string};
            
            const [listUsers, _] = await connection.execute("select name from user") as [[{name: string}], any];            
            

            if(!data.username || !data.socketId) {
                res.status(404).send({message: "Parametros invalidos"});
                return;
            }

            if(listUsers.find(user => user.name === data.username)) {
                console.log("usuario encontrado");
                await connection.execute("update user set socket_id = ? where name = ?", [data.socketId, data.username]);
                
                const [response] = await connection.query('SELECT id, name, socket_id as socketId from user where name =  ?', [data.username]) as [[{id: number, name: string, socketId: string}], any];
                res.status(200).send({message: "Ja existe um usuario, pegando seus dados",  datas: response[0]});
                return;
            }

            await connection.query('insert into user (name, socket_id) values (?, ?)', [data.username, data.socketId]);
            const [response] = await connection.query('SELECT id, name, socket_id as socketId from user where name =  ?', [data.username]) as [[{id: number, name: string, socketId: string}], any];


            connection.release();
            res.status(200).send({message: "Usuario criado", datas: response[0]});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Erro interno no servidor"});
        }finally {
            connection.release(); // Liberar a conexão
        }
    }); 

    fastify.post('/new-message', async(req: FastifyRequest, res: FastifyReply) => {
        const connection = await pool.getConnection();
        try {
            const data = await req.body as {toUser: {id: string, username: string}, message: string, id: number};
            

            if(!data.id || !data.message || !data.toUser || !data.toUser.id || !data.toUser.username) {
                res.status(404).send({message: "Parametros invalidos"});
                return;
            }
            const [userRes] = await connection.query("SELECT id, name, socket_id as socketId FROM user WHERE name = ?", [data.toUser.username]) as [[{id: number, name: string, socketId: string}], any];
            const [response] = await connection.query('INSERT INTO message(to_user, message, fk_id_user) values (?, ?, ?)', [userRes[0].id, data.message, data.id]);

            res.status(200).send({message: "Menssagem enviada/salva"});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Erro interno no servidor"});
        }finally {
            connection.release(); // Liberar a conexão
        }
    });

    fastify.post('/get-message', async(req: FastifyRequest, res: FastifyReply) => {
        const connection = await pool.getConnection();
        try {
            const data = await req.body as {id: string};
            
            
            if(!data.id) {
                res.status(404).send({message: "Parametros invalidos"});
                return;
            }

            const [listMessage, _] = await connection.query('SELECT id_message as idMessage, to_user as toUser, message, fk_id_user as idUser FROM message WHERE fk_id_user = ? OR to_user = ?', [data.id, data.id]) as [[{idMessage:number, toUser: number, message: string, idUser: number}] , any];
            const [listUser] = await connection.query("SELECT id, name, socket_id as socketId FROM user") as [[{id: number, name: string, socketId: string}], any];
            
            console.log(listMessage);
            // idMessage:number, toUser: number, message: string, idUser: number
            const newlistList: {idMessage:number, toUser: number, message: string, idUser: number, toName: string}[]  = 
            listMessage.map((mgs, i) => { 
                return {
                    idMessage: mgs.idMessage, 
                    toUser: mgs.toUser, 
                    message: mgs.message, 
                    idUser: mgs.idUser, 
                    toName: listUser.find(user => user.id === mgs.idUser)?.name
                }
            }) as {idMessage:number, toUser: number, message: string, idUser: number, toName: string}[];


            
            res.status(200).send({message: "menssagens listadas", listMsg: newlistList});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Erro interno no servidor"});
        }finally {
            connection.release(); // Liberar a conexão
        }
    });
}