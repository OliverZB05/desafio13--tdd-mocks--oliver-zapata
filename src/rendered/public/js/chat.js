const socket = io(); // Se conecta al socket del server

let user;

const chatBox = document.getElementById("chatBox");

Swal.fire({
title: "Enter your name",
input: "text",
text: "Ingresa tu nombre de usuario",
inputValidator: (value) => {
    return !value && "You need to write something!";
},
allowOutsideClick: false,
}).then((result) => {
user = result.value;
socket.emit("auth", user);
});

// Chat client Input
chatBox.addEventListener("keyup", (evt) => {
if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
    socket.emit("message", { user, message: chatBox.value });
    chatBox.value = "";
    }
}
});

socket.on("messageLogs", (data) => {
let log = document.getElementById("messageLogs");
let messages = "";
data.forEach((message) => {
    messages += `<div class="message">
                    <b>${message.user}: </b>
                    <p>${message.message}</p>
                </div>`;
});
log.innerHTML = messages;
});

socket.on("newUser", (data) => {
Swal.fire({
    title: "New user connected!",
    toast: "true",
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    title: data,
    icon: "success",
});
});