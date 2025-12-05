const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section");
const loginForm = loginSection.querySelector("form");
const registerForm = registerSection.querySelector("form");
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

if (showRegisterLink) {
    showRegisterLink.addEventListener('click', function (e) {
        e.preventDefault();
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
    });
}

if (showLoginLink) {
    showLoginLink.addEventListener('click', function (e) {
        e.preventDefault();
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
    });
}


registerSection.querySelector(".btn-login").addEventListener("click", () => {
    const username = registerForm.usuario.value.trim();
    const password = registerForm["password"].value.trim();
    const confirmPassword = registerForm["confirmar-password"].value.trim();
    const email = registerForm.correo.value.trim();

    if (!username || !password || !confirmPassword || !email) {
        alert("Por favor completa todos los campos");
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

    usuarios.push({ username, password, email });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Usuario registrado correctamente");

    registerForm.reset();
    registerSection.style.display = "none";
    loginSection.style.display = "block";
});

loginSection.querySelector(".btn-login").addEventListener("click", () => {
    const username = loginForm.usuario.value.trim();
    const password = loginForm.password.value.trim();

    if (!username || !password) {
        alert("Por favor completa todos los campos");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const usuarioEncontrado = usuarios.find(u => u.username === username && u.password === password);

    if (usuarioEncontrado) {
        alert(`¡Bienvenido ${username}!`);
        loginForm.reset();
    } else {
        alert("Usuario o contraseña incorrectos");
    }
});
