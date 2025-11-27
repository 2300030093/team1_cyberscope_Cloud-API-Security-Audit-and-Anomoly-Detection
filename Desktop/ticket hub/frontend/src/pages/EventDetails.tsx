import { useParams, useNavigate } from 'react-router-dom';
import { mockEvents, mockShows } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, MapPin, Star, ArrowLeft } from 'lucide-react';
import { Show } from '@/types';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const event = mockEvents.find(e => e.id === id);
  const shows = mockShows[id || ''] || [];

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  const handleSelectShow = (show: Show) => {
    navigate(`/shows/${show.id}`, { state: { event, show } });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-start gap-4">
            {event.featured && (
              <Badge className="bg-primary text-primary-foreground">Featured</Badge>
            )}
            <Badge variant="outline" className="border-primary/50">
              {event.category.toUpperCase()}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-4">{event.title}</h1>
          
          <div className="flex flex-wrap gap-6 text-muted-foreground">
            {event.rating && (
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="font-semibold">{event.rating}/5</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{event.duration}</span>
            </div>
            {event.language && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">{event.language}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              {event.genre && (
                <div className="mt-4">
                  <span className="text-sm text-muted-foreground">Genre: </span>
                  <span className="text-sm font-medium">{event.genre}</span>
                </div>
              )}
            </div>

            {/* Shows */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Select Show Time</h2>
              {shows.length > 0 ? (
                <div className="space-y-4">
                  {shows.map((show) => (
                    <Card key={show.id} className="p-6 border-border hover:border-primary/50 transition-all cursor-pointer" onClick={() => handleSelectShow(show)}>
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(show.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{show.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{show.venue}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {show.availableSeats} seats available
                          </p>
                        </div>
                        <div className="flex flex-col justify-center items-start sm:items-end gap-2">
                          <div className="text-2xl font-bold text-primary">₹{show.price}</div>
                          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Select Seats
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center border-border">
                  <p className="text-muted-foreground">No shows available at the moment. Please check back later.</p>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="p-6 border-border sticky top-24">
              <h3 className="font-bold mb-4">Event Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <p className="font-medium capitalize">{event.category}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <p className="font-medium">{event.duration}</p>
                </div>
                {event.language && (
                  <div>
                    <span className="text-muted-foreground">Language:</span>
                    <p className="font-medium">{event.language}</p>
                  </div>
                )}
                {event.genre && (
                  <div>
                    <span className="text-muted-foreground">Genre:</span>
                    <p className="font-medium">{event.genre}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
