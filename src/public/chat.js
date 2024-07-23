
document.addEventListener('DOMContentLoaded', () => {
    const urlSearch = new URLSearchParams(window.location.search);
    
    const username = urlSearch.get('username');
    const room = urlSearch.get('room');

    const elementApr = document.getElementById('username');
    elementApr.textContent = elementApr.textContent.replace(/username/g, username);
    elementApr.textContent = elementApr.textContent.replace(/Sala/g, room);


    const socket = io('http://127.0.0.1:8091');
    
    socket.on('connect', () => {
      console.log('Connected to server');
      document.getElementById('status').textContent = 'Connected';
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      document.getElementById('status').textContent = 'Disconnected';
    });
  
    socket.on('message', (msg) => {
        console.log('Message from server:', msg);
      
        const messageList = document.getElementById('messages');
    
        console.log(messageList);
    //  const messageItem = document.createElement('li');
    //  messageItem.textContent = msg;
    //  messageList.appendChild(messageItem);
    });
  
    document.getElementById('sendMensage').addEventListener('click', () => {
        const message = document.getElementById('menssagem').value;
        console.log(message);

        socket.emit('message', message);
        document.getElementById('menssagem').value = '';
    });
});
  