document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chatMessages");
    const messageForm = document.getElementById("messageForm");
    const messageInput = document.getElementById("messageInput");

    const token = window.localStorage.getItem("token");
    const loadedMessages = new Set();

    const loadMessages = async () => {
        try {
            const response = await axios.get("http://localhost:3000/chats", {
                headers: { Authorization: `${token}` },
            });

            let isNewMessageAdded = false;

            response.data.chats.forEach((chat) => {
                if (!loadedMessages.has(chat.id)) {
                    displayMessage(chat.sender, chat.message);
                    loadedMessages.add(chat.id);
                    isNewMessageAdded = true;
                }
            });

            if (isNewMessageAdded) {
                scrollToLatestMessage();
            }
        } catch (err) {
            console.error(err);
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

        if (sender === "You") {
            messageContainer.classList.add("you");
        } else {
            messageContainer.classList.add("other");
        }

        chatMessages.appendChild(messageContainer);
    };

    const sendMessage = async (sender, message) => {
        try {
            const response = await axios.post(
                "http://localhost:3000/chats",
                { sender: sender, message: message },
                { headers: { Authorization: `${token}` } }
            );

            if (response.data && response.data.chat) {
                displayMessage(response.data.chat.sender, response.data.chat.message);
                loadedMessages.add(response.data.chat.id);
                scrollToLatestMessage();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const scrollToLatestMessage = () => {
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: "smooth",
        });
    };

    messageForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const message = messageInput.value.trim();
        if (message) {
            sendMessage("You", message);
            messageInput.value = "";
        }
    });

    setInterval(loadMessages, 1000);
});