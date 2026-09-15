import type { BookingResult, Film, Screening } from './types'

const API_URL = 'https://its-cinema.vercel.app/api'

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Richiesta non riuscita')
  return await response.json() as T
}

export function getFilms(): Promise<Film[]> {
  return getJson<Film[]>(`${API_URL}/films`)
}

export function getFilm(id: string): Promise<Film> {
  return getJson<Film>(`${API_URL}/films/${id}`)
}

export function getScreenings(filmId: string): Promise<Screening[]> {
  return getJson<Screening[]>(`${API_URL}/films/${filmId}/screenings`)
}

export async function createBooking(screeningId: number, data: Record<string, string>): Promise<BookingResult> {
  const response = await fetch(`${API_URL}/screenings/${screeningId}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await response.json() as BookingResult
  if (!response.ok) {
    const details = result.details ? ` ${Object.values(result.details).join(' ')}` : ''
    throw new Error(`${result.error ?? 'Prenotazione non riuscita'}.${details}`)
  }

  return result
}
