import { io } from "socket.io-client";

document.addEventListener('DOMContentLoaded', () => {
    console.log("Antes");
    const socket = io('http://127.0.0.1:8091');
    console.log("Depois");
    // socket.on('connect', () => {
    //   console.log('Connected to server');
    //   document.getElementById('status').textContent = 'Connected';
    // });
  
    // socket.on('disconnect', () => {
    //   console.log('Disconnected from server');
    //   document.getElementById('status').textContent = 'Disconnected';
    // });
  
    // socket.on('message', (msg) => {
    //   console.log('Message from server:', msg);
    //   const messageList = document.getElementById('messages');
    //   const messageItem = document.createElement('li');
    //   messageItem.textContent = msg;
    //   messageList.appendChild(messageItem);
    // });
  
    // document.getElementById('sendMessage').addEventListener('click', () => {
    //   const message = document.getElementById('messageInput').value;
    //   socket.emit('message', message);
    //   document.getElementById('messageInput').value = '';
    // });
});
  