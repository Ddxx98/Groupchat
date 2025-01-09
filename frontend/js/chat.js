document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chatMessages");
    const messageForm = document.getElementById("messageForm");
    const messageInput = document.getElementById("messageInput");
    const groupId = new URLSearchParams(window.location.search).get("groupId");

    const showUsersBtn = document.getElementById("showUsersBtn");
    const usersModal = document.getElementById("usersModal");
    const closeModal = document.getElementById("closeModal");
    const usersList = document.getElementById("usersList");
    const fileInput = document.getElementById("fileInput");
    const fileBtn = document.getElementById("attachSymbol");

    const token = window.localStorage.getItem("token");
    const admin = window.localStorage.getItem("Admin");
    const username = window.localStorage.getItem("username");
    const loadedMessages = new Set();

    const url = "https://backend-one-lyart-27.vercel.app";

    const socket = io(url,{
        transports: ["polling"],
        auth: {
            token: token,
        },
    });

    socket.emit("joinGroup", groupId);

    fileBtn.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("groupId", groupId);

            try {
                const response = await axios.post(`${url}/chats/upload`, formData, {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                socket.emit("message", { message: response.data.url, groupId, type: "file" }, (response) => {
                    if (response.status === 200) {
                        displayMessage(response.message.sender, response.message.message, response.message.type);
                        loadedMessages.add(response.message.id);
                        scrollToLatestMessage();
                    }
                });
            } catch (error) {
                console.error("Failed to upload file:", error);
            }
        }
    });

    if (admin === "false") {
        showUsersBtn.style.display = "none";
    }

    if (showUsersBtn) {
        showUsersBtn.addEventListener("click", async () => {
            usersModal.style.display = "flex";
            try {
                const response = await axios.get(`${url}/chats/users`, {
                    headers: { Authorization: `${token}` },
                });
                const users = response.data.users;
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
             await axios.post(
                `${url}/group/add`,
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
            await axios.delete(
                `${url}/group/delete?userId=${userId}&groupId=${groupId}`,
                { headers: { Authorization:`${token}` } }
            );
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
            await axios.post(
                `${url}/group/promote`,
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
            const response = await axios.get(`${url}/chats/getGroupChat?groupId=${groupId}`, {
                headers: { Authorization: `${token}` },
            });
            let isNewMessageAdded = false;

            response.data.chats.forEach((chat) => {
                if (!loadedMessages.has(chat.id)) {
                    displayMessage(chat.sender, chat.message, chat.type);
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

    const displayMessage = (sender, message, type) => {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("chat-message");

        const senderElement = document.createElement("div");
        senderElement.classList.add("sender");
        senderElement.textContent = sender;

        const messageElement = document.createElement("div");
        messageElement.classList.add("message-text");
        if (type === "text") {
            messageElement.textContent = message;
        } else if (type === "file") {
            if (message.endsWith(".mp4") || message.endsWith(".mov")) {
                const video = document.createElement("video");
                video.controls = true;
                video.src = message;
                messageElement.appendChild(video);
            } else if (message.endsWith(".png") || message.endsWith(".jpg") || message.endsWith(".jpeg")) {
                const img = document.createElement("img");
                img.src = message;
                messageElement.appendChild(img);
            } else {
                const fileLink = document.createElement("a");
                fileLink.href = message;
                const fileName = message.split("/").pop();
                fileLink.textContent = fileName;
                fileLink.target = "_blank";
                messageElement.appendChild(fileLink);
            }
        }

        messageContainer.appendChild(senderElement);
        messageContainer.appendChild(messageElement);

        if (sender === username) {
            messageContainer.classList.add("you");
        } else {
            messageContainer.classList.add("other");
        }

        chatMessages.appendChild(messageContainer);
    };

    socket.on('message', ({ sender, message, type }) => {
        displayMessage(sender, message, type);
        scrollToLatestMessage();
    });

    const sendMessage = async ( message) => {
        try {
            socket.emit("message", {  message, groupId, type: "text" },(response) => {
                if(response.status == 200){
                    displayMessage(response.message.sender, response.message.message, response.message.type);
                    loadedMessages.add(response.message.id);
                    scrollToLatestMessage();
                } else{
                    alert(response.message);
                    window.location.href = "./group.html";
                }
            })
        } catch (err) {
            window.location.href = "./group.html";
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
            sendMessage( message);
            messageInput.value = "";
        }
    });
    loadMessages();
});