import { Link } from 'react-router-dom';
import { Event } from '@/types';
import { Star, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  return (
    <Link to={`/events/${event.id}`}>
      <Card className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] bg-card">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60" />
          
          {event.featured && (
            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground border-none">
              Featured
            </Badge>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {event.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span>{event.rating}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{event.duration}</span>
              </div>
            </div>
            {event.genre && (
              <p className="text-xs text-muted-foreground mt-2">{event.genre}</p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
