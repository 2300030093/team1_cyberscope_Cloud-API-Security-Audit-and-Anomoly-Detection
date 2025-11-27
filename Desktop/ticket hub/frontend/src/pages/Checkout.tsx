import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, Ticket } from 'lucide-react';
import { toast } from 'sonner';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addBooking, clearSeats } = useBooking();
  
  const { event, show, seats } = location.state || {};
  const [promoCode, setPromoCode] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!event || !show || !seats) {
    navigate('/');
    return null;
  }

  const subtotal = seats.reduce((sum: number, seat: any) => sum + seat.price, 0);
  const convenienceFee = Math.round(subtotal * 0.05);
  const discount = promoCode === 'FIRST' ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + convenienceFee - discount;

  const handleApplyPromo = () => {
    if (promoCode === 'FIRST') {
      toast.success('Promo code applied! 10% discount');
    } else if (promoCode) {
      toast.error('Invalid promo code');
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const booking = {
      id: Math.random().toString(36).substr(2, 9),
      eventId: event.id,
      showId: show.id,
      seats: seats,
      total: total,
      status: 'confirmed' as const,
      qrCode: `TICKET-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      bookingDate: new Date().toISOString(),
    };

    addBooking(booking);
    clearSeats();
    
    toast.success('Payment successful!');
    navigate(`/ticket/${booking.id}`);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Booking Details */}
          <div className="space-y-6">
            <Card className="p-6 border-border">
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-20 h-28 object-cover rounded"
                />
                <div>
                  <h3 className="font-bold mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(show.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric' 
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">{show.time}</p>
                  <p className="text-sm text-muted-foreground">{show.venue}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="font-medium mb-2">Selected Seats</p>
                <div className="flex flex-wrap gap-2">
                  {seats.map((seat: any) => (
                    <span
                      key={seat.id}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm border border-primary/30"
                    >
                      {seat.id}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Promo Code */}
            <Card className="p-6 border-border">
              <Label htmlFor="promo" className="mb-2 block">Promo Code</Label>
              <div className="flex gap-2">
                <Input
                  id="promo"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="bg-card"
                />
                <Button variant="outline" onClick={handleApplyPromo} className="border-primary/50">
                  Apply
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Try "FIRST" for 10% off
              </p>
            </Card>
          </div>

          {/* Payment Summary */}
          <div>
            <Card className="p-6 border-border sticky top-24">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Convenience Fee</span>
                  <span>₹{convenienceFee}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span className="text-primary">₹{total}</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {processing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Ticket className="h-4 w-4 mr-2" />
                    Complete Payment
                  </>
                )}
              </Button>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  This is a demo checkout. No actual payment will be processed.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
