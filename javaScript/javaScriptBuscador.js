const contenedorBusqueda = document.getElementById("contenedorBusqueda-series");
const btnPrevBusqueda = document.getElementById("prev");
const btnNextBusqueda = document.getElementById("next");
const paginaActualBusqueda = document.getElementById("contenedor-pagina-busqueda");
const buscador = document.getElementById("buscador");
const mainBusqueda = document.getElementById("contenido-busqueda");
const mainPrincipal = document.getElementById("contenido-principal");

let pagina = 1;
let textoBusqueda = "";

function mostrarResultados(lista) {
    contenedorBusqueda.innerHTML = "";

    lista.forEach(item => {
        const card = `
            <article class="tarjeta-serie">
                <div class="img-portada">
                    <img src="${item.images.jpg.image_url}" alt="${item.title}">
                </div>
                <div class="info-tarjetas">
                    <h3>${item.title}</h3>
                    <p>${item.synopsis ? item.synopsis.slice(0, 100) + "..." : "Sin descripción"}</p>
                    <a href="informacion.html?id=${item.mal_id}">
                        <button class="btn-vermas">Ver</button>
                    </a>
                </div>
            </article>
        `;
        contenedorBusqueda.innerHTML += card;
    });
}

btnNextBusqueda.addEventListener("click", () => {
    pagina++;
    paginaActualBusqueda.textContent = pagina;
    traerAnimeBuscados();
});

btnPrevBusqueda.addEventListener("click", () => {
    if (pagina > 1) {
        pagina--;
        paginaActualBusqueda.textContent = pagina;
        traerAnimeBuscados();
    }
});

let time;
if(buscador)buscador.addEventListener("input", () => {
    clearTimeout(time);
    time = setTimeout(() => {
        hacerBusqueda(buscador.value.trim());
    }, 1000);
});

async function hacerBusqueda(query) {

    if (query.length < 3) {
        contenedorBusqueda.innerHTML = "";
        mainPrincipal.classList.remove("ocultar-menu");
        mainBusqueda.classList.add("ocultar-menu");
        return;
    }
    mainPrincipal.classList.add("ocultar-menu");
    mainBusqueda.classList.remove("ocultar-menu");

    try {
        const respuesta = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=12`);
        const data = await respuesta.json();

        if (!data.data) {
            contenedorBusqueda.innerHTML = "<p>No encontrado</p>";
            return;
        }

        mostrarResultados(data.data);

    } catch (e) {
        contenedorBusqueda.innerHTML = `<p style="color:red">Error en la API (espera unos segundos)</p>`;
    }
}

