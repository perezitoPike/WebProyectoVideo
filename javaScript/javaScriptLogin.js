const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section");
const loginForm = loginSection.querySelector("form");
const registerForm = registerSection.querySelector("form");
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

if (showRegisterLink) {
    showRegisterLink.addEventListener('click', () => {
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
    });
}

if (showLoginLink) {
    showLoginLink.addEventListener('click', () => {
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
    });
}


registerSection.querySelector("button").addEventListener("click", () => {
    const username = registerForm["usuario"].value.trim();
    const password = registerForm["password"].value.trim();
    const confirmPassword = registerForm["confirmar-password"].value.trim();
    const email = registerForm["correo"].value.trim();

    if (!username || !password || !confirmPassword || !email) {
        alert("Por favor completa todos los campos");
        return;
    }

    if (password.length < 8) {
        alert("La contraseña tiene que tener almenos 8 caracteres")
        return;
    }

    if (!email.includes('@')) {
        alert("Ingrese un correo electronico valido");
        return;
    }

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    if (usuarios.find(u => u.username === username)) {
        alert("El usuario ya existe");
        return;
    }

    usuarios.push({
        "username": username,
        "password": password,
        "email": email
    });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    // registerForm.reset();
    let btnClose = alertaPopUp(`Registro exitoso\n Bienvenido ${username}`);
    btnClose.addEventListener('click', () => {
        window.location.href = "/html/directorio.html";
    });
});

loginSection.querySelector("button").addEventListener("click", () => {
    const username = loginForm["usuario"].value.trim();
    const password = loginForm["password"].value.trim();

    if (!username || !password) {
        alert("Por favor completa todos los campos");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const usuarioEncontrado = usuarios.find(u => u.username === username && u.password === password);

    if (usuarioEncontrado) {
        // loginForm.reset();
        btnClose = alertaPopUp(`Bienvenido ${username}`);
        btnClose.addEventListener('click', () => {
            window.location.href = "/html/directorio.html";
        });
    } else {
        alert("Usuario o contraseña incorrectos");
    }
});