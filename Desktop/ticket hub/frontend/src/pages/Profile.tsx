import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket, User, Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockEvents } from '@/services/mockData';

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { bookings } = useBooking();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile */}
          <Card className="p-6 border-border h-fit">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-1">{user?.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
              {user?.phone && (
                <p className="text-sm text-muted-foreground">{user.phone}</p>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Bookings</span>
                <span className="font-bold">{bookings.length}</span>
              </div>
            </div>
          </Card>

          {/* Bookings */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
            
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const event = mockEvents.find(e => e.id === booking.eventId);
                  if (!event) return null;

                  return (
                    <Card key={booking.id} className="p-6 border-border hover:border-primary/50 transition-all">
                      <div className="flex gap-4">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-24 h-32 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-lg">{event.title}</h3>
                              <Badge variant="outline" className="mt-1 border-primary/50">
                                {booking.status}
                              </Badge>
                            </div>
                            <span className="text-lg font-bold text-primary">₹{booking.total}</span>
                          </div>
                          
                          <div className="space-y-2 text-sm text-muted-foreground mt-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(booking.bookingDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Ticket className="h-4 w-4" />
                              <span>{booking.seats.length} seat(s): {booking.seats.map(s => s.id).join(', ')}</span>
                            </div>
                          </div>

                          <div className="mt-4">
                            <Button
                              onClick={() => navigate(`/ticket/${booking.id}`)}
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                              View Ticket
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-12 text-center border-border">
                <Ticket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring events and book your first ticket!
                </p>
                <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Browse Events
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
