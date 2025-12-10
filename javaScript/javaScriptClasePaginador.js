class Pager {
    constructor(url, maxContent, btnNext, btnPrev, containerSerie, containerPages) {
        this.url = url;
        this.maxContent = maxContent;
        this.btnNext = btnNext;
        this.btnPrev = btnPrev;
        this.containerSerie = containerSerie;
        this.containerPages = containerPages;

        this.listAllAnimes = [];
        this.listAnimeSelected = [];
        this.listAnimesTop = [];
        this.listBtnPages = [];

        this.currentPage = 0;

        if (this.btnNext) {
            this.btnNext.addEventListener('click', () => {
                this.currentPage++;
                if (this.currentPage >= this.listAnimesTop.length) {
                    this.currentPage = 0;
                }
                this.showAnimePage(this.currentPage);
            });
        }

        if (this.btnPrev) {
            this.btnPrev.addEventListener('click', () => {
                this.currentPage--;
                if (this.currentPage < 0) {
                    this.currentPage = this.listAnimesTop.length - 1;
                }
                this.showAnimePage(this.currentPage);
            });
        }
    }

    updateUrl(url) {
        this.url = url;
    }

    async GetAnimes() {
        try {
            this.showLoader();
            // const url = `https://api.jikan.moe/v4/top/anime?page=1`;
            const resp = await fetch(this.url);
            const data = await resp.json();
            console.log(data.data);
            this.createAnimeList(data.data);
        } catch (error) {
            console.error("Error al obtener recomendados:", error);
            if (this.containerSerie) this.containerSerie.innerHTML = "<p style='color:red;'>Error al cargar los animes</p>";
        } finally {
            this.hideLoader();
        }
    }

    createAnimeList(data) {
        this.listAllAnimes = data;
        this.listAnimeSelected = [];
        this.listAnimesTop = [];

        let currentAnimes = [];
        let currentAdded = 0;

        this.listAllAnimes.forEach(element => {
            currentAnimes.push(element);
            currentAdded++;

            if (currentAdded >= this.maxContent || !element) {
                this.listAnimesTop.push(currentAnimes);
                currentAnimes = [];
                currentAdded = 0;
            }
        });

        this.createButtonPages();
        this.showAnimePage(0);
    }

    createButtonPages() {
        this.listBtnPages.forEach(btn => {
            if (this.containerPages) this.containerPages.removeChild(btn);
        });

        this.listBtnPages = [];

        for (let i = 0; i < this.listAnimesTop.length; i++) {
            let newBtn = document.createElement('button');
            newBtn.classList.add('btn-pagina');
            newBtn.textContent = i + 1;

            newBtn.addEventListener('click', () => {
                this.currentPage = i;
                this.showAnimePage(i);
            });

            this.listBtnPages.push(newBtn);

            if (this.containerPages) this.containerPages.insertBefore(newBtn, this.btnNext);
        }
    }

    activeBtnPage(number) {
        this.listBtnPages.forEach((btn, i) => {
            if (i === number) btn.classList.add('pagina-activa');
            else btn.classList.remove('pagina-activa');
        });
    }

    showAnimePage(index) {
        this.activeBtnPage(index);

        if (this.containerSerie) this.containerSerie.innerHTML = "";

        let listToShow = this.listAnimesTop[index];
        if (!listToShow) {
            if (this.containerSerie) this.containerSerie.innerHTML = "<p style='color:white;'>No se encontraron animes</p>";
            return;
        }
        listToShow.forEach(element => {
            let html = '';
            let rutaActual = window.location.pathname;
            console.log("Ruta actual: " + rutaActual);
            if (rutaActual === '/' || rutaActual.endsWith('/index.html') || rutaActual.endsWith('/WebProyectoVideo/')) {
                // console.log('Estás en la página principal (index.html)');
                html = `
                <article class="tarjeta-serie">
                    <div class="img-portada">
                        <img src="${element.images?.jpg.image_url}" alt="${element.title}">
                    </div>
                    <div class="info-tarjetas">
                        <h3>${element.title}</h3>
                        <p>${element.synopsis ? element.synopsis.slice(0, 100) + "..." : "Sin descripción"}</p>
                        <a href="html/informacion.html">
                            <button class="btn-vermas">Ver</button>
                        </a>
                    </div>
                </article>`;
                console.log("Creando la primera vez con html/informacion.html: " + html);
            } else {
                // console.log('No estás en la página principal');
                html = `
                <article class="tarjeta-serie">
                    <div class="img-portada">
                        <img src="${element.images?.jpg.image_url}" alt="${element.title}">
                    </div>
                    <div class="info-tarjetas">
                        <h3>${element.title}</h3>
                        <p>${element.synopsis ? element.synopsis.slice(0, 100) + "..." : "Sin descripción"}</p>
                        <a href="informacion.html">
                            <button class="btn-vermas">Ver</button>
                        </a>
                    </div>
                </article>`;
                console.log("Creando la primera vez con informacion.html: " + html);
            }            
            this.containerSerie.innerHTML += html;
        });
    }

    showLoader() {
        if (!this.containerSerie) return;
        if (this.containerSerie.querySelector('.loader-overlay')) return;
        let overlay = document.createElement('div');
        overlay.className = 'loader-overlay';
        overlay.innerHTML = `<div class="loader"></div>`;
        this.containerSerie.appendChild(overlay);
    }

    hideLoader() {
        if (!this.containerSerie) return;
        let overlay = this.containerSerie.querySelector('.loader-overlay');
        if (overlay) overlay.remove();
    }
}

class PagerMultiPageList extends Pager {
    async GetAnimes() {
        try {
            this.showLoader();
            // const url = `https://api.jikan.moe/v4/top/anime?page=1`;
            const resp = await fetch(this.url);
            const data = await resp.json();
            const limitRecomends = data.data.slice(0, 25);
            this.createAnimeList(limitRecomends.map(item => item.entry));
        } catch (error) {
            console.error("Error al obtener recomendados:", error);
            if (this.containerSerie) this.containerSerie.innerHTML = "<p style='color:red;'>Error al cargar los animes</p>";
        } finally {
            this.hideLoader();
        }
    }
}

class PagerChapters extends Pager {
    /**
     *
     */
    constructor(url_img, url, maxContent, btnNext, btnPrev, containerSerie, containerPages, containerVertical) {
        super(url, maxContent, btnNext, btnPrev, containerSerie, containerPages);
        this.url_img = url_img;
        this.containerVertical = containerVertical;
        this.image_urlChapter;
    }

    async GetAnimes() {
        try {
            this.showLoader();

            // let urlAnime = `https://api.jikan.moe/v4/anime/${animeId}`;
            const resAnime = await fetch(this.url_img);
            const dataAnime = await resAnime.json();
            let anime = dataAnime.data;
            this.image_urlChapter = anime.images.jpg.image_url;

            // let urlChapters = `https://api.jikan.moe/v4/anime/${animeId}/episodes`;
            const resEpisodios = await fetch(this.url);
            const dataEpisodios = await resEpisodios.json();
            const capitulos = dataEpisodios.data;
            console.log("CAPITULOS");
            console.log(capitulos);
            this.createAnimeList(capitulos);
            this.createVerticalChapters(this.image_urlChapter);
        } catch (error) {
            console.error("Error al obtener capítulos:", error);
            if (this.containerSerie) this.containerSerie.innerHTML = "<p style='color:red;'>Error al cargar los animes</p>";
        } finally {
            this.hideLoader();
        }
    }

    createVerticalChapters(image_url) {
        if (this.containerVertical) {
            let chapterNum = 1;
            this.listAnimesTop.forEach(element => {
                let newElement = `
                <a href="reproductor.html">
                    <li class="capitulos">
                        <img src="${image_url}">
                        <div>
                            <span class="numero-capitulo">Capitulo ${chapterNum}</span>
                            <span class="titulo-capitulo">${element.title}</span>
                        </div>
                    </li>
                </a>
            `;
                this.containerVertical.innerHTML += newElement;
                chapterNum++;
            });
        }
    }

    showAnimePage(index) {
        if (!this.containerSerie) {
            return;
        }
        this.activeBtnPage(index);

        if (this.containerSerie) this.containerSerie.innerHTML = "";

        let listToShow = this.listAnimesTop[index];

        listToShow.forEach(element => {
            let html = `           
                <article class="tarjeta-serie">
                
                    <div class="img-portada">
                        <img src="${this.image_urlChapter}" alt="${element.title}">
                    </div>
                    <div class="info-tarjetas">
                        <h3>${element.title}</h3>
                        <p>${element.synopsis ? element.synopsis.slice(0, 100) + "..." : "Sin descripción"}</p>
                        <a href="reproductor.html?id=${element.mal_id}">
                            <button class="btn-vermas">Ver</button>
                        </a>
                    </div>
                </article>
           `;
            this.containerSerie.innerHTML += html;
        });
    }
}