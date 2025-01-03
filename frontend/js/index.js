document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => (msg.textContent = ""));

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    let isValid = true;

    if (name === "") {
        document.getElementById("nameError").textContent = "Name is required.";
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById("emailError").textContent = "Enter a valid email.";
        isValid = false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        document.getElementById("phoneError").textContent = "Enter a valid phone number.";
        isValid = false;
    }

    if (password.length < 6) {
        document.getElementById("passwordError").textContent = "Password must be at least 6 characters long.";
        isValid = false;
    }

    if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").textContent = "Passwords do not match.";
        isValid = false;
    }

    if (isValid) {
        try {
            const userId = await axios.post("http://localhost:3000/signup", {
                name: name,
                phone: phone,
                email: email,
                password: password
            });
            console.log(userId);
            document.getElementById("signupForm").reset();
            window.location.href = "./login.html";
        } catch (err) {
            console.log(err);
            if (err.response.status === 409) {
                if (err.response.data.message === "Email already exists") {
                    document.getElementById("emailError").textContent = "Email already exists.";
                } else if (err.response.data.message === "Phone number already exists") {
                    document.getElementById("phoneError").textContent = "Phone number already exists.";
                }
            } else {
                document.getElementById("serverError").textContent = "Internal Server Error.";
            }
        }
    }
});