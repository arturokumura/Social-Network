const url = "https://ifsp.trojahn.uk/redesocial";

//----------LOGIN---------
async function login(email, password) {
    const user = {
        login: email,
        senha: password
    };

    const op = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    };
   
    try {
        const response = await fetch(url + "/usuarios/login", op);
        if(!response.ok) {
            throw new Error("Authentication error: " + response.status);
        }

        const data = await response.json();
        if(data.token) {
            localStorage.setItem("token", data.token);
            console.log("Login successful!");
            window.location.replace("index.html")
        } else {
            console.log("The server did not return a token: ", data);
        }
    }
    catch(e) {
        console.log("Error authenticating with the server: " + e.message);
    }
}

//----------CADASTRAR---------
async function signUp(name, email, password) {
    const newUser = {
        nome: name,
        login: email,
        senha: password,
    };

    const op = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
    };

    try {
        const response = await fetch(url + "/usuarios/", op);
        if(!response.ok) {
            throw new Error("Authentication error: " + response.status);
        }
        alert("Registration completed successfully!");
        window.location.replace("login.html");
    }
    catch(e) {
        console.log("Error registering: " + e.message);
    }
}

//----------LOGOUT----------
function logout() {
    localStorage.removeItem("token");
    window.location.replace("login.html");
}

//----------SIGN UP FORM----------
const signUpForm = document.querySelector("#signUpForm");
if(signUpForm) {
    signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.querySelector("#signUpInputUsername").value;
    const email = document.querySelector("#signUpInputEmail").value;
    const password = document.querySelector("#signUpInputPassword").value;
    signUp(username, email, password);
    })
}


//----------LOGIN FORM----------
const loginForm = document.querySelector("#loginForm");
if(loginForm) {
    loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.querySelector("#loginInputEmail").value;
    const password = document.querySelector("#loginInputPassword").value;
    login(email, password);
    });
}

