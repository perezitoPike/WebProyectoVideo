const btnClosePopUp = document.getElementById("cerrarPopup");

function alertaPopUp(mensaje) {
    const popup = document.getElementById("popup");
    const texto = document.getElementById("popup-texto");

    texto.textContent = mensaje;
    popup.classList.add("mostrar");
    return btnClosePopUp;
}

btnClosePopUp.addEventListener("click", () => {
    document.getElementById("popup").classList.remove("mostrar");
});