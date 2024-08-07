
document.addEventListener('DOMContentLoaded', async () => {
    const socket = io('http://127.0.0.1:8092');

    const username = getUsername();
    let userListDb = [];
    let selectedUser;
    let yourself = {};
    
    

    await socket.emit("username", username);

    // const usernameElement = document.getElementById('username');
    // usernameElement.innerText = username;

    await socket.on('userList', async (userList) => {

        userListDb = userList;

        const listUsers = document.getElementById('list-users');
        listUsers.innerHTML = "";
        userList.forEach(user => {
            const userElement = document.createElement('li');
            userElement.id = "selectUser";
            
            userElement.className = 'list-group-item';
            userElement.innerHTML = `
                <button id="${user.id}" onclick="selectedUser('${user.id}')" class="item-list-button">${socket.id === user.id ? "You: " + user.username : user.username}</button>
            `;
            
            listUsers.appendChild(userElement);
        });
    });

    await socket.on('sendMsg', (data) => {
        // salvar menssagens em uma lista do proprio usuario
        console.log(data);
        otherUserMessage(data);
        // <li>ussuario says: message to usser</li>
    });

    await socket.on('connect', async () => {
        console.log(username, socket.id);
        yourself = await fetch('http://127.0.0.1:8092/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username, socketId: socket.id}),
        }).then(async (res) => {
            return await res.json()
        }).then(async (res) => {
            console.log(res);
            return res.datas;
        })

        const listMessages = await fetch('http://127.0.0.1:8092/get-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: yourself.id}),
        }).then(async (res) => {
            return await res.json()
        }).then(async (res) => {
            return res.listMsg;
        })

        listMessages.forEach((msgs, i) => {
            if(msgs.idUser === yourself.id) {
                console.log("vc eviou");
                yourMessage(msgs.message);
            }
            if(msgs.toUser === yourself.id) {
                console.log("vc recebeu: ", msgs.message)
                otherUserMessage({name: msgs.toName, msg: msgs.message});
            }
        });


        console.log("you are connected");
    });

    await socket.on('disconnect', () => {
        console.log("you are disconnected");
    });

    await socket.on('exit', (userList) => {
        console.log("Saiu: ", userList);
        userListDb = userList;
    });
    

    window.document.getElementById("message").addEventListener("keydown", (ev) => {
        
        if(ev.key === "Enter") {
            ev.preventDefault();
            sendMessage();
        }
    });

    window.document.getElementById('message-button').addEventListener('click', () => {
        sendMessage();
        
    });

    // data = {name: string, msg: string}
    function otherUserMessage(data) {
        console.log(data);
        const listMessageElement = window.document.getElementById('listMessages');
        const newlistElement = window.document.createElement('li');

        newlistElement.innerText = `${data.name} says: ${data.msg}`;

        listMessageElement.appendChild(newlistElement);
    }

    // msg: string
    function yourMessage(msg) {
        const listMessageElement = window.document.getElementById('listMessages');
        const newlistElement = window.document.createElement('li');
        newlistElement.className = "yourUser";
        newlistElement.innerText = `Your says: ${msg}`
        
        listMessageElement.appendChild(newlistElement);
    }

    function getUsername() {
        const username = window.prompt("Enter Your Name: ");
        // const username = "nome ussuario"
        if(username === '')
            window.location.reload();
    
        return username;
    }
    
    function sendMessage() {
        const messageElement = document.getElementById('message');

        if(!selectedUser) {
            alert("User not selected");
            messageElement.value = "";
            return;
        }

        const user = userListDb.find(user => user.id === socket.id);
        const messageobj = {
            msg: messageElement.value,
            name: user.username,
            toid: selectedUser.id
        }
        messageElement.value = "";

        yourMessage(messageobj.msg);

        fetch('http://127.0.0.1:8092/new-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({toUser: selectedUser, message: messageobj.msg, id: yourself.id}),
        }).then(async (res) => {
            console.log(await res.json())
        })  

        socket.emit('getMsg', messageobj);
    }

    window.selectedUser  = function(userId) {
        const user = userListDb.find(user => user.id === userId);
        if(user.id === socket.id) {
            alert("cant send a message to yourself");
            return;
        }
        selectedUser = user;;

        const userSelectedElement = window.document.getElementById("userSelected");
        userSelectedElement.innerText = `Submit to user: ${user.username}`;
    }
});


// 

/* 
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `socket_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `message` (
  `id_message` int NOT NULL AUTO_INCREMENT,
  `to_user` int DEFAULT NULL,
  `message` varchar(700) DEFAULT NULL,
  `fk_id_user` int DEFAULT NULL,
  PRIMARY KEY (`id_message`),
  KEY `fk_id_user` (`fk_id_user`),
  CONSTRAINT `message_ibfk_1` FOREIGN KEY (`fk_id_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
*/