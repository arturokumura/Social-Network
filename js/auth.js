const url = "https://ifsp.trojahn.uk/redesocial";

function showError(elementId, message) {
    const el = document.querySelector("#" + elementId);
    if (el) {
        el.textContent = message;
    } else {
        alert(message);
    }
}

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
            showError("loginError", "Login ou senha incorretos.");
            return;
        }

        const data = await response.json();
        if(data.token) {
            localStorage.setItem("token", data.token);
            window.location.replace("index.html")
        } else {
            showError("loginError", "Não foi possível entrar. Tente novamente.");
        }
    }
    catch(e) {
        console.log("Error authenticating with the server: " + e.message);
        showError("loginError", "Erro de conexão com o servidor.");
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
        if(response.status === 409 || response.status === 400) {
            showError("signUpError", "Esse login já está cadastrado ou os dados são inválidos.");
            return;
        }
        window.location.replace("sucessScreen.html");
    }
    catch(e) {
        alert("Não foi possível criar a conta. Tente novamente.");
        console.log("Error registering: " + e.message);
    }
}

//----------LOGOUT----------
function logout() {
    localStorage.removeItem("token");
    window.location.replace("login.html");
}

const logOutButton = document.querySelector("#logoutButton");
if (logOutButton) {
    logOutButton.addEventListener("click", logout);
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

