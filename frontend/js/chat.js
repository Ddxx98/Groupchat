document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chatMessages");
    const messageForm = document.getElementById("messageForm");
    const messageInput = document.getElementById("messageInput");
    const groupId = new URLSearchParams(window.location.search).get("groupId");

    const showUsersBtn = document.getElementById("showUsersBtn");
    const usersModal = document.getElementById("usersModal");
    const closeModal = document.getElementById("closeModal");
    const usersList = document.getElementById("usersList");

    const token = window.localStorage.getItem("token");
    const admin = window.localStorage.getItem("Admin");
    const loadedMessages = new Set();

    if (admin === "false") {
        showUsersBtn.style.display = "none";
    }

    if (showUsersBtn) {
        showUsersBtn.addEventListener("click", async () => {
            usersModal.style.display = "flex";
            try {
                const response = await axios.get(`http://localhost:3000/chats/users`, {
                    headers: { Authorization: `${token}` },
                });
                const users = response.data.users;
                console.log(users);
                usersList.innerHTML = "";

                users.forEach(user => {
                    const listItem = document.createElement("li");
                    listItem.textContent = user.name;
                    usersList.appendChild(listItem);

                    const deleteButton = document.createElement("button");
                    deleteButton.classList.add("delete-btn");
                    deleteButton.textContent = "Delete";
                    deleteButton.addEventListener("click", () => {
                        deleteUser(user.id);
                    });

                    const joinButton = document.createElement("button");
                    joinButton.classList.add("add-btn");
                    joinButton.textContent = "Add";
                    joinButton.addEventListener("click", () => {
                        addGroup(user.id);
                    });

                    const promoteButton = document.createElement("button");
                    promoteButton.classList.add("promote-btn");
                    promoteButton.textContent = "Promote";
                    promoteButton.addEventListener("click", () => {
                        promoteUser(user.id);
                    });

                    listItem.appendChild(joinButton);
                    listItem.appendChild(promoteButton);
                    listItem.appendChild(deleteButton);
                });
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        });
    }

    const addGroup = async (userId) => {
        console.log(userId);
        try {
            const response = await axios.post(
                `http://localhost:3000/group/add`,
                {
                    userId: userId,
                    groupId: groupId
                },
                { headers: { Authorization: `${token}` } }
            );
            window.location.href = `./chat.html?groupId=${groupId}`;
        } catch (err) {
            if (err.response.status === 409) {
                return alert("User is already a member of this group.");
            }
            console.error("Error joining group:", err);
            alert("Failed to add user to group.");
        }
    };

    const deleteUser = async (userId) => {
        console.log(userId);
        try {
            const response = await axios.delete(
                `http://localhost:3000/group/delete?userId=${userId}&groupId=${groupId}`,
                { headers: { Authorization:`${token}` } }
            );
            console.log(response.data);
            window.location.href = `./chat.html?groupId=${groupId}`;
        } catch (err) {
            console.error("Error leaving group:", err);
            alert("Failed to leave group.");
        }
    };

    closeModal.addEventListener("click", () => {
        usersModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === usersModal) {
            usersModal.style.display = "none";
        }
    });

    const promoteUser = async (userId) => {
        console.log(userId);
        try {
            const response = await axios.post(
                `http://localhost:3000/group/promote`,
                {
                    userId: userId,
                    groupId: groupId
                },
                { headers: { Authorization: `${token}` } }
            );
            window.location.href = `./chat.html?groupId=${groupId}`;
        } catch (err) {
            if (err.response.status === 409) {
                return alert(err.response.data.message);
            }
            console.error("Error promoting user:", err);
            alert("Failed to promote user.");
        }
    };

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
            window.location.href = "./login.html";
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
            window.location.href = "./group.html?groupId=${groupId}";
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