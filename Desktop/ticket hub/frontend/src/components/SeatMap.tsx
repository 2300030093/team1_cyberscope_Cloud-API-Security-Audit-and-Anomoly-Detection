import { useState, useEffect } from 'react';
import { Seat } from '@/types';
import { cn } from '@/lib/utils';
import { Armchair } from 'lucide-react';

interface SeatMapProps {
  seats: Seat[];
  onSeatSelect: (seat: Seat) => void;
  onSeatDeselect: (seatId: string) => void;
  selectedSeats: Seat[];
}

export const SeatMap = ({ seats, onSeatSelect, onSeatDeselect, selectedSeats }: SeatMapProps) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  const rows = Array.from(new Set(seats.map(s => s.row))).sort();
  
  const getSeatColor = (seat: Seat) => {
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSelected) return 'bg-primary text-primary-foreground border-primary';
    if (seat.status === 'booked') return 'bg-muted text-muted-foreground cursor-not-allowed opacity-50';
    if (seat.status === 'locked') return 'bg-destructive/20 text-destructive border-destructive cursor-not-allowed';
    
    // Available seats by type
    if (seat.type === 'vip') return 'bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20';
    if (seat.type === 'premium') return 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20';
    return 'bg-card text-foreground border-border hover:bg-muted';
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked' || seat.status === 'locked') return;
    
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    if (isSelected) {
      onSeatDeselect(seat.id);
    } else {
      onSeatSelect(seat);
    }
  };

  return (
    <div className="w-full">
      {/* Screen */}
      <div className="mb-12">
        <div className="h-2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mb-2" />
        <p className="text-center text-sm text-muted-foreground">Screen</p>
      </div>

      {/* Seat Grid */}
      <div className="space-y-3 flex flex-col items-center">
        {rows.map(row => {
          const rowSeats = seats.filter(s => s.row === row).sort((a, b) => a.number - b.number);
          
          return (
            <div key={row} className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground w-6 text-center">{row}</span>
              <div className="flex gap-2">
                {rowSeats.map(seat => (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    onMouseEnter={() => setHoveredSeat(seat.id)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    disabled={seat.status === 'booked' || seat.status === 'locked'}
                    className={cn(
                      'w-8 h-8 rounded-md border-2 transition-all duration-200 relative group',
                      getSeatColor(seat),
                      hoveredSeat === seat.id && seat.status === 'available' && 'scale-110',
                    )}
                  >
                    <Armchair className="w-4 h-4 mx-auto" />
                    
                    {/* Tooltip */}
                    {hoveredSeat === seat.id && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded whitespace-nowrap border border-border z-10">
                        {seat.id} - ₹{seat.price} ({seat.type})
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-card border-2 border-border" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary border-2 border-primary" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-muted opacity-50 border-2 border-border" />
          <span className="text-muted-foreground">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-500/10 border-2 border-amber-500/30" />
          <span className="text-muted-foreground">VIP</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-500/10 border-2 border-blue-500/30" />
          <span className="text-muted-foreground">Premium</span>
        </div>
      </div>
    </div>
  );
};
