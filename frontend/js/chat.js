document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chatMessages");
    const messageForm = document.getElementById("messageForm");
    const messageInput = document.getElementById("messageInput");

    const token = window.localStorage.getItem("token");
    const loadMessages = async () => {
        try {
            const msg = await axios.get("http://localhost:3000/chats", {
                headers: {
                    Authorization: `${token}`
                }
            });
            console.log(msg);
            msg.data.chats.forEach(chat => {
                displayMessage(chat.sender, chat.message);
            });
        } catch (err) {
            console.log(err);
        }
    };

    const displayMessage = (sender, message) => {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("chat-message");

        const senderElement = document.createElement("div");
        senderElement.classList.add("sender");
        senderElement.textContent = sender;

        const messageElement = document.createElement("div");
        messageElement.classList.add("message-text");
        messageElement.textContent = message;

        messageContainer.appendChild(senderElement);
        messageContainer.appendChild(messageElement);
        chatMessages.appendChild(messageContainer);

        chatMessages.scrollTop = chatMessages.scrollHeight; 
    };

    const sendMessage = async (sender, message) => {
        try {
            const response = await axios.post("http://localhost:3000/chats", {
                sender: sender,
                message: message
            }, {
                headers: {
                    Authorization: `${token}`
                }
            });
            console.log(response);
            displayMessage(sender, message);
        } catch (err) {
            console.log(err);
        }
    };

    loadMessages();

    messageForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const message = messageInput.value.trim();
        if (message) {
            sendMessage("You", message);
            messageInput.value = "";
        }
    });
});  