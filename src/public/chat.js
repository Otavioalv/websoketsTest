
document.addEventListener('DOMContentLoaded', () => {
    const urlSearch = new URLSearchParams(window.location.search);
    
    const username = urlSearch.get('username');
    const room = urlSearch.get('room');

    const elementApr = document.getElementById('username');
    elementApr.innerText = `Ola ${username} | Sala: ${room}`



    const socket = io('http://127.0.0.1:8091');

    // emit(nome_do_evento, informação), envia informações
    socket.emit("select_room", {username, room}, response => {
      response.forEach(element => {
          // console.log("menssagem: ", element);
          createNewMessage(element, username);
          window.scrollTo(0, document.body.scrollHeight);
      });
    });

    
    socket.on('connect', () => {
      console.log('Connected to server');
      // document.getElementById('status').textContent = 'Connected';
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      document.getElementById('status').textContent = 'Disconnected';
    });
  
    // on = escutar evento
    socket.on('message', (data) => {
        createNewMessage(data, username);
    });
  
    document.getElementById('sendMensage').addEventListener('click', () => {
        const message = document.getElementById('menssagem').value;
        
        const data = {
          room,
          username,
          message
        }

        socket.emit('message', data);
        document.getElementById('menssagem').value = '';
        window.scrollTo(0, document.body.scrollHeight);
    });

    document.getElementById('menssagem').addEventListener('keydown', (e) => {
      if(e.key == "Enter"){
        const message = document.getElementById('menssagem').value;
        
        const data = {
          room,
          username,
          message
        }

        socket.emit('message', data);
        document.getElementById('menssagem').value = '';
        window.scrollTo(0, document.body.scrollHeight);
      }
    })

    document.getElementById('logout').addEventListener('click', (event) => {
      window.location.href = "index.html"
    }); 
});


function createNewMessage(data, username) {
    const messageList = document.getElementById('messages');
    const nowDate = new Date(data.createdAt);
    const today = nowDate.toLocaleDateString();

    const newMessage = document.createElement('div');
    newMessage.innerHTML = `
      <label class="form-label">
          <strong>${username}</strong>
          <span>${data.text} - ${today}</span>
          <span id="status"></span>
      </label>
    `

    messageList.appendChild(newMessage);
}
  