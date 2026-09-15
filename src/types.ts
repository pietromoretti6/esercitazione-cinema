export type Film = {
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

export type Screening = {
  id: number
  starts_at: string
  available_seats: number
  hall: {
    name: string
    capacity: number
  }
}

export type BookingResult = {
  id?: number
  error?: string
  details?: Record<string, string>
}
