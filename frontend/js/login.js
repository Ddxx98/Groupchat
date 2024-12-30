document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    document.getElementById("emailError").textContent = "";
    document.getElementById("passwordError").textContent = "";

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
            const response = await axios.post("http://localhost:3000/login", {
                email: email,
                password: password
            });
            console.log(response);
            document.getElementById("loginForm").reset();
            window.location.href = "/home.html";
        } catch (err) {
            console.log(err);
            if (err.response.status === 401) {
                if (err.response.data.message === "Invalid email") {
                    document.getElementById("emailError").textContent = "Email does not exist.";
                } else if (err.response.data.message === "Invalid password") {
                    document.getElementById("passwordError").textContent = "Invalid password.";
                }
            }
        }
    }
});

