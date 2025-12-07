/* Creacion de los Capitulos */
const btnPrevCapitulos = document.getElementById("previo-capitulos");
const btnNextCapitulos = document.getElementById("next-capitulos");
const contenedorCapitulos = document.getElementById("contenedor-capitulos");
const contenedorPaginasCapitulos = document.getElementById("paginas-capitulos");
const contenedorVerticalCapritulo = document.getElementById("contenedor-capitulos-vertical");

const animeId = 1;
if (contenedorVerticalCapritulo) {
    chapterPager = new PagerChapters(`https://api.jikan.moe/v4/anime/${animeId}`, `https://api.jikan.moe/v4/anime/${animeId}/episodes`, 4, btnNextCapitulos, btnPrevCapitulos, contenedorCapitulos, contenedorPaginasCapitulos, contenedorVerticalCapritulo);
} else {
    chapterPager = new PagerChapters(`https://api.jikan.moe/v4/anime/${animeId}`, `https://api.jikan.moe/v4/anime/${animeId}/episodes`, 4, btnNextCapitulos, btnPrevCapitulos, contenedorCapitulos, contenedorPaginasCapitulos);
}
chapterPager.GetAnimes();

/* Series Similares */
const btnPrevTop = document.getElementById("previo-top");
const btnNextTop = document.getElementById("next-top");
const topContainer = document.getElementById("contenedor-series-top");
const topPageContainer = document.getElementById("paginas-top");

topPager = new Pager(`https://api.jikan.moe/v4/top/anime?page=1`, 4, btnNextTop, btnPrevTop, topContainer, topPageContainer);
topPager.GetAnimes();
