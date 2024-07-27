
document.addEventListener('DOMContentLoaded', async () => {
    const socket = io('http://127.0.0.1:8092');

    const username = getUsername();

    socket.emit("username", username);

    const usernameElement = document.getElementById('username');
    usernameElement.innerText = username;

    socket.on('userList', (userList, socketId) => {
        const listUsers = document.getElementById('list-users');
        listUsers.innerHTML = "";
        userList.forEach(user => {
            const userElement = document.createElement('li');
            userElement.id = "selectUser";

            userElement.className = 'list-group-item';
            userElement.innerHTML = `
                <button id="${user.id}" class="item-list">${socket.id === user.id ? "You: " + user.username : user.username}</button>
            `;
            
            listUsers.appendChild(userElement);
        });
    });

    socket.on('sendMsg', (data) => {
        // salvar menssagens em uma lista do proprio usuario
        console.log(data);
    });

    socket.on('connect', () => {
        console.log("you are connected");
    });

    socket.on('disconnect', () => {
        console.log("you are disconnected");
    });

    socket.on('exit', (userList) => {
        console.log(userList);
    });
 

    function getUsername() {
        // const username = window.prompt("Enter Your Name: ");
        const username = "nome ussuario"
        if(username === '')
            window.location.reload();
    
        return username;
    }
    
    function sendMessage(data) {
        socket.emit('getMsg', data);
    }
});