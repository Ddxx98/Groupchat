document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chatMessages");
    const messageForm = document.getElementById("messageForm");
    const messageInput = document.getElementById("messageInput");
    const groupId = new URLSearchParams(window.location.search).get("groupId");

    const token = window.localStorage.getItem("token");
    const loadedMessages = new Set();

    const loadMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/chats/getGroupChat?groupId=${groupId}`, {
                headers: { Authorization: `${token}` },
            });
            console.log(response.data);
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
                { sender: sender, message: message, groupId: groupId },
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
// document.addEventListener("DOMContentLoaded", () => {
//     const chatMessages = document.getElementById("chatMessages");
//     const messageForm = document.getElementById("messageForm");
//     const messageInput = document.getElementById("messageInput");
//     const token = window.localStorage.getItem("token");
//     const messagesKey = "chatMessages";
//     const maxMessages = 10;

//     const loadMessages = async (lastMessageId = null) => {
//         try {
//             const msg = await axios.get(`http://localhost:3000/chats?lastMessageId=${lastMessageId}`, {
//                 headers: {
//                     Authorization: `${token}`
//                 }
//             });

//             if (msg.data.chats) {
//                 msg.data.chats.forEach(chat => {
//                     displayMessage(chat.sender, chat.message, chat.id);
//                 });

//                 storeMessages(msg.data.chats);
//                 scrollToLatestMessage();
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     const displayMessage = (sender, message, messageId) => {
//         const messageContainer = document.createElement("div");
//         messageContainer.classList.add("chat-message");

//         const senderElement = document.createElement("div");
//         senderElement.classList.add("sender");
//         senderElement.textContent = sender;

//         const messageElement = document.createElement("div");
//         messageElement.classList.add("message-text");
//         messageElement.textContent = message;

//         messageContainer.appendChild(senderElement);
//         messageContainer.appendChild(messageElement);

//         if (sender === "You") {
//             messageContainer.classList.add("you");
//         } else {
//             messageContainer.classList.add("other");
//         }

//         chatMessages.appendChild(messageContainer);
//     };

//     const sendMessage = async (sender, message) => {
//         try {
//             const response = await axios.post("http://localhost:3000/chats", {
//                 sender: sender,
//                 message: message
//             }, {
//                 headers: {
//                     Authorization: `${token}`
//                 }
//             });

//             if (response.data.chat) {
//                 displayMessage(sender, message, response.data.chat.id);
//                 storeMessages([response.data.chat]);
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     const storeMessages = (newMessages) => {
//         let storedMessages = JSON.parse(localStorage.getItem(messagesKey)) || [];

//         storedMessages.push(...newMessages);

//         if (storedMessages.length > maxMessages) {
//             storedMessages = storedMessages.slice(-maxMessages);
//         }

//         localStorage.setItem(messagesKey, JSON.stringify(storedMessages));
//     };

//     const loadStoredMessages = () => {
//         const storedMessages = JSON.parse(localStorage.getItem(messagesKey)) || [];

//         const messagesToShow = storedMessages.slice(-maxMessages);
//         messagesToShow.forEach(chat => {
//             displayMessage(chat.sender, chat.message, chat.id);
//         });
//     };

//     const scrollToLatestMessage = () => {
//         chatMessages.scrollTop = chatMessages.scrollHeight;
//     };

//     setInterval(() => {
//         const lastMessageId = getLastMessageId();
//         loadMessages(lastMessageId);
//     }, 1000);

//     const getLastMessageId = () => {
//         const storedMessages = JSON.parse(localStorage.getItem(messagesKey)) || [];
//         if (storedMessages.length > 0) {
//             return storedMessages[storedMessages.length - 1].id;
//         }
//         return null;
//     };

//     messageForm.addEventListener("submit", (e) => {
//         e.preventDefault();

//         const message = messageInput.value.trim();
//         if (message) {
//             sendMessage("You", message);
//             messageInput.value = "";
//         }
//     });

//     loadStoredMessages();
// });