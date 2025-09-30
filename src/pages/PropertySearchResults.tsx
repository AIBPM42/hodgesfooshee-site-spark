import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Bed, Bath, Square, MapPin, DollarSign } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://your-backend-domain.com';

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  status: string;
  listingType: string;
}

const PropertySearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [authStatus, setAuthStatus] = React.useState<'loading' | 'ready' | 'error'>('loading');
  
  const { data: propertiesData, isLoading, error } = useQuery({
    queryKey: ['properties', searchParams.toString()],
    queryFn: async () => {
      const response = await fetch(`https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/search-properties?${searchParams}`, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        setAuthStatus('error');
        throw new Error(`API Error: ${response.status}`);
      }
      const data = await response.json();
      setAuthStatus('ready');
      return data;
    },
    retry: (failureCount, error) => {
      // Retry up to 2 times for OAuth token errors
      const errorMessage = error?.message || '';
      if (errorMessage.includes('OAuth') && failureCount < 2) return true;
      return false;
    }
  });

  React.useEffect(() => {
    if (error) setAuthStatus('error');
  }, [error]);

  const properties = propertiesData?.properties || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
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
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="glass overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card className="glass max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-display font-semibold mb-4">Search Error</h2>
            <p className="text-muted-foreground mb-6">
              Unable to load properties. Please try again later.
            </p>
            <Link to="/">
              <Button className="btn-primary">
                Return to Search
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock data fallback when API isn't ready
  const mockProperties: Property[] = [
    {
      id: '1',
      title: 'Modern Luxury Home in Belle Meade',
      address: '1234 Belle Meade Blvd, Nashville, TN 37205',
      price: 1250000,
      beds: 4,
      baths: 3,
      sqft: 3200,
      image: '/placeholder.svg',
      status: 'Active',
      listingType: 'For Sale'
    },
    {
      id: '2',
      title: 'Contemporary Condo Downtown',
      address: '567 Music Row, Nashville, TN 37203',
      price: 650000,
      beds: 2,
      baths: 2,
      sqft: 1800,
      image: '/placeholder.svg',
      status: 'Active',
      listingType: 'For Sale'
    },
    {
      id: '3',
      title: 'Historic Home in Music Row',
      address: '890 16th Ave S, Nashville, TN 37212',
      price: 950000,
      beds: 3,
      baths: 2,
      sqft: 2400,
      image: '/placeholder.svg',
      status: 'Pending',
      listingType: 'For Sale'
    }
  ];

  const displayProperties = properties || mockProperties;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="glass mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>
          
          <h1 className="text-4xl font-display font-bold text-gradient mb-2">
            Property Search Results
          </h1>
          <p className="text-muted-foreground">
            Found {displayProperties.length} properties matching your criteria
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProperties.map((property) => (
            <Card key={property.id} className="property-card">
              <div className="relative">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <Badge 
                  variant={property.status === 'Active' ? 'default' : 'secondary'}
                  className="absolute top-3 left-3"
                >
                  {property.status}
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gradient">
                    {formatPrice(property.price)}
                  </span>
                  <Badge variant="outline">{property.listingType}</Badge>
                </div>
                
                <h3 className="font-display font-semibold text-lg mb-2 line-clamp-2">
                  {property.title}
                </h3>
                
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.address}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      {property.beds}
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      {property.baths}
                    </div>
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-1" />
                      {property.sqft.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <Link to={`/property/${property.id}`}>
                  <Button className="w-full btn-glass">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {displayProperties.length === 0 && (
          <Card className="glass text-center p-12">
            <CardContent>
              <h2 className="text-2xl font-display font-semibold mb-4">No Properties Found</h2>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or browse all available properties.
              </p>
              <Link to="/">
                <Button className="btn-primary">
                  New Search
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PropertySearchResults;