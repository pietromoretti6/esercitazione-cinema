import './style.css'

type Film = {
  id: number
  title: string
  genre: string
  director: string
  description: string
  year: number
  duration: number
  rating: string
  poster_url: string | null
}

type Screening = {
  starts_at: string
  hall: {
    name: string
  }
}

const app = document.querySelector<HTMLDivElement>('#app')!
const selectedFilmId = new URLSearchParams(window.location.search).get('id')

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="./" aria-label="CineMondo home">
      <span class="brand-mark">CM</span>
      <span>CineMondo</span>
    </a>
    <span class="header-label">Multisala · Programmazione</span>
  </header>

  <main>
    <section class="hero">
      <p class="eyebrow">In programmazione</p>
      <h1>Storie da vedere<br /><em>sul grande schermo.</em></h1>
      <p class="hero-copy">Scopri i film in sala e trova il tuo prossimo spettacolo.</p>
    </section>

    <section class="catalog" aria-labelledby="catalog-title">
      <p class="eyebrow">La selezione di oggi</p>
      <h2 id="catalog-title">I film in programmazione</h2>
      ${selectedFilmId ? '<p class="selected-film" id="selected-film">Caricamento del film selezionato...</p>' : ''}
      ${selectedFilmId ? '<img class="selected-film-poster" id="selected-film-poster" alt="" hidden />' : ''}
      ${selectedFilmId ? '<p class="film-description" id="film-description"></p>' : ''}
      ${selectedFilmId ? '<h3 class="screenings-title">Spettacoli</h3><p id="screenings-status">Caricamento degli spettacoli...</p><ul id="screenings-list"></ul>' : ''}
      <p id="films-status">Caricamento dei film...</p>
      <ul id="films-list"></ul>
    </section>
  </main>

  <footer>Il cinema è il modo più diretto per entrare in un altro mondo.</footer>
`

async function loadFilms() {
  const status = document.querySelector<HTMLParagraphElement>('#films-status')!
  const filmsList = document.querySelector<HTMLUListElement>('#films-list')!

  try {
    const response = await fetch('https://its-cinema.vercel.app/api/films')
    if (!response.ok) throw new Error('Impossibile caricare i film')

    const films = await response.json() as Film[]
    status.textContent = ''

    films.forEach((film) => {
      const filmItem = document.createElement('li')

      if (film.poster_url) {
        const poster = document.createElement('img')
        poster.className = 'film-poster'
        poster.src = film.poster_url
        poster.alt = `Locandina di ${film.title}`
        poster.width = 120
        filmItem.prepend(poster)
      }

      const filmLink = document.createElement('a')
      filmLink.href = `?id=${film.id}`
      filmLink.textContent = `${film.title} · ${film.genre} · ${film.year} · ${film.duration} min · ${film.rating}`
      filmItem.append(filmLink)
      filmsList.append(filmItem)
    })
  } catch {
    status.textContent = 'La programmazione non è momentaneamente disponibile.'
  }
}

async function loadSelectedFilm() {
  if (!selectedFilmId) return

  const selectedFilm = document.querySelector<HTMLParagraphElement>('#selected-film')!
  const selectedFilmPoster = document.querySelector<HTMLImageElement>('#selected-film-poster')!
  const filmDescription = document.querySelector<HTMLParagraphElement>('#film-description')!

  try {
    const response = await fetch(`https://its-cinema.vercel.app/api/films/${selectedFilmId}`)
    if (!response.ok) throw new Error('Film non trovato')

    const film = await response.json() as Film
    selectedFilm.textContent = `Film selezionato: ${film.title} · ${film.year} · ${film.duration} min · Regia di ${film.director}`
    if (film.poster_url) {
      selectedFilmPoster.src = film.poster_url
      selectedFilmPoster.alt = `Locandina di ${film.title}`
      selectedFilmPoster.hidden = false
    }
    filmDescription.textContent = film.description
  } catch {
    selectedFilm.textContent = 'Film non trovato.'
  }
}

async function loadScreenings() {
  if (!selectedFilmId) return

  const status = document.querySelector<HTMLParagraphElement>('#screenings-status')!
  const screeningsList = document.querySelector<HTMLUListElement>('#screenings-list')!

  try {
    const response = await fetch(`https://its-cinema.vercel.app/api/films/${selectedFilmId}/screenings`)
    if (!response.ok) throw new Error('Spettacoli non trovati')

    const screenings = await response.json() as Screening[]
    status.textContent = ''

    screenings.forEach((screening) => {
      const screeningItem = document.createElement('li')
      screeningItem.textContent = `${new Date(screening.starts_at).toLocaleString('it-IT')} · ${screening.hall.name}`
      screeningsList.append(screeningItem)
    })
  } catch {
    status.textContent = 'Gli spettacoli non sono momentaneamente disponibili.'
  }
}

loadFilms()
loadSelectedFilm()
loadScreenings()