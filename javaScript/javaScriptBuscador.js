const contenedorBusqueda = document.getElementById("contenedorBusqueda-series");
const btnPrevBusqueda = document.getElementById("prev");
const btnNextBusqueda = document.getElementById("next");
const paginaActualBusqueda = document.getElementById("contenedor-pagina-busqueda");

buscadorPager = new Pager(`https://api.jikan.moe/v4/anime?q=A&limit=12`, 12, btnNextBusqueda, btnPrevBusqueda, contenedorBusqueda, paginaActualBusqueda);

const buscador = document.getElementById("buscador");
const buscadorMovile = document.getElementById("buscadorMovile");
const mainBusqueda = document.getElementById("contenido-busqueda");
const mainPrincipal = document.querySelectorAll(".contenido-principal");

function hideBusqueda() {
    mainPrincipal.forEach(element => {
        console.log(element);
        element.classList.remove("ocultar-menu");
        element.classList.add("fadeIn");
        element.classList.remove("fadeOut");
    });
    mainBusqueda.classList.add("ocultar-menu");
    mainBusqueda.classList.remove("fadeIn");
    mainBusqueda.classList.add("fadeOut");
}

function showBusqueda() {
    mainPrincipal.forEach(element => {
        element.classList.add("ocultar-menu");
        element.classList.remove("fadeIn");
        element.classList.add("fadeOut");
    });
    mainBusqueda.classList.remove("ocultar-menu");
    mainBusqueda.classList.remove("fadeOut");
    mainBusqueda.classList.add("fadeIn");
}

if (buscador) buscador.addEventListener("input", () => {
    SendSearch(buscador);
});

if (buscadorMovile) buscadorMovile.addEventListener("input", () => {
    SendSearch(buscadorMovile);
});

let time;
function SendSearch(searcher){
    clearTimeout(time);
    time = setTimeout(() => {
        hacerBusqueda(searcher.value.trim());
    }, 1000);
}

async function hacerBusqueda(query) {

    if (query.length < 3) {
        contenedorBusqueda.innerHTML = "";
        hideBusqueda();
        return;
    }
    buscadorPager.updateUrl(`https://api.jikan.moe/v4/anime?q=${query}&limit=12`);
    buscadorPager.GetAnimes();
    showBusqueda();
}