const socket = io('http://127.0.0.1:8091');
document.addEventListener('DOMContentLoaded', () => {

    setSelectRoom();

    socket.on('connect', () => {
        console.log("Connectado ao servidor");
    });

    socket.on('disconnect', () => {
        console.log("Disconectado do servidor");
    });
})


function setSelectRoom() {
    const selectRoom = document.getElementById('select_room');
    
    socket.emit('get_users', users => {
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.usermame;
            option.innerText = user.usermame + " : User";
            selectRoom.appendChild(option)
        });
    });
}




