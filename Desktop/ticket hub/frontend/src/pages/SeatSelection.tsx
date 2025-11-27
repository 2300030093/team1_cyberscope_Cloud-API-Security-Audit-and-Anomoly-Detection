import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { SeatMap } from '@/components/SeatMap';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/context/AuthContext';
import { generateSeats } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Clock } from 'lucide-react';
import { Seat } from '@/types';
import { toast } from 'sonner';

export default function SeatSelection() {
  const { showId } = useParams<{ showId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { selectedSeats, addSeat, removeSeat, clearSeats } = useBooking();
  
  const { event, show } = location.state || {};
  const [seats, setSeats] = useState<Seat[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer

  useEffect(() => {
    if (showId) {
      setSeats(generateSeats(showId));
    }
    clearSeats();
  }, [showId]);

  // Countdown timer
  useEffect(() => {
    if (selectedSeats.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearSeats();
          toast.error('Time expired! Please select seats again.');
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSeats.length]);

  const handleSeatSelect = (seat: Seat) => {
    if (selectedSeats.length >= 10) {
      toast.error('Maximum 10 seats can be selected');
      return;
    }
    addSeat({ ...seat, status: 'selected' });
    toast.success(`Seat ${seat.id} selected`);
  };

  const handleSeatDeselect = (seatId: string) => {
    removeSeat(seatId);
    toast.info(`Seat ${seatId} deselected`);
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/auth', { state: { from: location.pathname } });
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    navigate('/checkout', { state: { event, show, seats: selectedSeats } });
  };

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!event || !show) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid show selection</h1>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <Card className="p-6 border-border">
              <h2 className="text-2xl font-bold mb-6">Select Your Seats</h2>
              <SeatMap
                seats={seats}
                onSeatSelect={handleSeatSelect}
                onSeatDeselect={handleSeatDeselect}
                selectedSeats={selectedSeats}
              />
            </Card>
          </div>

          {/* Booking Summary */}
          <div>
            <Card className="p-6 border-border sticky top-24">
              <h3 className="font-bold mb-4">{event.title}</h3>
              
              <div className="space-y-2 text-sm mb-6">
                <p className="text-muted-foreground">
                  {new Date(show.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  {' '} at {show.time}
                </p>
                <p className="text-muted-foreground">{show.venue}</p>
              </div>

              {selectedSeats.length > 0 && (
                <>
                  <div className="flex items-center gap-2 text-sm text-amber-500 mb-4 bg-amber-500/10 p-3 rounded-lg">
                    <Clock className="h-4 w-4" />
                    <span>
                      {minutes}:{seconds.toString().padStart(2, '0')} remaining
                    </span>
                  </div>

                  <div className="border-t border-border pt-4 mb-4">
                    <p className="text-sm font-medium mb-3">Selected Seats:</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedSeats.map(seat => (
                        <span
                          key={seat.id}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded border border-primary/30"
                        >
                          {seat.id}
                        </span>
                      ))}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{totalAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Convenience Fee</span>
                        <span>₹{Math.round(totalAmount * 0.05)}</span>
                      </div>
                      <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span className="text-primary">₹{totalAmount + Math.round(totalAmount * 0.05)}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Button
                onClick={handleProceedToCheckout}
                disabled={selectedSeats.length === 0}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Proceed to Checkout
              </Button>

              {selectedSeats.length === 0 && (
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Select seats to continue
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
