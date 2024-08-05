
document.addEventListener('DOMContentLoaded', async () => {
    const socket = io('http://127.0.0.1:8092');

    const username = getUsername();
    let userListDb = [];
    let selectedId;

    socket.emit("username", username);

    // const usernameElement = document.getElementById('username');
    // usernameElement.innerText = username;

    socket.on('userList', (userList, socketId) => {
        userListDb = userList;

        const listUsers = document.getElementById('list-users');
        listUsers.innerHTML = "";
        userList.forEach(user => {
            const userElement = document.createElement('li');
            userElement.id = "sotavioelectUser";
            
            userElement.className = 'list-group-item';
            userElement.innerHTML = `
                <button id="${user.id}" onclick="selectedUser('${user.id}')" class="item-list-button">${socket.id === user.id ? "You: " + user.username : user.username}</button>
            `;
            
            listUsers.appendChild(userElement);
        });
    });

    socket.on('sendMsg', (data) => {
        // salvar menssagens em uma lista do proprio usuario
        console.log(data);
        const listMessageElement = window.document.getElementById('listMessages');
        const newlistElement = window.document.createElement('li');

        newlistElement.innerText = `${data.name} says: ${data.msg}`

        listMessageElement.appendChild(newlistElement);
        // <li>ussuario says: message to usser</li>
    });

    socket.on('connect', () => {
        console.log("you are connected");
    });

    socket.on('disconnect', () => {
        console.log("you are disconnected");
    });

    socket.on('exit', (userList) => {
        console.log(userList);
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

    function getUsername() {
        const username = window.prompt("Enter Your Name: ");
        // const username = "nome ussuario"
        if(username === '')
            window.location.reload();
    
        return username;
    }
    
    function sendMessage() {
        const messageElement = document.getElementById('message');

        if(!selectedId) {
            alert("User not selected");
            messageElement.value = "";
            return;
        }

        const user = userListDb.find(user => user.id === socket.id);
        const messageobj = {
            msg: messageElement.value,
            name: user.username,
            toid: selectedId
        }
        messageElement.value = "";

        const listMessageElement = window.document.getElementById('listMessages');
        const newlistElement = window.document.createElement('li');
        newlistElement.className = "yourUser";
        newlistElement.innerText = `Your says: ${messageobj.msg}`
        
        listMessageElement.appendChild(newlistElement);


        socket.emit('getMsg', messageobj);
    }

    window.selectedUser  = function(userId) {
        const user = userListDb.find(user => user.id === userId);
        if(user.id === socket.id) {
            alert("cant send a message to yourself");
            return;
        }
        selectedId = userId;

        const userSelectedElement = window.document.getElementById("userSelected");
        userSelectedElement.innerText = `Submit to user: ${user.username}`;
    }
});