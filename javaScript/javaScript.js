
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');

const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

showRegisterLink.addEventListener('click', function (e) {
    e.preventDefault(); // Evita que recargue la página
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
});

showLoginLink.addEventListener('click', function (e) {
    e.preventDefault();
    registerSection.style.display = 'none';
    loginSection.style.display = 'block';
});
