import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Clock, MapPin, Home } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://your-backend-domain.com';

interface OpenHouse {
  id: string;
  propertyId: string;
  title: string;
  address: string;
  price: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  image: string;
}

const OpenHouseResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const { data: openHousesData, isLoading, error } = useQuery({
    queryKey: ['openhouses', searchParams.toString()],
    queryFn: async () => {
      const response = await fetch(`https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/search-openhouses?${searchParams}`, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch open houses');
      const data = await response.json();
      return data;
    },
  });

  const openHouses = openHousesData?.openHouses || [];

  // Mock data fallback
  const mockOpenHouses: OpenHouse[] = [
    {
      id: '1',
      propertyId: '1',
      title: 'Modern Luxury Home in Belle Meade',
      address: '1234 Belle Meade Blvd, Nashville, TN 37205',
      price: 1250000,
      date: '2024-01-20',
      startTime: '2:00 PM',
      endTime: '4:00 PM',
      status: 'Scheduled',
      image: '/placeholder.svg'
    },
    {
      id: '2',
      propertyId: '2',
      title: 'Contemporary Condo Downtown',
      address: '567 Music Row, Nashville, TN 37203',
      price: 650000,
      date: '2024-01-21',
      startTime: '1:00 PM',
      endTime: '3:00 PM',
      status: 'Scheduled',
      image: '/placeholder.svg'
    }
  ];

  const displayOpenHouses = openHouses || mockOpenHouses;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="glass">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
            Open House Results
          </h1>
          <p className="text-muted-foreground">
            Found {displayOpenHouses.length} open houses matching your criteria
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayOpenHouses.map((openHouse) => (
            <Card key={openHouse.id} className="result-card">
              <div className="relative">
                <img 
                  src={openHouse.image} 
                  alt={openHouse.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-3 left-3">
                  {openHouse.status}
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-gradient mb-2">
                  ${openHouse.price.toLocaleString()}
                </div>
                
                <h3 className="font-display font-semibold text-lg mb-2">
                  {openHouse.title}
                </h3>
                
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{openHouse.address}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(openHouse.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {openHouse.startTime} - {openHouse.endTime}
                  </div>
                </div>
                
                <Link to={`/property/${openHouse.propertyId}`}>
                  <Button className="w-full btn-glass">
                    <Home className="w-4 h-4 mr-2" />
                    View Property
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpenHouseResults;