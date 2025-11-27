import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, Calendar, MapPin, Ticket } from 'lucide-react';
import { mockEvents, mockShows } from '@/services/mockData';

export default function TicketPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { bookings } = useBooking();

  const booking = bookings.find(b => b.id === bookingId);
  const event = booking ? mockEvents.find(e => e.id === booking.eventId) : null;
  const show = booking ? mockShows[booking.eventId]?.find(s => s.id === booking.showId) : null;

  if (!booking || !event || !show) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Ticket not found</h1>
        <Button onClick={() => navigate('/profile')}>View My Bookings</Button>
      </div>
    );
  }

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ticket-${booking.id}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/profile')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-green-500 mb-4">
            <Ticket className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">Your tickets are ready</p>
        </div>

        <Card className="overflow-hidden border-border">
          {/* Header with event image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>

          <div className="p-8">
            {/* Event Details */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
              
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>
                    {new Date(show.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} at {show.time}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{show.venue}</span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-8">
              <div className="p-6 bg-white rounded-lg">
                <QRCodeSVG
                  id="qr-code"
                  value={booking.qrCode}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4 mb-8 p-6 bg-muted/50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-mono font-medium">{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats</span>
                <span className="font-medium">
                  {booking.seats.map(s => s.id).join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Number of Tickets</span>
                <span className="font-medium">{booking.seats.length}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-4">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="font-bold text-xl text-primary">₹{booking.total}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={handleDownload}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Ticket
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
                className="border-border"
              >
                View All Bookings
              </Button>
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <p className="text-sm text-amber-600 dark:text-amber-400">
                <strong>Important:</strong> Please show this QR code at the venue entrance for verification.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
