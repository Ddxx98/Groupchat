document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    document.getElementById("emailError").textContent = "";
    document.getElementById("passwordError").textContent = "";
    const url = "https://backend-one-lyart-27.vercel.app";

    let isValid = true;

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById("emailError").textContent = "Enter a valid email address.";
        isValid = false;
    }

    if (password.length === 0) {
        document.getElementById("passwordError").textContent = "Password is required.";
        isValid = false;
    }

    if (isValid) {
        try {
            const response = await axios.post(`${url}/login`, {
                email: email,
                password: password
            });
            console.log(response);
            window.localStorage.setItem("token", response.data.token);
            window.localStorage.setItem("username", response.data.name);
            document.getElementById("loginForm").reset();
            window.location.href = "./group.html";
        } catch (err) {
            console.log(err);
            if (err.response.status === 401) {
                document.getElementById("passwordError").textContent = "Invalid password.";
            } else if (err.response.status === 404) {
                document.getElementById("emailError").textContent = "User not found.";
            } else {
                console.log(err);
            }
        }
    }
});

