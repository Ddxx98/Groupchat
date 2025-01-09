document.addEventListener("DOMContentLoaded", () => {
    const groupList = document.getElementById("groupList");
    const createGroupBtn = document.getElementById("createGroupBtn");
    const createGroupSection = document.getElementById("createGroupSection");
    const createGroupForm = document.getElementById("createGroupForm");
    const groupNameInput = document.getElementById("groupNameInput");
    const cancelGroupBtn = document.getElementById("cancelGroupBtn");

    const token = localStorage.getItem("token");
    const url = "https://backend-one-lyart-27.vercel.app";

    const loadGroups = async () => {
        try {
            const response = await axios.get(`${url}/group`, {
                headers: { Authorization: `${token}` }
            });
            const groups = response.data.groups;
            groupList.innerHTML = "";

            groups.forEach((group) => {
                const groupItem = document.createElement("div");
                groupItem.classList.add("group-item");

                const groupName = document.createElement("span");
                groupName.textContent = group.groupName;

                groupName.addEventListener("click", () => {
                    insideGroup(group.id);
                });

                groupItem.appendChild(groupName);
                groupList.appendChild(groupItem);
            });
        } catch (err) {
            window.location.href = "./login.html";
            console.error("Error fetching groups:", err);
        }
    };

    const insideGroup = async (groupId) => {
        try{
            const response = await axios.post(
                `${url}/group/insideGroup`,
                {groupId: groupId},
                { headers: { Authorization: `${token}` } }
            );
            window.localStorage.setItem("Admin", response.data.isAdmin);
            if(response.data.status === 409){
                return alert("User is not a member of the group.");
            }
            window.location.href = `./chat.html?groupId=${groupId}`;
        } catch (err) {
            if(err.response.status === 409){
                return alert("User is not a member of the group.");
            }
            console.error("Error joining group:", err);
        }
    }

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
                `${url}/group`,
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