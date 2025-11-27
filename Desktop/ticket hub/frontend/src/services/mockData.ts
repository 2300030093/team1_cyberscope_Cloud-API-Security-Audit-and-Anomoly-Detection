import { Event, Show, Seat } from '@/types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'The Quantum Paradox',
    category: 'movies',
    description: 'A mind-bending sci-fi thriller that explores the boundaries of reality and consciousness.',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=1200&fit=crop',
    duration: '2h 25m',
    language: 'English',
    genre: 'Sci-Fi, Thriller',
    rating: 4.5,
    featured: true,
  },
  {
    id: '2',
    title: 'Midnight Jazz Sessions',
    category: 'concerts',
    description: 'An enchanting evening of smooth jazz featuring world-renowned artists.',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=1200&fit=crop',
    duration: '3h',
    genre: 'Jazz, Live Performance',
    rating: 4.8,
    featured: true,
  },
  {
    id: '3',
    title: 'Champions League Finals',
    category: 'sports',
    description: 'The ultimate showdown between Europe\'s football elite. Witness history in the making.',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=1200&fit=crop',
    duration: '2h',
    genre: 'Football',
    rating: 4.9,
    featured: true,
  },
  {
    id: '4',
    title: 'Hamlet: A Modern Interpretation',
    category: 'theatre',
    description: 'Shakespeare\'s timeless tragedy reimagined for contemporary audiences.',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=1200&fit=crop',
    duration: '2h 45m',
    language: 'English',
    genre: 'Drama, Classic',
    rating: 4.6,
  },
  {
    id: '5',
    title: 'Neon Dreams',
    category: 'movies',
    description: 'A cyberpunk masterpiece set in a dystopian future where technology and humanity collide.',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=1200&fit=crop',
    duration: '2h 10m',
    language: 'English',
    genre: 'Cyberpunk, Action',
    rating: 4.4,
  },
  {
    id: '6',
    title: 'Rock Legends Live',
    category: 'concerts',
    description: 'The greatest rock anthems performed by legendary artists. An unforgettable night.',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=1200&fit=crop',
    duration: '3h 30m',
    genre: 'Rock, Live Performance',
    rating: 4.7,
  },
];

export const mockShows: Record<string, Show[]> = {
  '1': [
    { id: 's1', eventId: '1', date: '2025-12-01', time: '14:00', venue: 'Platinum Cinema Hall 1', price: 250, availableSeats: 45 },
    { id: 's2', eventId: '1', date: '2025-12-01', time: '18:30', venue: 'Platinum Cinema Hall 1', price: 300, availableSeats: 32 },
    { id: 's3', eventId: '1', date: '2025-12-02', time: '20:00', venue: 'Platinum Cinema Hall 2', price: 350, availableSeats: 28 },
  ],
  '2': [
    { id: 's4', eventId: '2', date: '2025-12-05', time: '20:00', venue: 'Grand Concert Hall', price: 1500, availableSeats: 120 },
  ],
  '3': [
    { id: 's5', eventId: '3', date: '2025-12-10', time: '19:00', venue: 'National Stadium', price: 5000, availableSeats: 850 },
  ],
};

export const generateSeats = (showId: string): Seat[] => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  const seats: Seat[] = [];

  rows.forEach((row, rowIndex) => {
    for (let num = 1; num <= seatsPerRow; num++) {
      let type: 'regular' | 'premium' | 'vip' = 'regular';
      let price = 250;

      if (rowIndex <= 2) {
        type = 'vip';
        price = 500;
      } else if (rowIndex <= 4) {
        type = 'premium';
        price = 350;
      }

      // Randomly book some seats for realism
      const random = Math.random();
      let status: Seat['status'] = 'available';
      if (random < 0.15) status = 'booked';

      seats.push({
        id: `${row}${num}`,
        row,
        number: num,
        type,
        price,
        status,
      });
    }
  });

  return seats;
};
