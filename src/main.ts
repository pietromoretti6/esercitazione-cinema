import './style.css'

type Film = {
  title: string
  genre: string
  year: number
}

const app = document.querySelector<HTMLDivElement>('#app')!

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
      filmItem.textContent = `${film.title} · ${film.genre} · ${film.year}`
      filmsList.append(filmItem)
    })
  } catch {
    status.textContent = 'La programmazione non è momentaneamente disponibile.'
  }
}

loadFilms()