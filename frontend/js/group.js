document.addEventListener("DOMContentLoaded", () => {
    const groupList = document.getElementById("groupList");
    const createGroupBtn = document.getElementById("createGroupBtn");
    const createGroupSection = document.getElementById("createGroupSection");
    const createGroupForm = document.getElementById("createGroupForm");
    const groupNameInput = document.getElementById("groupNameInput");
    const cancelGroupBtn = document.getElementById("cancelGroupBtn");

    const token = localStorage.getItem("token");

    const loadGroups = async () => {
        try {
            const response = await axios.get("http://localhost:3000/group", {
                headers: { Authorization: `${token}` }
            });
            const groups = response.data.groups;
            groupList.innerHTML = "";

            groups.forEach((group) => {
                const groupItem = document.createElement("div");
                groupItem.classList.add("group-item");

                const groupName = document.createElement("span");
                groupName.textContent = group.groupName;

                const joinButton = document.createElement("button");
                joinButton.classList.add("join-btn");
                joinButton.textContent = "Join";
                joinButton.addEventListener("click", () => {
                    joinGroup(group.id);
                });

                groupItem.appendChild(groupName);
                groupItem.appendChild(joinButton);
                groupList.appendChild(groupItem);
            });
        } catch (err) {
            console.error("Error fetching groups:", err);
        }
    };

    const joinGroup = async (groupId) => {
        try {
            const response = await axios.post(
                `http://localhost:3000/group/join`,
                {groupId: groupId},
                { headers: { Authorization: `${token}` } }
            );
            window.location.href = `./chat.html?groupId=${groupId}`;
            loadGroups(); 
        } catch (err) {
            console.error("Error joining group:", err);
            alert("Failed to join group.");
        }
    };

    createGroupBtn.addEventListener("click", () => {
        createGroupSection.classList.remove("hidden");
    });

    cancelGroupBtn.addEventListener("click", () => {
        createGroupSection.classList.add("hidden");
        groupNameInput.value = "";
    });

    createGroupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const groupName = groupNameInput.value.trim();
        if (!groupName) return alert("Group name is required.");

        try {
            await axios.post(
                "http://localhost:3000/group",
                { groupName: groupName },
                { headers: { Authorization: `${token}` } }
            );
            groupNameInput.value = "";
            createGroupSection.classList.add("hidden");
            loadGroups();
        } catch (err) {
            console.error("Error creating group:", err);
        }
    });

    loadGroups();
});