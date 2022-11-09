const socket = io("http://localhost:3000");
const messageContainer = document.getElementById("message-container")!;
const messageForm = document.getElementById("send-container")!;
const messageInput = document.getElementById("message-input")! as HTMLInputElement;

const NAME = prompt("What is your name?");
appendMessage("You joined");
socket.emit("new-user", NAME);

interface ChatMessage {
    name: string
    message: string
}

socket.on("chat-message", (data: ChatMessage) => {
    appendMessage(`${data.name}: ${data.message}`);
});

socket.on("user-connected", (username: string) => {
    appendMessage(`${username} connected`);
});

socket.on("user-disconnected", (username: string) => {
    appendMessage(`${username} disconnected`);
});

messageForm.addEventListener("submit", e => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    socket.emit("send-chat-message", message);
    messageInput.value = "";
});

function appendMessage(message: string) {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}
