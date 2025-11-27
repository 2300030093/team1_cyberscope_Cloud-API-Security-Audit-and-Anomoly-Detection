export interface Event {
  id: string;
  title: string;
  category: 'movies' | 'concerts' | 'sports' | 'theatre';
  description: string;
  image: string;
  duration: string;
  language?: string;
  genre?: string;
  rating?: number;
  featured?: boolean;
}

export interface Show {
  id: string;
  eventId: string;
  date: string;
  time: string;
  venue: string;
  price: number;
  availableSeats: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'regular' | 'premium' | 'vip';
  price: number;
  status: 'available' | 'locked' | 'booked' | 'selected';
  lockedBy?: string;
  lockExpiry?: number;
}

export interface Booking {
  id: string;
  eventId: string;
  showId: string;
  seats: Seat[];
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  qrCode: string;
  bookingDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}
