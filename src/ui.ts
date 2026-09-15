import type { Film, Screening } from './types'

export function renderPage(app: HTMLDivElement, selectedFilmId: string | null) {
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
      <a class="brand" href="./" aria-label="Multisala Brodo home">
        <img class="brand-logo" src="/logo-multisala-brodo.svg" alt="" />
        <span>Multisala Brodo</span>
      </a>
      <span class="header-label">Multisala · Programmazione</span>
    </header>
    <main>${pageContent}</main>
    <footer>Il cinema è il modo più diretto per entrare in un altro mondo.</footer>
  `
}

export function createFilmCard(film: Film): HTMLLIElement {
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
  return filmItem
}

export function createScreeningItem(screening: Screening): HTMLLIElement {
  const screeningItem = document.createElement('li')
  screeningItem.className = 'screening-item'
  screeningItem.dataset.screeningId = String(screening.id)
  screeningItem.innerHTML = `
    <div class="screening-main">
      <strong>${new Date(screening.starts_at).toLocaleString('it-IT')}</strong>
      <span>${screening.hall.name}</span>
    </div>
    <div class="screening-seats">
      <span>${screening.hall.capacity - screening.available_seats} prenotati</span>
      <strong>${screening.available_seats} disponibili</strong>
    </div>
  `
  return screeningItem
}

export function createBookingForm(onSubmit: (event: SubmitEvent, form: HTMLFormElement) => void): HTMLFormElement {
  const bookingForm = document.createElement('form')
  bookingForm.className = 'booking-form'
  bookingForm.innerHTML = `
    <h3>Prenota per questo spettacolo</h3>
    <label>Nome<input name="first_name" type="text" required /></label>
    <label>Cognome<input name="last_name" type="text" required /></label>
    <label>Email<input name="email" type="email" required /></label>
    <button type="submit">Prenota posto</button>
    <p class="booking-status" aria-live="polite"></p>
  `
  bookingForm.addEventListener('submit', (event) => onSubmit(event, bookingForm))
  return bookingForm
}
