import './style.css'
import { createBooking, getFilm, getFilms, getScreenings } from './api'
import { createBookingForm, createFilmCard, createScreeningItem, renderPage } from './ui'
import type { Screening } from './types'

const app = document.querySelector<HTMLDivElement>('#app')!
const selectedFilmId = new URLSearchParams(window.location.search).get('id')

renderPage(app, selectedFilmId)

async function loadFilms() {
  if (selectedFilmId) return

  const status = document.querySelector<HTMLParagraphElement>('#films-status')!
  const filmsList = document.querySelector<HTMLUListElement>('#films-list')!

  try {
    const films = await getFilms()
    status.textContent = ''
    films.forEach((film) => filmsList.append(createFilmCard(film)))
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
    const film = await getFilm(selectedFilmId)
    document.querySelector<HTMLHeadingElement>('#detail-title')!.textContent = film.title
    selectedFilm.textContent = `${film.genre} · ${film.year} · ${film.duration} min · ${film.rating} · Regia di ${film.director}`
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

async function submitBooking(event: SubmitEvent, form: HTMLFormElement, screening: Screening, screeningItem: HTMLLIElement) {
  event.preventDefault()

  const submitButton = form.querySelector<HTMLButtonElement>('button')!
  const status = form.querySelector<HTMLParagraphElement>('.booking-status')!
  const formData = new FormData(form)
  const bookingData = {
    first_name: String(formData.get('first_name')),
    last_name: String(formData.get('last_name')),
    email: String(formData.get('email')),
  }

  submitButton.disabled = true
  submitButton.textContent = 'Invio...'

  try {
    const result = await createBooking(screening.id, bookingData)
    status.textContent = result.id
      ? `Prenotazione confermata. Codice: ${result.id}`
      : 'Prenotazione confermata.'
    form.reset()
    screening.available_seats -= 1
    screeningItem.querySelector('.screening-seats strong')!.textContent = `${screening.available_seats} disponibili`
    screeningItem.querySelector('.screening-seats span')!.textContent = `${screening.hall.capacity - screening.available_seats} prenotati`
    if (screening.available_seats === 0) screeningItem.classList.add('screening-sold-out')
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : 'Prenotazione non riuscita.'
  } finally {
    submitButton.disabled = false
    submitButton.textContent = 'Prenota posto'
  }
}

async function loadScreenings() {
  if (!selectedFilmId) return

  const status = document.querySelector<HTMLParagraphElement>('#screenings-status')!
  const screeningsList = document.querySelector<HTMLUListElement>('#screenings-list')!

  try {
    const screenings = await getScreenings(selectedFilmId)
    if (screenings.length === 0) {
      status.textContent = 'Non ci sono spettacoli disponibili per questo film.'
      return
    }
    status.textContent = ''

    screenings.forEach((screening) => {
      const screeningItem = createScreeningItem(screening)
      screeningItem.addEventListener('click', () => {
        if (screening.available_seats === 0) return
        document.querySelector('.booking-form')?.remove()
        const bookingForm = createBookingForm((event, form) => {
          void submitBooking(event, form, screening, screeningItem)
        })
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