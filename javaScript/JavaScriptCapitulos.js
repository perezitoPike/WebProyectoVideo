/* Creacion de los Capitulos */

let capitulos;
let listaCapitulos = [];
let image_urlChapter;
async function traerCapitulosDelAnime() {
    try {
        animeId = 1;
        pagina = 2;

        let urlAnime = `https://api.jikan.moe/v4/anime/${animeId}`;
        const resAnime = await fetch(urlAnime);
        const dataAnime = await resAnime.json();
        const anime = dataAnime.data;
        image_urlChapter = anime.images.jpg.image_url;

        let urlChapters = `https://api.jikan.moe/v4/anime/${animeId}/episodes`;
        const resEpisodios = await fetch(urlChapters);
        const dataEpisodios = await resEpisodios.json();
        capitulos = dataEpisodios.data;
        console.log("CAPITULOS");
        console.log(capitulos);
        CreateChaptersList(capitulos);
        crearPaginaCapitulosVertical(image_urlChapter);
    } catch (error) {
        console.error("Error al obtener capítulos:", error);
    }
}

function CreateChaptersList(data) {
    capitulos = data;
    console.log("Animes TOP");
    console.log(capitulos);
    listaCapitulos = [];
    currentChapters = [];
    currentAdded = 0;
    capitulos.forEach(element => {
        currentChapters.push(element);
        currentAdded++;
        if (currentAdded >= 4) {
            listaCapitulos.push(currentChapters);
            currentChapters = [];
            currentAdded = 0;
        }
    });
    MostrarCapitulos();
    mostarPaginaCapitulos(0, image_urlChapter);
}

traerCapitulosDelAnime();

const btnPrevCapitulos = document.getElementById("previo-capitulos");
const btnNextCapitulos = document.getElementById("next-capitulos");
const contenedorCapitulos = document.getElementById("contenedor-capitulos");
const contenedorPaginasCapitulos = document.getElementById("paginas-capitulos");
const contenedorVerticalCapritulo = document.getElementById("contenedor-capitulos-vertical");
let currentPageChapter = 0;
let listChaptersBtnPages = [];

function MostrarCapitulos() {
    console.log("Creando Botones");
    listChaptersBtnPages.forEach(element => {
        contenedorPaginasCapitulos.removeChild(element);
    });
    listChaptersBtnPages = [];
    for (let i = 0; i < listaCapitulos.length; i++) {
        newBtn = document.createElement('button');
        newBtn.classList.add('btn-pagina');
        newBtn.innerHTML += (i + 1);
        // console.log(newBtn);
        newBtn.addEventListener('click', () => {
            const number = i;
            currentPageChapter = number;
            mostarPaginaCapitulos(number);
        });
        listChaptersBtnPages.push(newBtn);
        contenedorPaginasCapitulos.insertBefore(newBtn, btnNextCapitulos);
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

if (btnNextCapitulos) {
    btnNextCapitulos.addEventListener('click', () => {
        currentPageChapter++;
        if (currentPageChapter >= listaCapitulos.length) {
            currentPageChapter = 0;
        }
        mostarPaginaCapitulos(currentPageChapter);
    });
}

if (btnPrevCapitulos) {
    btnPrevCapitulos.addEventListener('click', () => {
        currentPageChapter--;
        if (currentPageChapter < 0) {
            currentPageChapter = listaCapitulos.length - 1;
        }
        mostarPaginaCapitulos(currentPageChapter);
    });
}


function mostarPaginaCapitulos(index, image_url) {
    activeBtnPage(index, listChaptersBtnPages);
    contenedorCapitulos.innerHTML = "";
    let listToShow = listaCapitulos[index];

    listToShow.forEach(element => {
        newElement = `
            <article class="tarjeta-serie">
                <div class="img-portada">
                    <img src="${image_url}" alt="${element.title}">
                </div>
                <div class="info-tarjetas">
                    <h3>${element.title}</h3>
                    <p>${element.synopsis ? element.synopsis.slice(0, 100) + "..." : "Sin descripción"}</p>
                    <a href="informacion.html?id=${element.mal_id}">
                        <button class="btn-vermas">Ver</button>
                    </a>
                </div>
            </article>`;
        contenedorCapitulos.innerHTML += newElement;
    });
}

function crearPaginaCapitulosVertical(image_url){
    if(contenedorVerticalCapritulo){
        let chapterNum = 1;
        capitulos.forEach(element => {
            newElement = `
                <li class="capitulos">
                    <img src="${image_url}">
                    <div>
                        <span class="numero-capitulo">Capitulo ${chapterNum}</span>
                        <span class="titulo-capitulo">${element.title}</span>
                    </div>
                </li>
            `;
            contenedorVerticalCapritulo.innerHTML += newElement;
            chapterNum++;
        });
    }
}
