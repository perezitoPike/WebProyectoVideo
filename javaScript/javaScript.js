// const maximoTitulo = 1;
// const maximoDescripcion = 3;

// function limitarTextoTarjetas(etiquetaClase) {
//     const elementos = document.querySelectorAll(etiquetaClase);
//     console.log(elementos);
//     elementos.forEach(item => {
//         const titulo = item.querySelector('h3');
//         const descripción = item.querySelector('p');
//         limitarTexto(titulo, 1, false);
//         limitarTexto(descripción, 2, true);
//     });
// }

// function limitarTexto(etiqueta, maxLineas, useETC) {            
//     const estilo = window.getComputedStyle(etiqueta);
//     console.log(estilo);
//     /* blockSize */
//     const altura = parseFloat(estilo.blockSize);
//     const maxAltura = altura * maxLineas;

//     let textoCompleto = etiqueta.textContent;

//     console.log(etiqueta.scrollHeight + " " + maxAltura);
//     if(etiqueta.scrollHeight <= maxAltura) return;

//     let palabras = textoCompleto.split(' ');
//     let nuevoTexto = '';

//     for (let i = 0; i < palabras.length; i++) {
//         nuevoTexto += palabras[i] + ' ';
//         etiqueta.textContent = nuevoTexto;
//         if(etiqueta.scrollHeight > maxAltura){
//             if(useETC)etiqueta.textContent = nuevoTexto.trim() + '...';
//             else etiqueta.textContent = nuevoTexto.trim();
//             break;
//         }        
//     }
// }

// limitarTextoTarjetas(".info-tarjetas");

// window.addEventListener("resize", () => {
//     limitarTextoTarjetas(".info-tarjetas");
// });

window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 1) {
        header.classList.add("scroll-activo");
    }
    else header.classList.remove("scroll-activo");
});
/* Conexion con el Api Jikan*/
let animesTop;
let listAnimesTop = [];
async function traerAnimesTop() {
    const url = `https://api.jikan.moe/v4/top/anime?page=1`;
    const resp = await fetch(url);
    const data = await resp.json();
    CreateTopList(data.data);
}

function CreateTopList(data) {
    animesTop = data;
    console.log("Animes TOP");
    console.log(animesTop);
    listAnimesTop = [];
    currentAnimes = [];
    currentAdded = 0;
    animesTop.forEach(element => {
        currentAnimes.push(element);
        currentAdded++;
        if (currentAdded >= 4) {
            listAnimesTop.push(currentAnimes);
            currentAnimes = [];
            currentAdded = 0;
        }
    });
    MostrarAnimesTop();
    mostarPaginaAnimeTop(0);
}

traerAnimesTop();

const btnPrevTop = document.getElementById("previo-top");
const btnNextTop = document.getElementById("next-top");
const contenedorTop = document.getElementById("contenedor-series-top");
const contenedorPaginasTop = document.getElementById("paginas-top");
let currentPage = 0;
let listTopBtnPages = [];

function MostrarAnimesTop() {
    console.log("Creando Botones");
    listTopBtnPages.forEach(element => {
        if(contenedorPaginasTop)contenedorPaginasTop.removeChild(element);
    });
    listTopBtnPages = [];
    for (let i = 0; i < listAnimesTop.length; i++) {
        newBtn = document.createElement('button');
        newBtn.classList.add('btn-pagina');
        newBtn.innerHTML += (i + 1);
        // console.log(newBtn);
        newBtn.addEventListener('click', () => {
            const number = i;
            currentPage = number;
            mostarPaginaAnimeTop(number);
        });
        listTopBtnPages.push(newBtn);
        if(contenedorPaginasTop)contenedorPaginasTop.insertBefore(newBtn, btnNextTop);
    }
}

function activeBtnPage(number, listBtn) {
    for (let i = 0; i < listBtn.length; i++) {
        if (i == number)
            listBtn[i].classList.add('pagina-activa');
        else
            listBtn[i].classList.remove('pagina-activa');
    }
}

if(btnNextTop){
btnNextTop.addEventListener('click', () => {
    currentPage++;
    if (currentPage >= listAnimesTop.length) {
        currentPage = 0;
    }
    mostarPaginaAnimeTop(currentPage);
});
}

if(btnPrevTop){
btnPrevTop.addEventListener('click', () => {
    currentPage--;
    if (currentPage < 0) {
        currentPage = listAnimesTop.length - 1;
    }
    mostarPaginaAnimeTop(currentPage);
});
}


function mostarPaginaAnimeTop(index) {
    activeBtnPage(index, listTopBtnPages);
    if(contenedorTop)contenedorTop.innerHTML = "";
    let listToShow = listAnimesTop[index];

    listToShow.forEach(element => {
        newElement = `
            <article class="tarjeta-serie">
                <div class="img-portada">
                    <img src="${element.images.jpg.image_url}" alt="${element.title}">
                </div>
                <div class="info-tarjetas">
                    <h3>${element.title}</h3>
                    <p>${element.synopsis ? element.synopsis.slice(0, 100) + "..." : "Sin descripción"}</p>
                    <a href="informacion.html?id=${element.mal_id}">
                        <button class="btn-vermas">Ver</button>
                    </a>
                </div>
            </article>`;
        if(contenedorTop)contenedorTop.innerHTML += newElement;
    });
}

/* Trabajando con filtros */
const selectTipo = document.getElementById("tipo");
const selectGenero = document.getElementById("genero");
const selectTemporada = document.getElementById("temporada");
const selectEstado = document.getElementById("estado");

if(selectTipo) selectTipo.addEventListener("change", actualizarPorFiltro);
if(selectGenero) selectGenero.addEventListener("change", actualizarPorFiltro);
if(selectTemporada) selectTemporada.addEventListener("change", actualizarPorFiltro);
if(selectEstado) selectEstado.addEventListener("change", actualizarPorFiltro);

async function actualizarPorFiltro() {
    try {
        const tipo = selectTipo.value;
        const genero = selectGenero.value;
        const temporada = selectTemporada.value;
        const estado = selectEstado.value;

        let url = "https://api.jikan.moe/v4/anime?limit=20";
        if (tipo) url += `&type=${tipo}`;
        if (genero) url += `&genres=${genero}`;
        if (temporada) url += `&season=${temporada}`;
        if (estado) url += `&status=${estado}`;
        const res = await fetch(url);
        const data = await res.json();
        CreateTopList(data.data);

    } catch (error) {
        alert("Error cargando animes:", error);
    }
}

/* Para controlar las series recomendadas */
let animesRecomendados;
let listAnimesRecomendados = [];
async function traerAnimesRecomendados() {
    try {
        const animeId = 1;
        const url = `https://api.jikan.moe/v4/anime/${animeId}/recommendations`;
        const resp = await fetch(url);
        const data = await resp.json();
        const limitRecomends = data.data.slice(0, 25);
        CreateRecomendList(limitRecomends.map(item => item.entry));
    }
    catch (error) {
        // console.error("Error al obtener recomendados:", error);
    }
}

function CreateRecomendList(data) {
    animesRecomendados = data;
    console.log("Animes RECOMENDADOS");
    console.log(animesRecomendados);
    listAnimesRecomendados = [];
    currentAnimes = [];
    currentAdded = 0;
    animesRecomendados.forEach(element => {
        currentAnimes.push(element);
        currentAdded++;
        if (currentAdded >= 4) {
            listAnimesRecomendados.push(currentAnimes);
            currentAnimes = [];
            currentAdded = 0;
        }
    });
    MostrarAnimesRecomendados();
    mostarPaginaAnimeRecomendado(0);
}

traerAnimesRecomendados();

const btnPrevRecomendado = document.getElementById("previo-recomendado");
const btnNextRecomendado = document.getElementById("next-recomendado");
const contenedorRecomendado = document.getElementById("contenedor-recomendados");
const contenedorPaginasRecomendados = document.getElementById("paginas-recomendadas");
let currentPageRecomend = 0;
let listRecomendBtnPages = [];

function MostrarAnimesRecomendados() {
    console.log("Creando Botones");
    listRecomendBtnPages.forEach(element => {
        contenedorPaginasRecomendados.removeChild(element);
    });
    listRecomendBtnPages = [];
    for (let i = 0; i < listAnimesRecomendados.length; i++) {
        newBtn = document.createElement('button');
        newBtn.classList.add('btn-pagina');
        newBtn.innerHTML += (i + 1);
        // console.log(newBtn);
        newBtn.addEventListener('click', () => {
            const number = i;
            currentPageRecomend = number;
            mostarPaginaAnimeRecomendado(number);
        });
        listRecomendBtnPages.push(newBtn);
        contenedorPaginasRecomendados.insertBefore(newBtn, btnNextRecomendado);
    }
}

if(btnNextRecomendado)btnNextRecomendado.addEventListener('click', () => {
    currentPageRecomend++;
    if (currentPageRecomend >= listAnimesRecomendados.length) {
        currentPageRecomend = 0;
    }
    mostarPaginaAnimeRecomendado(currentPageRecomend);
});

if(btnPrevRecomendado)btnPrevRecomendado.addEventListener('click', () => {
    currentPageRecomend--;
    if (currentPageRecomend < 0) {
        currentPageRecomend = listAnimesRecomendados.length - 1;
    }
    mostarPaginaAnimeRecomendado(currentPageRecomend);
});

function mostarPaginaAnimeRecomendado(index) {
    activeBtnPage(index, listRecomendBtnPages);
    contenedorRecomendado.innerHTML = "";
    let listToShow = listAnimesRecomendados[index];

    listToShow.forEach(element => {
        newElement = `
            <article class="tarjeta-serie">
                <div class="img-portada">
                    <img src="${element.images.jpg.image_url}" alt="${element.title}">
                </div>
                <div class="info-tarjetas">
                    <h3>${element.title}</h3>
                    <p>${element.synopsis ? element.synopsis.slice(0, 100) + "..." : "Sin descripción"}</p>
                    <a href="informacion.html?id=${element.mal_id}">
                        <button class="btn-vermas">Ver</button>
                    </a>
                </div>
            </article>`;
        contenedorRecomendado.innerHTML += newElement;
    });
}

