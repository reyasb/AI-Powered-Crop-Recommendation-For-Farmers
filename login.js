document.getElementById("loginForm").addEventListener("submit", loginUser);
async function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    if (email === "" || password === "") {
        alert("Please fill all fields.");
        return;
    }
    const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    const result = await response.json();
    if (result.success) {
        alert("Login Successful");
        window.location.href = "dashboard.html";
    } else {
        alert(result.message);
    }
}