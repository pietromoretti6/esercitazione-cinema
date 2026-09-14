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
  id: number
  starts_at: string
  available_seats: number
  hall: {
    name: string
  }
}

const app = document.querySelector<HTMLDivElement>('#app')!
const selectedFilmId = new URLSearchParams(window.location.search).get('id')

const pageContent = selectedFilmId ? `
  <section class="detail" aria-labelledby="detail-title">
    <a class="back-link" href="./">← Torna alla programmazione</a>
    <div class="detail-layout">
      <div class="detail-poster-wrap">
        <img class="selected-film-poster" id="selected-film-poster" alt="" hidden />
      </div>
      <div class="detail-copy">
        <p class="eyebrow">Scheda film</p>
        <h1 id="detail-title">Caricamento...</h1>
        <p class="selected-film" id="selected-film"></p>
        <p class="film-description" id="film-description"></p>
        <h2 class="screenings-title">Spettacoli</h2>
        <p id="screenings-status">Caricamento degli spettacoli...</p>
        <ul id="screenings-list"></ul>
      </div>
    </div>
  </section>
` : `
  <section class="hero">
    <p class="eyebrow">In programmazione</p>
    <h1>Storie da vedere<br /><em>sul grande schermo.</em></h1>
    <p class="hero-copy">Scopri i film in sala e trova il tuo prossimo spettacolo.</p>
  </section>

  <section class="catalog" aria-labelledby="catalog-title">
    <p class="eyebrow">La selezione di oggi</p>
    <h2 id="catalog-title">I film in programmazione</h2>
    <p id="films-status">Caricamento dei film...</p>
    <ul id="films-list"></ul>
  </section>
`

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="./" aria-label="CineMondo home">
      <span class="brand-mark">CM</span>
      <span>CineMondo</span>
    </a>
    <span class="header-label">Multisala · Programmazione</span>
  </header>
  <main>${pageContent}</main>
  <footer>Il cinema è il modo più diretto per entrare in un altro mondo.</footer>
`

async function loadFilms() {
  if (selectedFilmId) return

  const status = document.querySelector<HTMLParagraphElement>('#films-status')!
  const filmsList = document.querySelector<HTMLUListElement>('#films-list')!

  try {
    const response = await fetch('https://its-cinema.vercel.app/api/films')
    if (!response.ok) throw new Error('Impossibile caricare i film')

    const films = await response.json() as Film[]
    status.textContent = ''

    films.forEach((film) => {
      const filmItem = document.createElement('li')
      filmItem.className = 'film-card'

      const posterLink = document.createElement('a')
      posterLink.className = 'poster-link'
      posterLink.href = `?id=${film.id}`
      posterLink.setAttribute('aria-label', `Scopri di più su ${film.title}`)

      if (film.poster_url) {
        const poster = document.createElement('img')
        poster.className = 'film-poster'
        poster.src = film.poster_url
        poster.alt = `Locandina di ${film.title}`
        poster.loading = 'lazy'
        posterLink.append(poster)
      }

      const arrow = document.createElement('span')
      arrow.className = 'card-arrow'
      arrow.textContent = '↗'
      arrow.setAttribute('aria-hidden', 'true')
      posterLink.append(arrow)

      const filmInfo = document.createElement('div')
      filmInfo.className = 'film-info'
      filmInfo.innerHTML = `
        <div class="film-meta"><span>${film.genre}</span><span>${film.year}</span></div>
        <h3>${film.title}</h3>
        <p>${film.duration} min · ${film.rating}</p>
        <a class="discover-link" href="?id=${film.id}">Scopri di più <span aria-hidden="true">→</span></a>
      `

      filmItem.append(posterLink, filmInfo)
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
    document.querySelector<HTMLHeadingElement>('#detail-title')!.textContent = film.title
    selectedFilm.textContent = `${film.year} · ${film.duration} min · Regia di ${film.director}`
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
      screeningItem.className = 'screening-item'
      screeningItem.dataset.screeningId = String(screening.id)
      screeningItem.innerHTML = `
        <span>${new Date(screening.starts_at).toLocaleString('it-IT')} · ${screening.hall.name}</span>
        <strong>${screening.available_seats} posti disponibili</strong>
      `
      screeningItem.addEventListener('click', () => {
        document.querySelector('.booking-form')?.remove()

        const bookingForm = document.createElement('form')
        bookingForm.className = 'booking-form'
        bookingForm.innerHTML = `
          <h3>Prenota per questo spettacolo</h3>
          <label>Nome<input name="first_name" type="text" required /></label>
          <label>Cognome<input name="last_name" type="text" required /></label>
          <label>Email<input name="email" type="email" required /></label>
          <button type="submit">Continua</button>
        `
        bookingForm.addEventListener('submit', (event) => event.preventDefault())
        screeningItem.after(bookingForm)
      })
      screeningsList.append(screeningItem)
    })
  } catch {
    status.textContent = 'Gli spettacoli non sono momentaneamente disponibili.'
  }
}

loadFilms()
loadSelectedFilm()
loadScreenings()