import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Phone, Clock, Users, Star } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://your-backend-domain.com';

interface Office {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  agentCount: number;
  rating: number;
  reviewCount: number;
  specialties: string[];
  image: string;
}

const OfficeResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const { data: offices, isLoading, error } = useQuery({
    queryKey: ['offices', searchParams.toString()],
    queryFn: async (): Promise<Office[]> => {
      const response = await fetch(`${API_BASE}/api/search/offices?${searchParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch offices');
      return response.json();
    },
  });

  // Mock data fallback
  const mockOffices: Office[] = [
    {
      id: '1',
      name: 'Hodges & Fooshee Realty - Downtown',
      address: '123 Music Row, Nashville, TN 37203',
      phone: '(615) 555-0100',
      email: 'downtown@hfrealty.com',
      website: 'https://hodgesfooshee.com',
      hours: 'Mon-Fri 9AM-6PM, Sat-Sun 10AM-4PM',
      agentCount: 25,
      rating: 4.9,
      reviewCount: 234,
      specialties: ['Luxury Properties', 'Commercial Real Estate', 'Investment Properties'],
      image: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Hodges & Fooshee Realty - Belle Meade',
      address: '456 Belle Meade Blvd, Nashville, TN 37205',
      phone: '(615) 555-0200',
      email: 'bellemeade@hfrealty.com',
      website: 'https://hodgesfooshee.com',
      hours: 'Mon-Fri 8AM-7PM, Sat-Sun 9AM-5PM',
      agentCount: 18,
      rating: 4.8,
      reviewCount: 189,
      specialties: ['Luxury Homes', 'Estates', 'Historic Properties'],
      image: '/placeholder.svg'
    }
  ];

  const displayOffices = offices || mockOffices;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="glass mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>
          
          <h1 className="text-4xl font-display font-bold text-gradient mb-2">
            Real Estate Offices
          </h1>
          <p className="text-muted-foreground">
            Found {displayOffices.length} professional real estate offices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayOffices.map((office) => (
            <Card key={office.id} className="result-card">
              <div className="relative">
                <img 
                  src={office.image}
                  alt={office.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 right-3 flex items-center glass-light px-2 py-1 rounded">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="font-semibold">{office.rating}</span>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="font-display text-xl">{office.name}</CardTitle>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  {office.address}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 glass-light rounded-lg">
                    <div className="text-lg font-semibold">{office.agentCount}</div>
                    <div className="text-sm text-muted-foreground">Agents</div>
                  </div>
                  <div className="text-center p-3 glass-light rounded-lg">
                    <div className="text-lg font-semibold">{office.reviewCount}</div>
                    <div className="text-sm text-muted-foreground">Reviews</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-2">Office Hours</div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {office.hours}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-2">Specialties</div>
                  <div className="flex flex-wrap gap-1">
                    {office.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full btn-glass" asChild>
                    <a href={`tel:${office.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      {office.phone}
                    </a>
                  </Button>
                  <Link to={`/search/agents?office=${office.id}`}>
                    <Button className="w-full btn-glass">
                      <Users className="w-4 h-4 mr-2" />
                      View {office.agentCount} Agents
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfficeResults;