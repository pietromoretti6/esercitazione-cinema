import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
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
    </section>
  </main>

  <footer>Il cinema è il modo più diretto per entrare in un altro mondo.</footer>
`