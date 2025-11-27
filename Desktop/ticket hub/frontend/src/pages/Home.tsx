import { useState } from 'react';
import { EventCard } from '@/components/EventCard';
import { mockEvents } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles } from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'movies', label: 'Movies' },
    { id: 'concerts', label: 'Concerts' },
    { id: 'sports', label: 'Sports' },
    { id: 'theatre', label: 'Theatre' },
  ];

  const filteredEvents = mockEvents.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredEvents = mockEvents.filter(e => e.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Experience Premium Entertainment
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Book tickets to the finest movies, concerts, sports events, and theatre shows
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for events, movies, concerts..."
              className="pl-12 h-14 bg-card border-border text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Categories */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.id)}
              className={selectedCategory === cat.id ? 'bg-primary text-primary-foreground' : 'border-border'}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Featured Events */}
        {selectedCategory === 'all' && featuredEvents.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Featured Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* All Events */}
        <div>
          <h2 className="text-3xl font-bold mb-6">
            {selectedCategory === 'all' ? 'All Events' : categories.find(c => c.id === selectedCategory)?.label}
          </h2>
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No events found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
