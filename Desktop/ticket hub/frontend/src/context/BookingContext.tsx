import { createContext, useContext, useState, ReactNode } from 'react';
import { Seat, Booking } from '@/types';

interface BookingContextType {
  selectedSeats: Seat[];
  addSeat: (seat: Seat) => void;
  removeSeat: (seatId: string) => void;
  clearSeats: () => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const stored = localStorage.getItem('bookings');
    return stored ? JSON.parse(stored) : [];
  });

  const addSeat = (seat: Seat) => {
    setSelectedSeats(prev => [...prev, seat]);
  };

  const removeSeat = (seatId: string) => {
    setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
  };

  const clearSeats = () => {
    setSelectedSeats([]);
  };

  const addBooking = (booking: Booking) => {
    const updated = [...bookings, booking];
    setBookings(updated);
    localStorage.setItem('bookings', JSON.stringify(updated));
  };

  return (
    <BookingContext.Provider
      value={{
        selectedSeats,
        addSeat,
        removeSeat,
        clearSeats,
        bookings,
        addBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
