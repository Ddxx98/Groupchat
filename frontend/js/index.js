document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault(); 

    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => (msg.textContent = ""));

    let isValid = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

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
        document.getElementById("passwordError").textContent =
            "Password must be at least 6 characters long.";
        isValid = false;
    }

    if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").textContent =
            "Passwords do not match.";
        isValid = false;
    }

    if (isValid) {
        alert("Account created successfully!");
        document.getElementById("signupForm").reset();
    }
});