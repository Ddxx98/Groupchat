document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chatMessages");
    const messageForm = document.getElementById("messageForm");
    const messageInput = document.getElementById("messageInput");

    const userJoinMessage = (userName) => {
        const joinMessage = document.createElement("p");
        joinMessage.textContent = `${userName} has joined the chat.`;
        joinMessage.classList.add("joined");
        chatMessages.appendChild(joinMessage);
        scrollToBottom();
    };

    const scrollToBottom = () => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    setTimeout(() => {
        userJoinMessage("John Doe");  
    }, 2000);

    messageForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const message = messageInput.value.trim();
        if (message) {
            const userName = "You"; 

            const messageContainer = document.createElement("div");
            messageContainer.classList.add("chat-message");

            const senderElement = document.createElement("div");
            senderElement.classList.add("sender");
            senderElement.textContent = userName;

            const messageElement = document.createElement("div");
            messageElement.classList.add("message-text");
            messageElement.textContent = message;
            if (userName === "You") { 
                messageElement.classList.add("self");
            }

            messageContainer.appendChild(senderElement);
            messageContainer.appendChild(messageElement);
            chatMessages.appendChild(messageContainer);

            messageInput.value = "";
            scrollToBottom();
        }
    });
});  