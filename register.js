const form = document.getElementById("registerForm");

form.addEventListener("submit", registerUser);

async function registerUser(event){

    event.preventDefault();

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const phone = document.getElementById("phone").value.trim();

    const password = document.getElementById("password").value;

    const confirmPassword = document.getElementById("confirmPassword").value;

    if(password !== confirmPassword){

        alert("Passwords do not match");

        return;

    }

    const response = await fetch("http://localhost:5000/api/register",{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            name,

            email,

            phone,

            password

        })

    });

    const result = await response.json();

    if(result.success){

        alert("Registration Successful");

        window.location.href="login.html";

    }

    else{

        alert(result.message);

    }

}