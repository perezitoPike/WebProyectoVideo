window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 1) {
        header.classList.add("scroll-activo");
    }
    else header.classList.remove("scroll-activo");
});

const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');

const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

if (showRegisterLink) {
    showRegisterLink.addEventListener('click', function (e) {
        e.preventDefault(); // Evita que recargue la página
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
