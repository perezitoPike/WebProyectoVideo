// import { Pager } from './javaScriptClasePaginador';

window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 1) {
        header.classList.add("scroll-activo");
    }
    else header.classList.remove("scroll-activo");
});

/* Conexion con el Api Jikan*/
const btnPrevTop = document.getElementById("previo-top");
const btnNextTop = document.getElementById("next-top");
const topContainer = document.getElementById("contenedor-series-top");
const topPageContainer = document.getElementById("paginas-top");

topPager = new Pager(`https://api.jikan.moe/v4/top/anime?page=1`, 4, btnNextTop, btnPrevTop, topContainer, topPageContainer);
topPager.GetAnimes();

const btnPrevRecomendado = document.getElementById("previo-recomendado");
const btnNextRecomendado = document.getElementById("next-recomendado");
const contenedorRecomendado = document.getElementById("contenedor-recomendados");
const contenedorPaginasRecomendados = document.getElementById("paginas-recomendadas");

const animeId = 1;
recomendPager = new PagerMultiPageList(`https://api.jikan.moe/v4/anime/${animeId}/recommendations`, 4, btnNextRecomendado, btnPrevRecomendado, contenedorRecomendado, contenedorPaginasRecomendados);
recomendPager.GetAnimes();

/* Trabajando con filtros */
const selectTipo = document.getElementById("tipo");
const selectGenero = document.getElementById("genero");
const selectTemporada = document.getElementById("temporada");
const selectEstado = document.getElementById("estado");

if (selectTipo) selectTipo.addEventListener("change", actualizarPorFiltro);
if (selectGenero) selectGenero.addEventListener("change", actualizarPorFiltro);
if (selectTemporada) selectTemporada.addEventListener("change", actualizarPorFiltro);
if (selectEstado) selectEstado.addEventListener("change", actualizarPorFiltro);

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
        // CreateTopList(data.data);
        recomendPager.createAnimeList(data.data);

    } catch (error) {
        alert("Error cargando animes:", error);
    }
}